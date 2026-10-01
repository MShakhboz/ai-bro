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
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['600'],
})

const slides = [
  {
    image: '/smart-waiter-onboarding.svg',
    title: 'Умный официант прямо в телефоне',
    description:
      'Сканируйте QR-код на столе и получите персональные рекомендации от AI BRO',
  },
  {
    image: '/scan-onboarding.svg',
    title: 'Просто отсканируйте QR-код или сфотографируйте меню',
    description:
      'AI BRO знает всё меню ресторана и поможет с выбором, учитывая ваши предпочтения',
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
    <div className="flex h-full w-full flex-col overflow-y-auto bg-white px-6 pt-2 pb-[clamp(0.5rem,3dvh,1.5rem)]">
      <div className="flex flex-1 flex-col justify-center">
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.title}>
                <div className="flex flex-col items-center gap-[clamp(1rem,4dvh,2.5rem)]">
                  <div className="flex size-[clamp(8rem,36dvh,17.5rem)] shrink-0 items-center justify-center rounded-full border border-[#E5DFD6] bg-white">
                    <Image
                      src={slide.image}
                      height={96}
                      width={96}
                      alt={slide.title}
                      className="size-[34%] object-contain"
                    />
                  </div>

                  <div className="space-y-[clamp(0.375rem,1.5dvh,0.75rem)] px-4 text-center">
                    <h2
                      className={`${playfair.className} text-[clamp(1.125rem,3.4dvh,1.5rem)] leading-tight font-semibold text-balance text-[#1C1409]`}
                    >
                      {slide.title}
                    </h2>

                    <p className="text-sm text-balance text-[#7A6A52]">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-[clamp(0.5rem,2dvh,1rem)] flex shrink-0 items-center justify-center gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                current === index ? 'bg-[#C87437]' : 'bg-[#D8D2CB]'
              }`}
            />
          ))}
        </div>
      </div>

      <Button
        onClick={handleNext}
        className="mt-[clamp(0.75rem,3dvh,1.5rem)] h-[clamp(2.75rem,7dvh,3.5rem)] shrink-0 rounded-2xl bg-[#C87437] text-base font-semibold hover:bg-[#B9642F]"
      >
        Далее
      </Button>

      <Button
        onClick={() => router.push('/name')}
        variant="link"
        className="mt-1 h-[clamp(2.5rem,7dvh,3.5rem)] shrink-0 rounded-2xl text-base font-semibold text-[#7A6A52] hover:no-underline"
      >
        Пропустить
      </Button>
    </div>
  )
}
