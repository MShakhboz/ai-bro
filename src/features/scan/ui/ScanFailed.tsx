import type { ReactNode } from 'react'
import { Playfair_Display } from 'next/font/google'

import { Button } from '@/components/ui/button'

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['600'],
})

interface Props {
  icon: ReactNode
  title: string
  description: string
  primaryLabel: string
  onPrimary(): void
  secondaryLabel?: string
  onSecondary?(): void
}

export default function ScanFailed({
  icon,
  title,
  description,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: Props) {
  return (
    <div className='flex h-full flex-col overflow-y-auto bg-white px-8 pt-3 pb-[clamp(0.75rem,4dvh,2rem)]'>
      <div className='flex flex-1 flex-col items-center justify-center gap-[clamp(1rem,4dvh,2.5rem)]'>
        <div className='flex size-[clamp(7rem,26dvh,12.5rem)] shrink-0 items-center justify-center rounded-full border border-[#E5DFD6]'>
          <div className='flex size-[80%] items-center justify-center rounded-full border border-[#C87437]/60 bg-[#FBF9F7]'>
            <div className='flex size-[62%] items-center justify-center rounded-full bg-[#C87437] text-white *:size-[38%]'>
              {icon}
            </div>
          </div>
        </div>

        <div className='text-center'>
          <h1
            className={`${playfair.className} text-[clamp(1.25rem,3.2dvh,1.5rem)] leading-tight font-semibold text-balance text-[#1C1409]`}
          >
            {title}
          </h1>
          <p className='mx-auto mt-[clamp(0.375rem,1.5dvh,0.75rem)] max-w-70 text-sm text-balance text-[#7A6A52]'>
            {description}
          </p>
        </div>
      </div>

      <Button
        onClick={onPrimary}
        className='mt-[clamp(0.75rem,3dvh,1.5rem)] h-[clamp(2.75rem,7dvh,3.5rem)] shrink-0 rounded-2xl bg-[#C87437] text-base font-semibold hover:bg-[#B96530]'
      >
        {primaryLabel}
      </Button>

      {secondaryLabel && (
        <Button
          onClick={onSecondary}
          variant='link'
          className='mt-1 h-[clamp(2.5rem,7dvh,3.5rem)] shrink-0 rounded-2xl text-base font-semibold text-[#7A6A52] hover:no-underline'
        >
          {secondaryLabel}
        </Button>
      )}
    </div>
  )
}
