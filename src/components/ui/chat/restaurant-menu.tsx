'use client'

import Image from 'next/image'
import { ImageIcon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  MenuCategory,
  OrderItem,
} from '@/features/chatmenu/types/chatmenu.types'
import { useCallback, useMemo, useState } from 'react'
import { useAddVisitItem } from '@/features/chatmenu/hooks/useAddVisitItem'
import { cn } from '@/lib/utils'

export default function RestaurantMenu({
  menuData,
  onItemClick,
  handleAddItem,
  orders,
  increase,
  decrease,
}: {
  menuData?: MenuCategory[]
  onItemClick: (i: number | null) => void
  handleAddItem: (e: { menuItemId: number; quantity: number }) => void
  orders?: OrderItem[]
  increase: (e: OrderItem) => void
  decrease: (e: OrderItem) => void
}) {
  const [category, setCategory] = useState<null | Number>(null)

  const product = useMemo(() => {
    if (!category) {
      return { items: menuData?.flatMap((c) => c.items) }
    }
    return menuData?.find((i) => i.id === category)
  }, [category, menuData])

  const onOrder = (menuItemId: number, quantity: number = 1) => {
    handleAddItem({ menuItemId, quantity })
  }

  const getQuantity = useCallback(
    (id: number) => {
      return orders?.find((i) => i.menu_item.id === id)
    },
    [orders],
  )

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
        {product?.items?.map((item) => {
          const order = getQuantity(item.id)
          const quantity = order?.quantity ?? 0

          return (
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

                <div
                  className={cn(
                    'absolute bottom-3 right-3 flex h-8 items-center overflow-hidden rounded-full bg-white shadow-lg transition-all duration-300',
                    quantity ? 'w-24' : 'w-8',
                  )}
                >
                  {quantity === 0 ? (
                    <Button
                      size='icon'
                      className='h-8 w-8 rounded-full bg-white text-[#D77834] shadow-lg hover:bg-white'
                      onClick={(e) => {
                        e.stopPropagation()
                        onOrder(item.id, 1)
                      }}
                    >
                      <Plus className='h-5 w-5' />
                    </Button>
                  ) : (
                    <div className='flex h-8 items-center rounded-full bg-white shadow-lg transition-all duration-200'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 rounded-full text-[#D77834]'
                        onClick={(e) => {
                          e.stopPropagation()
                          if (order) decrease(order)
                        }}
                      >
                        -
                      </Button>

                      <span className='min-w-6 text-center text-sm font-semibold'>
                        {quantity}
                      </span>

                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 rounded-full text-[#D77834]'
                        onClick={(e) => {
                          e.stopPropagation()
                          if (quantity >= 1 && order) {
                            increase(order)
                          } else onOrder(item.id, quantity + 1)
                        }}
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                    </div>
                  )}
                </div>
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
          )
        })}
      </div>
    </div>
  )
}
