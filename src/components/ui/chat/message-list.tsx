'use client'

import { useEffect, useRef } from 'react'

import Message from './message'

import EmptyState from './empty-state'
import { ChatMessage } from '@/features/chatmenu/types/chatmenu.types'

interface MessageListProps {
  messages: ChatMessage[]
  isTyping?: boolean
  onItemClick: (i: number | null) => void
  handleAddItem: (e: { menuItemId: number; quantity: number }) => void
}

export default function MessageList({
  messages,
  isTyping = false,
  onItemClick,
  handleAddItem,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'instant',
      block: 'end',
    })
  }, [messages, isTyping])

  if (!messages.length) {
    return <EmptyState />
  }

  return (
    <div className='flex flex-col gap-4 px-4 py-6'>
      {messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          onItemClick={onItemClick}
          handleAddItem={handleAddItem}
        />
      ))}

      {isTyping && (
        <div className='flex'>
          <div className='rounded-3xl border bg-card px-4 py-3 shadow-sm'>
            <div className='flex items-center gap-1'>
              <span className='h-2 w-2 animate-bounce rounded-full bg-muted-foreground' />
              <span
                className='h-2 w-2 animate-bounce rounded-full bg-muted-foreground'
                style={{ animationDelay: '150ms' }}
              />
              <span
                className='h-2 w-2 animate-bounce rounded-full bg-muted-foreground'
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
