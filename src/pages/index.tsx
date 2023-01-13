import PrivacyPolicy from '@/components/PrivacyPolicy'
import VoiceSelector, { VoiceConfig } from '@/components/VoiceSelector'
import saveVideoFile from '@/utils/saveVideoFile'
import voices from '@/utils/voices'
import clsx from 'clsx'
import { NextPage } from 'next'
import Image from 'next/image'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDebounce } from 'react-use'
import logo from '../assets/logo.svg'

// const inter = Inter({ subsets: ["latin"] });

const Home: NextPage = () => {
  const [radioShow, setRadioShow] = useState('')
  const handleChangeRadioShow = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => setRadioShow(e.target.value), [])

  const [voicesInShow, setVoicesInShow] = useState<VoiceConfig[]>([{ name: 'DavisNeural', type: 'shouting' }])
  const handleAddVoice = () => setVoicesInShow([...voicesInShow, { name: 'DavisNeural', type: 'shouting' }])

  const [debouncedRadioShow, setDebouncedRadioShow] = useState(radioShow)
  useDebounce(() => setDebouncedRadioShow(radioShow), 500, [radioShow])

  useEffect(() => {
    if (!debouncedRadioShow) {
      return
    }

    const peopleInShow: string[] = []
    debouncedRadioShow
      .split('#')
      .filter((voice) => voice !== '')
      .map((voice) => voice.trim())
      .forEach((voice) => {
        const voiceName = voice.split(':')[0]
        const text = voice.split(':')[1]
        if (!peopleInShow.includes(voiceName) && text) {
          peopleInShow.push(voiceName)
        }
      })

    console.log(peopleInShow)

    if (peopleInShow.length !== voicesInShow.length) {
      setVoicesInShow(
        peopleInShow.map((person) => {
          const voice = voices[Math.floor(Math.random() * voices.length)]
          return {
            person,
            name: voice.name,
            type: voice.types.length === 0 ? undefined : voice.types[Math.floor(Math.random() * voice.types.length)],
          }
        }),
      )
    } else if (peopleInShow.length === 0) {
      setVoicesInShow([{ name: 'DavisNeural', type: 'shouting' }])
    }
    // eslint-disable-next-line
  }, [debouncedRadioShow])

  const handleCreateRadioShow = async () => {
    if (!radioShow) {
    }

    const toastId = toast.loading('Generating radio show...')
    try {
      const voicesInRadioShow = radioShow
        .split('#')
        .filter((voice) => voice !== '')
        .map((voice) => voice.trim())

      const peopleInShow: string[] = []

      voicesInRadioShow.forEach((voice) => {
        const voiceName = voice.split(':')[0]
        if (!peopleInShow.includes(voiceName)) {
          peopleInShow.push(voiceName)
        }
      })

      const parsedRadioShow = voicesInRadioShow.map((v) => {
        console.log(v)
        const voiceName = v.split(':')[0]
        const voiceText = v.split(':')[1]

        const voice = voicesInShow.find((voice) => voice.person === voiceName) || { name: 'DavisNeural', type: 'shouting' }

        return {
          name: voice.name,
          type: voice.type,
          text: voiceText || voiceName,
        }
      })

      console.log(parsedRadioShow)

      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/generate-radio-show`, {
        method: 'POST',
        body: JSON.stringify(parsedRadioShow),
      })

      if (res.status !== 200) {
        throw new Error('Something went wrong')
      }

      console.log('hehe')

      const blob = await res.blob()
      saveVideoFile(blob)

      toast.success('Radio show generated!', { id: toastId })
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong', { id: toastId })
    }
  }

  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false)
  const handleTogglePrivacyPolicyOpen = () => setPrivacyPolicyOpen(!privacyPolicyOpen)

  return (
    <main className='min-h-screen flex items-center justify-center bg-radio-yogurt-light-tertiary p-6'>
      <div className='w-full max-w-5xl mx-auto flex flex-col gap-8'>
        <div className='flex items-center justify-center'>
          <Image src={logo} alt='Logo puss' className='w-full max-w-[200px]' />
        </div>
        <textarea
          placeholder='Enter radio program...'
          className='block w-full rounded-md border border-radio-yogurt-secondary shadow-sm focus:border-radio-yogurt-primary focus:ring-red-500 sm:text-sm'
          rows={20}
          value={radioShow}
          onChange={handleChangeRadioShow}
        />

        <div className='flex flex-col gap-3'>
          {voicesInShow.map((voice, index) => (
            <VoiceSelector
              key={index}
              voiceConfig={voice}
              onChange={(voice) => {
                setVoicesInShow(
                  voicesInShow.map((current, i) => {
                    if (index === i) {
                      return voice
                    }
                    return current
                  }),
                )
              }}
            />
          ))}
        </div>

        <div className='flex flex-col items-start justify-start w-full'>
          <div className='relative flex items-start'>
            <div className='flex h-5 items-'>
              <input
                type='checkbox'
                className='h-4 w-4 rounded border-gray-300 text-radio-yogurt-primary focus:ring-radio-yogurt-primary'
              />
            </div>
            <div className='ml-3 text-sm'>
              <label className='font-medium text-gray-700'>
                I accept the{' '}
                <span onClick={handleTogglePrivacyPolicyOpen} className='font-bold cursor-pointer'>
                  privacy policy
                </span>
              </label>
            </div>
          </div>

          {privacyPolicyOpen && <PrivacyPolicy onClose={handleTogglePrivacyPolicyOpen} />}
        </div>

        <button
          onClick={handleCreateRadioShow}
          className={clsx(
            'inline-flex items-center justify-center rounded-md border border-transparent bg-radio-yogurt-primary px-6 py-3 text-base font-medium text-white mt-4',
            'shadow-sm hover:bg-radio-yogurt-light-primary/80 focus:outline-none focus:ring-2 focus:ring-radio-yogurt-primary focus:ring-offset-2',
            'w-full',
          )}
        >
          Generate radio program
        </button>
      </div>
    </main>
  )
}

export default Home
