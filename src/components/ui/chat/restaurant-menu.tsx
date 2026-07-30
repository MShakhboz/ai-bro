'use client'

import Image from 'next/image'
import { ImageIcon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MenuCategory } from '@/features/chatmenu/types/chatmenu.types'
import { useMemo, useState } from 'react'

export default function RestaurantMenu({
  menuData,
  onItemClick,
}: {
  menuData?: MenuCategory[]
  onItemClick: (i: number | null) => void
}) {
  const [category, setCategory] = useState<null | Number>(null)
  const product = useMemo(() => {
    if (!category) {
      return { items: menuData?.flatMap((c) => c.items) }
    }
    return menuData?.find((i) => i.id === category)
  }, [category, menuData])
  return (
    <div className='relative'>
      {/* Categories */}
      <div className='sticky top-0 z-40 bg-background'>
        <div className='flex overflow-x-auto gap-3 py-3 px-4 whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
          <button
            key='all'
            className={`shrink-0 rounded-full px-5 py-3 text-sm font-medium ${category === null ? 'bg-[#8A735B] text-white' : 'bg-[#EFE9E2] text-[#7D6A57]'}`}
            onClick={() => setCategory(null)}
          >
            Все
          </button>
          {menuData?.map((c, index) => (
            <button
              key={c.id}
              className={`shrink-0 rounded-full px-5 py-3 text-sm font-medium ${
                category === c.id
                  ? 'bg-[#8A735B] text-white'
                  : 'bg-[#EFE9E2] text-[#7D6A57]'
              }`}
              onClick={() => setCategory(c.id)}
            >
              {c.name_ru}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className='grid grid-cols-2 px-4 gap-4 py-5'>
        {product?.items?.map((item) => (
          <div key={item.id} onClick={() => onItemClick(item.id)}>
            <div className='relative overflow-hidden rounded-[28px] bg-white'>
              {item?.image ? (
                <Image
                  src={item.image}
                  alt={item.name_ru ?? ''}
                  width={500}
                  height={500}
                  className='aspect-square w-full object-cover'
                />
              ) : (
                <div className='aspect-square flex w-full size-full items-center justify-center text-muted-foreground'>
                  <ImageIcon />
                </div>
              )}

              {item?.popular && (
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
                {item.name_ru}
              </h3>

              {(item.weight_volume || item.nutrition?.calories) && (
                <p className='mt-1 text-xs text-[#A7A7A7]'>
                  {[
                    item.weight_volume && `${item.weight_volume} г`,
                    item.nutrition?.calories &&
                      `${item.nutrition.calories} ККал`,
                  ]
                    .filter(Boolean)
                    .join(' • ')}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
