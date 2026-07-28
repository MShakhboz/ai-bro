'use client'

import { Check } from 'lucide-react'

export default function RestaurantsLoading() {
 return (
  <div className='relative flex h-full w-full flex-col items-center overflow-hidden  bg-[#fbf8f3] px-6'>
   {/* Center content */}
   <div className='flex flex-1 flex-col items-center justify-center pb-20'>
    {/* Success icon */}
    <div className='relative mb-16 flex h-50 w-50 items-center justify-center'>
     {/* Wave 1 */}
     <div className='wave absolute inset-0 rounded-full border border-[#e8b995]' />

     {/* Wave 2 */}
     <div className='wave-delay absolute inset-0 rounded-full border border-[#e8b995]' />

     {/* Static inner ring */}

     {/* Orange circle */}
     <div className='relative flex h-33 w-33 items-center justify-center rounded-full bg-[#cc7135]'>
      <div className='flex h-14 w-14 items-center justify-center rounded-full border-[2.5px] border-white'>
       <Check className='-mt-1 h-8 w-8 text-white' strokeWidth={2} />
      </div>
     </div>
    </div>

    {/* Heading */}
    <h1 className='font-serif text-center text-[32px] font-bold leading-[1.05] tracking-[-1.8px] text-[#1e1711]'>
     Добро пожаловать!
    </h1>

    {/* Restaurant */}
    {/* <p className='mt-5 text-base font-normal tracking-[-0.3px] text-[#7A6A52]'>
      Semplice · Стол 7
     </p> */}

    {/* Loading text */}
    <p className='mt-48 text-sm font-normal tracking-[-0.2px] text-[#7A6A52]'>
     Загружаю меню ресторана...
    </p>

    {/* Dots */}
    <div className='flex space-x-2 justify-center items-center mt-3 dark:invert'>
     <span className='sr-only'>Loading...</span>
     <div className='h-2 w-2 bg-[#C8713A] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
     <div className='h-2 w-2 bg-[#C8713A] rounded-full animate-bounce [animation-delay:-0.15s]'></div>
     <div className='h-2 w-2 bg-[#C8713A] rounded-full animate-bounce'></div>
    </div>
   </div>
  </div>
 )
}
