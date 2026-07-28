'use client'

import { cn } from '@/lib/utils'

import {
 ChatMessage,
 ReferencedMenuItem,
} from '@/features/chatmenu/types/chatmenu.types'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '../card'
import { ImageIcon } from 'lucide-react'

interface MessageProps {
 message: ChatMessage
 onReferencedItemClick?: (item: ReferencedMenuItem) => void
}

interface DishCardProps {
 image: string
 price: number
 name: string
 calories: number
 weight: number
 popular?: boolean
 onAdd?: () => void
}

export default function Message({
 message,
 onReferencedItemClick,
}: MessageProps) {
 const isAssistant = message.role === 'assistant'

 return (
  <div
   className={cn('flex w-full', isAssistant ? 'justify-start' : 'justify-end')}
  >
   <div
    className={cn(
     'max-w-[85%] rounded-3xl border px-4 py-3 shadow-sm',
     isAssistant
      ? 'border-border bg-card text-card-foreground'
      : 'border-primary bg-primary text-primary-foreground',
    )}
   >
    {message.text && (
     <p className='whitespace-pre-wrap text-[15px] leading-6'>{message.text}</p>
    )}

    {message?.referenced_items?.length > 0 && (
     <div className='mt-3 flex flex-col gap-2'>
      {message.referenced_items.map((item) => (
       <DishCard item={item} onAdd={onReferencedItemClick} />
      ))}
     </div>
    )}

    <p
     className={cn(
      'mt-2 text-xs',
      isAssistant ? 'text-muted-foreground' : 'text-primary-foreground/70',
     )}
    >
     {message.created_at}
    </p>
   </div>
  </div>
 )
}

export function DishCard({
 item,
 onAdd,
}: {
 item: ReferencedMenuItem
 onAdd?: (item: ReferencedMenuItem) => void
}) {
 return (
  <div className='space-y-2'>
   <Card className='flex items-center gap-3 p-3'>
    <div className='relative size-32 w-full shrink-0 overflow-hidden rounded-md bg-muted'>
     {item.image ? (
      <Image
       src={item.image}
       alt={item.name_ru}
       className='object-cover'
       height={100}
      />
     ) : (
      <div className='flex w-full size-full items-center justify-center text-muted-foreground'>
       <ImageIcon />
      </div>
     )}
    </div>
   </Card>
   <div className='min-w-0'>
    <p className='text-sm text-[#C8713A] font-bold'>{item.price} ₽</p>
    <p className='truncate font-medium text-[#1C1409]'>{item.name_ru}</p>
   </div>
   <button
    type='button'
    onClick={() => onAdd?.(item)}
    className='mt-3 h-8.5 w-full rounded-3xl  border border-[#CE7135] text-xs font-bold text-[#CE7135]'
   >
    + Добавить
   </button>
  </div>
 )
}
