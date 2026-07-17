'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/store/use-app-store'

export default function NamePage() {
 const router = useRouter()

 const { setName } = useAppStore()

 const [value, setValue] = useState('')

 const handleContinue = () => {
  if (!value.trim()) return

  setName(value.trim())

  router.push('/scan')
 }

 return (
  <div className='flex h-full w-full flex-col bg-[#F5F3EE] px-6 py-10 md:h-215 md:max-w-107.5 md:rounded-[36px] md:shadow-xl'>
   <div className='mt-12 space-y-3'>
    <h1 className='text-4xl font-semibold text-[#1C1409]'>Как вас зовут?</h1>

    <p className='text-[#7A6A52]'>AI Официант будет обращаться по имени</p>
   </div>

   <div className='mt-12'>
    <Input
     value={value}
     onChange={(e) => setValue(e.target.value)}
     placeholder='Введите имя'
     className='h-14 rounded-2xl border-[#D8D0C4] bg-white text-lg border focus:border-[#C87437] focus:ring-1 focus:ring-[#C87437]'
     autoFocus
    />
   </div>

   <Button
    disabled={!value.trim()}
    onClick={handleContinue}
    className='mt-auto h-14 rounded-full bg-[#C87437] text-base hover:bg-[#B96530]'
   >
    Продолжить
   </Button>
  </div>
 )
}
