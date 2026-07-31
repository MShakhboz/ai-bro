import { ImageIcon, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import Image from 'next/image'
import { OrderItem } from '@/features/chatmenu/types/chatmenu.types'
import { useUpdateVisitItemQuantity } from '@/features/chatmenu/hooks/useUpdateVisitItemQuantity'
import { useDeleteVisitItem } from '@/features/chatmenu/hooks/useDeleteVisitItem'
import EmptyCart from './empty-cart'

export default function CartList({
  orders,
  increase,
  decrease,
}: {
  orders?: OrderItem[]
  increase: (e: OrderItem) => void
  decrease: (e: OrderItem) => void
}) {
  const total =
    orders?.reduce(
      (acc, o) => Number(o.price_at_add) * Number(o.quantity) + acc,
      0,
    ) ?? 0
  const grandTotal = Math.round((1 + total) * 1.05)
  const currency = orders?.[0]?.menu_item.currency
  if (orders && orders.length === 0) return <EmptyCart />

  return (
    <div className='flex h-full flex-col'>
      <div className='flex-1 overflow-y-auto'>
        {orders?.map((item, index) => (
          <div
            key={item.id}
            className='flex items-center gap-2 px-3 py-3.5 border-b border-b-white'
          >
            {item?.image ? (
              <Image
                src={item?.image}
                alt={item?.menu_item?.name_ru ?? ''}
                width={48}
                height={48}
                className='h-12 w-12 rounded-lg object-cover'
              />
            ) : (
              <div className='h-12 w-12  flex size-full items-center justify-center text-muted-foreground'>
                <ImageIcon />
              </div>
            )}

            <div className='flex-1'>
              <h3 className='text-sm font-semibold'>
                {item.menu_item.name_ru}
              </h3>
              <p className='mt-1 text-xs text-[#C8713A]'>
                {item.menu_item.price} {item.menu_item.currency}
              </p>
            </div>

            <div className='flex items-center gap-3'>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-full'
                onClick={() => decrease(item)}
                // disabled={updateQuantity.isPending || deleteItem.isPending}
              >
                <Minus className='h-6 w-6 text-[#7A6A52]' />
              </Button>

              <span className='w-4 text-center text-lg text-[#7A6A52]'>
                {item.quantity}
              </span>

              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-full'
                onClick={() => increase(item)}
                // disabled={updateQuantity.isPending}
              >
                <Plus className='h-6 w-6 text-[#7A6A52]' />
              </Button>
            </div>
          </div>
        ))}

        <div className='space-y-4 px-3 py-3'>
          <div className='flex items-center justify-between text-sm text-[#5A5048]'>
            <span>{orders && orders.length} блюда</span>
            <span>
              {total} {currency}
            </span>
          </div>

          <div className='flex items-center justify-between'>
            <span className='text-lg font-bold'>Итого</span>
            <span className='text-lg font-bold'>
              {grandTotal} {currency}
            </span>
          </div>

          <div className='flex items-center text-sm justify-between pt-3'>
            <span className='text-sm font-medium'>Перевести для официанта</span>
            <Switch />
          </div>
        </div>
      </div>

      <div className='sticky px-3 py-4'>
        <Button className='h-14 w-full rounded-2xl bg-[#C8713A] text-base font-semibold text-white shadow-md hover:bg-[#AD6A3B]'>
          Показать официанту
        </Button>
      </div>
    </div>
  )
}
