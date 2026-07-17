'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
 Carousel,
 CarouselApi,
 CarouselContent,
 CarouselItem,
} from '@/components/ui/carousel'

import { Button } from '@/components/ui/button'
import Image from 'next/image'

const slides = [
 {
  image: '/smart-waiter-onboarding.svg',
  title: 'Персональные\nрекомендации',
  description:
   'Получайте рекомендации блюд на основе ваших предпочтений, аллергий и диетических ограничений.',
 },
 {
  image: '/scan-onboarding.svg',
  title: 'Сканируйте\nменю',
  description:
   'Наведите камеру на меню, и AI мгновенно поможет выбрать лучшие блюда.',
 },
]

export default function OnboardingPage() {
 const router = useRouter()

 const [api, setApi] = useState<CarouselApi>()
 const [current, setCurrent] = useState(0)

 useEffect(() => {
  if (!api) return

  setCurrent(api.selectedScrollSnap())

  const onSelect = () => setCurrent(api.selectedScrollSnap())
  api.on('select', onSelect)

  return () => {
   api.off('select', onSelect)
  }
 }, [api])

 const handleNext = () => {
  if (!api) return

  if (current === slides.length - 1) {
   router.push('/name')
   return
  }

  api.scrollNext()
 }

 return (
  <div className='flex h-full w-full flex-col px-6 py-2'>
   <Carousel
    setApi={setApi}
    opts={{
     align: 'start',
     loop: false,
    }}
    className='w-full flex-1 h-full'
   >
    <CarouselContent className='h-full flex-1'>
     {slides.map((slide) => (
      <CarouselItem key={slide.title} className='h-full'>
       <div className='flex h-full flex-col justify-center items-center space-y-6'>
        <div className='flex items-center justify-center w-70 h-70 rounded-full bg-[#F2EDE4]'>
         <Image
          src={slide.image}
          height={120}
          width={120}
          alt={slide.title}
          className='object-contain'
         />
        </div>

        <div className='space-y-3 text-center'>
         <h2 className='text-2xl font-bold text-[#1C1409]'>{slide.title}</h2>

         <p className='text-sm  text-[#7A6A52]'>{slide.description}</p>
        </div>
       </div>
      </CarouselItem>
     ))}
    </CarouselContent>
   </Carousel>

   <div className='mt-2 flex items-center justify-center gap-2'>
    {slides.map((_, index) => (
     <div
      key={index}
      className={`h-2 rounded-full transition-all ${
       current === index ? 'w-8 bg-[#C87437]' : 'w-2 bg-[#D8D2CB]'
      }`}
     />
    ))}
   </div>

   <Button
    onClick={handleNext}
    className='mt-2 h-14 rounded-2xl bg-[#C87437] text-sm hover:bg-[#B9642F]'
   >
    {current === slides.length - 1 ? 'Начать' : 'Далее'}
   </Button>

   <Button
    onClick={() => router.push('/name')}
    variant='link'
    className='mt-2 h-14 rounded-2xl text-sm text-[#7A6A52]'
   >
    Пропустить
   </Button>
  </div>
 )
}
