'use client'

import { cn } from '@/lib/utils'

import {
  ChatMessage,
  ReferenceItem,
} from '@/features/chatmenu/types/chatmenu.types'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '../card'
import { ImageIcon } from 'lucide-react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../carousel'

interface MessageProps {
  message: ChatMessage
  onReferencedItemClick?: (item: ReferenceItem) => void
  onItemClick?: (i: number | null) => void
  handleAddItem: (e: { menuItemId: number; quantity: number }) => void
}

export default function Message({
  message,
  onReferencedItemClick,
  onItemClick,
  handleAddItem,
}: MessageProps) {
  const isAssistant = message.role === 'assistant'

  return (
    <div>
      <div
        className={cn(
          'flex w-full',
          isAssistant ? 'justify-start' : 'justify-end',
        )}
      >
        <div
          className={cn(
            'max-w-[85%] rounded-3xl border px-4 py-3 shadow-sm',
            isAssistant
              ? 'border-border bg-card text-card-foreground rounded-tl-none '
              : 'bg-[#C8713A] text-primary-foreground rounded-tr-none',
          )}
        >
          {message.text && (
            <p className='whitespace-pre-wrap text-[15px] leading-6'>
              {message.text}
            </p>
          )}

          <p
            className={cn(
              'mt-2 text-xs',
              isAssistant
                ? 'text-muted-foreground'
                : 'text-primary-foreground/70',
            )}
          >
            {message.created_at}
          </p>
        </div>
      </div>
      {message?.referenced_items?.length
        ? message?.referenced_items?.length > 0 && (
            <Carousel
              opts={{
                align: 'start',
                dragFree: true,
              }}
              className='mt-4 w-full'
            >
              <CarouselContent className='-ml-2'>
                {message.referenced_items.map((item) => (
                  <CarouselItem
                    key={item.id}
                    className='pl-3 py-1 basis-[55%] sm:basis-1/3 lg:basis-1/4'
                  >
                    <DishCard
                      item={item}
                      onAdd={onReferencedItemClick}
                      onItemClick={() => onItemClick?.(item.id)}
                      handleAddItem={handleAddItem}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          )
        : null}
    </div>
  )
}

export function DishCard({
  item,
  onAdd,
  onItemClick,
  handleAddItem,
}: {
  item: ReferenceItem
  onAdd?: (item: ReferenceItem) => void
  onItemClick: () => void
  handleAddItem: (e: { menuItemId: number; quantity: number }) => void
}) {
  return (
    <Card className='gap-3 p-3' onClick={onItemClick}>
      <div className='space-y-2 p-0 w-full'>
        <div className='relative size-32 w-full shrink-0 overflow-hidden rounded-md bg-muted'>
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name_ru ?? 'item image'}
              className='object-cover'
              height={144}
              fill
            />
          ) : (
            <div className='flex w-full size-full items-center justify-center text-muted-foreground'>
              <ImageIcon />
            </div>
          )}
        </div>
        <div className='flex'>
          <div className='min-w-0 flex-1 mt-1.5 space-y-0.5'>
            <p className='text-sm font-bold text-[#C8713A]'>
              {item.price} {item.currency}
            </p>

            <p className='truncate font-medium text-[#1C1409]'>
              {item.name_ru} {item.name_ru}
            </p>

            {(item.weight_volume || item.nutrition.calories) && (
              <p className='truncate text-[#ABB1BA]'>
                <span>{item.nutrition.calories} ккал</span>
                {item.weight_volume && <span> • {item.weight_volume}</span>}
              </p>
            )}
          </div>
        </div>
        <button
          type='button'
          onClick={(e) => {
            e.stopPropagation()
            handleAddItem?.({
              menuItemId: item.id,
              quantity: 1,
            })
          }}
          className='mt-1 h-8.5 w-full rounded-[8px]  border-[1.5px] border-[#CE7135] text-xs font-bold text-[#CE7135]'
        >
          + Добавить
        </button>
      </div>
    </Card>
  )
}
