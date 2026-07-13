'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Progress } from '@/components/ui/progress'

export default function SplashPage() {
 const router = useRouter()
 const [progress, setProgress] = useState(0)

 useEffect(() => {
  const duration = 2500
  const interval = 25
  const step = 100 / (duration / interval)

  const timer = setInterval(() => {
   setProgress((prev) => {
    const next = Math.min(prev + step, 100)

    if (next >= 100) {
     clearInterval(timer)
     router.replace('/onboarding')
    }

    return next
   })
  }, interval)

  return () => clearInterval(timer)
 }, [router])

 return (
  <div className='relative flex h-screen w-full flex-col items-center justify-center bg-[#1D140F] px-8 md:h-[860px] md:max-w-[430px] md:rounded-[36px] md:shadow-xl'>
   <div className='text-center space-y-6'>
    <h1 className='text-5xl font-serif text-white'>AI Bro</h1>
    <p className='text-sm text-[#D6CFC8]'>Ваш персональный гид по меню</p>
    <Progress value={progress} className='h-1 bg-[#C8713A]' />
   </div>
  </div>
 )
}
