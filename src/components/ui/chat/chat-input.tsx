'use client'

import { KeyboardEvent, useState } from 'react'
import { Camera, SendHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ChatInputProps {
 loading?: boolean
 disabled?: boolean

 placeholder?: string

 onSend?(message: string): void
 onCameraClick?(): void
}

export default function ChatInput({
 loading = false,
 disabled = false,
 placeholder = 'Спросите или найдите...',
 onSend,
 onCameraClick,
}: ChatInputProps) {
 const [value, setValue] = useState('')

 const send = () => {
  const text = value.trim()

  if (!text || loading || disabled) {
   return
  }

  onSend?.(text)
  setValue('')
 }

 const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
   event.preventDefault()
   send()
  }
 }

 return (
  <div className='border-t bg-background p-4'>
   <div className='flex items-center gap-2 rounded-full border bg-background px-2 py-2 shadow-sm'>
    <Button type='button' variant='ghost' size='icon' onClick={onCameraClick}>
     <Camera className='size-5' />
    </Button>

    <Input
     value={value}
     disabled={disabled || loading}
     placeholder={placeholder}
     onChange={(e) => setValue(e.target.value)}
     onKeyDown={onKeyDown}
     className='border-0 bg-transparent shadow-none focus-visible:ring-0'
    />

    <Button
     type='button'
     size='icon'
     disabled={!value.trim() || loading || disabled}
     onClick={send}
    >
     <SendHorizontal className='size-5' />
    </Button>
   </div>
  </div>
 )
}

{
 /* <ChatInput
  loading={isLoading}
  onCameraClick={() => setOpenScanner(true)}
  onSend={message => sendMessage(message)}
/> */
}
