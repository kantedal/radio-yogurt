import { spawn } from 'child_process'
import ffmpeg_static from 'ffmpeg-static'
import fs from 'fs'
import * as sdk from 'microsoft-cognitiveservices-speech-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { z } from 'zod'

const createVideo = async (soundSrc: string, duration: number) => {
  console.log(ffmpeg_static)
  return new Promise<string>((resolve, reject) => {
    const outputpath = 'output/result.mp4'
    const imageInput = path.join(process.cwd(), 'src/pages/api/background.png')
    const bgMusicInput = path.join(process.cwd(), 'src/pages/api/bgmusic.mp3')
    const output = path.join(process.cwd(), outputpath)
    const cmd = `${ffmpeg_static} -i ${imageInput} -i ${bgMusicInput} -i ${soundSrc} -map 0:v -map 1:a -map 2:a -c copy -t ${
      duration / 10000000
    } ${output}`
    // /Users/jakobpalson/Jobb/git/radio-yogurt/node_modules/ffmpeg-static/ffmpeg -y -loop 1 -i ../src/pages/api/background.png -i ./voiceGeneration.wav -i ../src/pages/api/bgmusic.mp3 -filter_complex "[1]volume=1[a1];[2]volume=0.05[a2];[a1][a2]amix=inputs=2[a]" -map 0:v -map "[a]" -t 20 result.mp4
    const args = [
      '-y',
      '-loop',
      '1',
      '-i',
      imageInput,

      '-i',
      soundSrc,
      '-i',
      bgMusicInput,
      '-filter_complex',
      '[1]volume=1[a1];[2]volume=0.05[a2];[a1][a2]amix=inputs=2[a]',
      '-map',
      '0:v',
      '-map',
      '[a]',
      '-t',
      `${duration / 10000000 + 1}`,
      `${output}`,
    ]
    const subProcess = spawn(`${ffmpeg_static}`, args)

    subProcess.stdout.on('data', (data) => {
      console.log(`stdout:\n${data}`)
    })
    subProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`)
    })
    subProcess.on('error', (error) => {
      console.error(`error: ${error.message}`)
    })
    subProcess.on('close', (code) => {
      resolve(output)
      console.log(`child process salida ${code}`)
    })
    // exec(cmd, (error, stdout, stderr) => {
    //   if (error) {
    //     reject(error.message)
    //     return
    //   }
    //   if (stderr) {
    //     reject(stderr)
    //     return
    //   }
    //   console.log('done: ', stdout)
    //   resolve(output)
    // })

    //   ffmpeg()
    //     .setFfmpegPath(ffmpeg_static as any)
    //     .addInput(path.join(process.cwd(), 'src/pages/api/background.png'))
    //     .addInput(path.join(process.cwd(), 'src/pages/api/bgmusic.mp3'))
    //     .addInput(soundSrc)
    //     .audioCodec('copy')

    //     .addOption(['-map 0:v', '-map 1:a', '-map 2:a'])
    //     // .size('1080x1350')
    //     .duration(duration / 10000000 + 1)
    //     .on('end', async () => {
    //       console.log('Processing finished')
    //       resolve(outputpath)
    //     })
    //     .on('error', (err) => {
    //       reject(err)
    //     })
    //     .save(path.join(process.cwd(), outputpath))
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

  const radioShowRes = await radioShowSchema.safeParseAsync(radioShow_)
  if (!radioShowRes.success) {
    return res.status(400).json({ name: 'Bad Request' })
  }

  const radioShow = radioShowRes.data
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

  const outputpath = await createVideo(generatedVoiceSrc, duration)

  const videoBuffer = fs.readFileSync(outputpath)
  res.setHeader('Content-Type', 'video/mp4')
  return res.status(200).send(videoBuffer)
}
