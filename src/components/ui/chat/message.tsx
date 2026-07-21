'use client'

import { cn } from '@/lib/utils'

import { Message as MessageType } from './types'

interface MessageProps {
 message: MessageType
}

export default function Message({ message }: MessageProps) {
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
    <p className='whitespace-pre-wrap text-[15px] leading-6'>
     {message.content}
    </p>

    <p
     className={cn(
      'mt-2 text-xs',
      isAssistant ? 'text-muted-foreground' : 'text-primary-foreground/70',
     )}
    >
     {message.createdAt}
    </p>
   </div>
  </div>
 )
}
