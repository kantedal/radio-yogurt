import ffmpeg_static from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import * as sdk from 'microsoft-cognitiveservices-speech-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { z } from 'zod'

const createVideo = async (soundSrc: string) => {
  return new Promise<string>((resolve, reject) => {
    const outputpath = 'output/result.mp4'
    ffmpeg()
      .setFfmpegPath(ffmpeg_static as any)
      .addInput(path.join(process.cwd(), 'src/pages/api/background.png'))
      .addInput(soundSrc)
      .size('1080x1350')

      .on('end', async () => {
        console.log('Processing finished')
        resolve(outputpath)
      })
      .on('error', (err) => {
        reject(err)
      })
      .save(path.join(process.cwd(), outputpath))
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const radioShow_ = JSON.parse(req.body)

  const radioShowSchema = z
    .object({
      name: z.string(),
      type: z.string().nullish(),
      text: z.string(),
    })
    .array()

  const radioShow = radioShowSchema.parse(radioShow_)

  console.log(radioShow)

  let ssmlString = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">`
  radioShow.forEach((voice) => {
    if (voice.type) {
      ssmlString += `<voice name="en-US-${voice.name}"><mstts:express-as style="${voice.type}">${voice.text}</mstts:express-as></voice>`
    } else {
      ssmlString += `<voice name="en-US-${voice.name}">${voice.text}</voice>`
    }
  })
  ssmlString += `</speak>`

  console.log(ssmlString)

  const speechKey = process.env.SPEECH_KEY
  const speechRegion = process.env.SPEECH_REGION

  if (!speechKey || !speechRegion) {
    res.status(500).json({ name: 'Internal Server Error' })
    return
  }

  const generatedVoiceSrc = path.join(process.cwd(), 'output/voiceGeneration.wav')

  const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion)
  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(generatedVoiceSrc)

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig)

  const duration = await new Promise<number>((resolve, reject) => {
    synthesizer.speakSsmlAsync(
      ssmlString,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log('synthesis finished.')
          resolve(result.audioDuration)
        } else {
          console.error('Speech synthesis canceled, ' + result.errorDetails + '\nDid you set the speech resource key and region values?')
          reject()
        }
        synthesizer.close()
      },
      (err) => {
        console.trace('err - ' + err)
        synthesizer.close()
        reject()
      },
    )
  })

  const outputpath = await createVideo(generatedVoiceSrc)

  const videoBuffer = fs.readFileSync(outputpath)
  res.setHeader('Content-Type', 'video/mp4')
  return res.status(200).send(videoBuffer)
}
