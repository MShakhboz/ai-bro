'use client'

import Image from 'next/image'
import { ImageIcon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MenuCategory } from '@/features/chatmenu/types/chatmenu.types'

const categories = [
  'Все',
  'Закуски',
  'Пасты',
  'Основное',
  'Десерты',
  'kkkkk',
  'pppppp',
  'ooooooo',
  'tttttttt',
  'nnnnnn',
]

const products = Array.from({ length: 8 }).map((_, index) => ({
  id: index,
  name: 'Паста Карбонара Карбонара Карбонара',
  price: 890,
  weight: 320,
  calories: 239,
  image: '',
  popular: index < 2,
}))

export default function RestaurantMenu({
  menuData,
}: {
  menuData?: MenuCategory[]
}) {
  return (
    <div className='relative'>
      {/* Categories */}
      <div className='sticky top-0 z-40 bg-background'>
        <div className='flex overflow-x-auto gap-3 py-3 px-4 whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
          {categories.map((category, index) => (
            <button
              key={category}
              className={`shrink-0 rounded-full px-5 py-3 text-sm font-medium ${
                index === 0
                  ? 'bg-[#8A735B] text-white'
                  : 'bg-[#EFE9E2] text-[#7D6A57]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className='grid grid-cols-2 px-4 gap-x-4 gap-y-6 py-5'>
        {products.map((item) => (
          <div key={item.id}>
            <div className='relative overflow-hidden rounded-[28px] bg-white'>
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={500}
                  height={500}
                  className='aspect-square w-full object-cover'
                />
              ) : (
                <div className='aspect-square flex w-full size-full items-center justify-center text-muted-foreground'>
                  <ImageIcon />
                </div>
              )}

              {item.popular && (
                <div className='absolute left-3 top-3 rounded-lg bg-[#D77834] px-3 py-1 text-xs font-medium text-white'>
                  Популярное
                </div>
              )}

              <Button
                size='icon'
                className='absolute bottom-3 right-3 h-12 w-12 rounded-full bg-white text-[#D77834] shadow-lg hover:bg-white hover:text-[#D77834]'
              >
                <Plus className='h-6 w-6' />
              </Button>
            </div>

            <div className='mt-3'>
              <p className='text-base font-bold leading-none text-[#C86F38]'>
                {item.price} ₽
              </p>

              <h3 className='mt-2 text-sm font-semibold text-[#2C2A28] truncate'>
                {item.name}
              </h3>

              <p className='mt-1 text-xs text-[#A7A7A7]'>
                {item.weight} г • {item.calories} ККал
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
