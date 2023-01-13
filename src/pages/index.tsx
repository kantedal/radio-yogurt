import PrivacyPolicy from '@/components/PrivacyPolicy'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import z from 'zod'
import logo from '../assets/logo.svg'

// const inter = Inter({ subsets: ["latin"] });

const schema = z.object({
  radioShow: z.string(),
  privacyPolicyAccepted: z.boolean(),
})

const Home: NextPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  const { pathname, asPath } = useRouter()

  const handleCreateRadioShow = handleSubmit(async (data) => {
    console.log(data, process.env.NEXT_PUBLIC_URL)

    const toastId = toast.loading('Generating radio show...')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/generate-radio-show`, {
        method: 'POST',
        body: JSON.stringify({
          radioShow: data.radioShow,
        }),
      })

      toast.success('Radio show generated!', { id: toastId })
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong', { id: toastId })
    }

    reset()
  })

  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false)
  const handleTogglePrivacyPolicyOpen = () => setPrivacyPolicyOpen(!privacyPolicyOpen)

  return (
    <main className='min-h-screen flex items-center justify-center bg-radio-yogurt-light-tertiary'>
      <form onSubmit={handleCreateRadioShow} className='w-full max-w-xl mx-auto flex flex-col justify-center items-center gap-6'>
        <Image src={logo} alt='Logo puss' className='w-full max-w-[200px]' />
        {/* <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="radio"
          >
            Radio program
          </label> */}
        <textarea
          placeholder='Enter radio program...'
          className='block w-full rounded-md border border-radio-yogurt-secondary shadow-sm focus:border-radio-yogurt-primary focus:ring-red-500 sm:text-sm'
          rows={15}
          {...register('radioShow')}
        />
        <div className='flex flex-col items-start justify-start w-full'>
          <div className='relative flex items-start'>
            <div className='flex h-5 items-'>
              <input
                type='checkbox'
                className='h-4 w-4 rounded border-gray-300 text-radio-yogurt-primary focus:ring-radio-yogurt-primary'
                {...register('privacyPolicyAccepted')}
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
          type='submit'
          className={clsx(
            'inline-flex items-center justify-center rounded-md border border-transparent bg-radio-yogurt-primary px-6 py-3 text-base font-medium text-white mt-4',
            'shadow-sm hover:bg-radio-yogurt-light-primary/80 focus:outline-none focus:ring-2 focus:ring-radio-yogurt-primary focus:ring-offset-2',
            'w-full',
          )}
        >
          Generate radio program
        </button>
      </form>
    </main>
  )
}

export default Home
