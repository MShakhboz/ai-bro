import { Dispatch, SetStateAction, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { ImageIcon, Minus, Plus } from 'lucide-react'
import { useMenuItem } from '@/features/chatmenu/hooks/useMenuItem'
import { MenuDetailItem } from '@/features/chatmenu/types/chatmenu.types'
import { Suggestion } from './types'
import Image from 'next/image'

function DishDetailContent({
  onAskAi,
  data,
}: {
  onAskAi: (e: Suggestion) => void
  data?: MenuDetailItem
}) {
  const [qty, setQty] = useState(1)

  return (
    <div className='flex flex-col'>
      {/* hero image */}
      <div className='relative h-52 w-full overflow-hidden'>
        {data?.image ? (
          <Image
            src={data?.image}
            alt={data?.name_ru ?? 'image banner'}
            fill
            className='object-cover'
            priority
          />
        ) : (
          <div className='flex w-full size-full items-center justify-center text-muted-foreground'>
            <ImageIcon />
          </div>
        )}
      </div>

      <div className='flex flex-col px-6 pb-6 pt-6'>
        <h1 className='font-serif text-xl font-semibold text-stone-900'>
          {data?.name_ru}
        </h1>

        {data?.description_ru && (
          <p className='mt-3 text-sm leading-relaxed text-stone-500'>
            {data?.description_ru}
          </p>
        )}
        <div className='mt-4 flex flex-wrap gap-2'>
          {data?.tags?.map((tag) => (
            <Badge
              key={tag}
              variant='secondary'
              className='rounded-full border-0 bg-[#FDEEE7] p-3 text-xs font-semibold text-[#C8713A]'
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className='mt-7 grid grid-cols-4 gap-2 text-center'>
          {Object.entries(data?.nutrition ?? {}).map(([key, val]) => (
            <div key={key}>
              <div className='text-xs font-medium tracking-wide text-[#ABB1BA]'>
                {key}
              </div>
              <div className='mt-1 text-sm font-bold text-[#1C1409]'>{val}</div>
            </div>
          ))}
        </div>

        <div className='mt-7 flex items-center justify-between'>
          <span className='text-2xl font-bold text-[#C8713A]'>
            {(data?.price ?? 0) * qty} {data?.currency}
          </span>

          <div className='flex items-center gap-4 rounded-[12px] bg-stone-100 px-2 py-1.5'>
            <Button
              size='icon'
              variant='ghost'
              className='h-9 w-9 rounded-[8px] bg-white text-stone-700 shadow-sm hover:bg-white'
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label='Уменьшить количество'
            >
              <Minus className='h-4 w-4' />
            </Button>
            <span className='w-4 text-center text-lg font-semibold text-stone-900'>
              {qty}
            </span>
            <Button
              size='icon'
              variant='ghost'
              className='h-9 w-9 rounded-[8px] bg-white text-stone-700 shadow-sm hover:bg-white'
              onClick={() => setQty((q) => q + 1)}
              aria-label='Увеличить количество'
            >
              <Plus className='h-4 w-4' />
            </Button>
          </div>
        </div>

        <Button
          className='mt-7 h-14 w-full rounded-2xl bg-[#C17845] text-base font-semibold text-white shadow-md hover:bg-[#AD6A3B]'
          onClick={() => console.log('added to order', { qty })}
        >
          Добавить в заказ
        </Button>

        <button
          type='button'
          className='mt-4 text-center text-sm font-semibold text-[#C17845] hover:text-[#AD6A3B]'
          onClick={() =>
            onAskAi({
              id: data?.id!,
              label: data?.name_ru!,
            })
          }
        >
          Спросить AI BRO об этом блюде
        </button>
      </div>
    </div>
  )
}

export default function MenuItemDrawer({
  onOpen,
  isOpened,
  onAskAi,
  menuItemId,
}: {
  onOpen: Dispatch<SetStateAction<boolean>>
  isOpened: boolean
  onAskAi: (e: Suggestion) => void
  menuItemId: number | null
}) {
  const { data, isPending, isError, refetch } = useMenuItem(
    isOpened ? menuItemId : null,
  )
  return (
    <Drawer onOpenChange={onOpen} open={isOpened}>
      <DrawerContent className='rounded-t-ful border-0 bg-white p-0'>
        {/* vaul's own drag handle is rendered by DrawerContent already;
              remove the default one below if your DrawerContent already renders it */}
        <DishDetailContent onAskAi={onAskAi} data={data} />
      </DrawerContent>
    </Drawer>
  )
}
