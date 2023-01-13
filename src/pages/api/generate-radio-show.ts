// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as sdk from 'microsoft-cognitiveservices-speech-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

type Data = {
  name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const radioShow = JSON.parse(req.body)?.radioShow

  if (!radioShow || typeof radioShow !== 'string') {
    res.status(400).json({ name: 'Bad Request' })
    return
  }

  const speechKey = process.env.SPEECH_KEY
  const speechRegion = process.env.SPEECH_REGION

  if (!speechKey || !speechRegion) {
    res.status(500).json({ name: 'Internal Server Error' })
    return
  }

  const audioFile = path.join(process.cwd(), 'output.wav')

  const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion)
  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile)

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig)

  const ssml = `
    <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US">
      <voice name="en-US-JennyNeural">
        <mstts:express-as style="shouting">
          ${radioShow}
        </mstts:express-as>
      </voice>
      <voice name="en-US-GuyNeural">
        <mstts:express-as style="excited">
          Good morning to you too Jenny!
        </mstts:express-as>
      </voice>
    </speak>
  `

  await new Promise<void>((resolve, reject) => {
    synthesizer.speakSsmlAsync(
      ssml,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log('synthesis finished.')
          resolve()
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

  console.log('Now synthesizing to: ' + audioFile)

  console.log(radioShow)

  res.status(200).json({ name: 'John Doe' })
}
