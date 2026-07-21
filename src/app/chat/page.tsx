'use client'

import { useRef, useState } from 'react'

import { Chat, Message, Restaurant, Suggestion } from '@/components/ui/chat'
import { type Message as MessageType } from '@/components/ui/chat/types'

const restaurant: Restaurant = {
 id: '1',
 name: 'Semplice',
 cuisine: 'Итальянский',
 table: '7',
 image: '/restaurant.jpg', // replace with your image
}

const suggestions: Suggestion[] = [
 {
  id: '1',
  label: 'Хочу легко',
 },
 {
  id: '2',
  label: 'Хочу пасту',
 },
 {
  id: '3',
  label: 'Что посоветуешь?',
 },
]

export default function ChatPage() {
 const fileInputRef = useRef<HTMLInputElement>(null)

 const [messages, setMessages] = useState<MessageType[]>([
  {
   id: crypto.randomUUID(),
   role: 'assistant',
   content: 'Добрый вечер! 👋 Чем могу помочь?',
   createdAt: getTime(),
  },
 ])

 function getTime() {
  return new Date().toLocaleTimeString([], {
   hour: '2-digit',
   minute: '2-digit',
  })
 }

 function sendMessage(text: string) {
  if (!text.trim()) return

  setMessages((prev) => [
   ...prev,
   {
    id: crypto.randomUUID(),
    role: 'user',
    content: text,
    createdAt: getTime(),
   },
  ])

  // Fake AI response
  setTimeout(() => {
   setMessages((prev) => [
    ...prev,
    {
     id: crypto.randomUUID(),
     role: 'assistant',
     content: `You said: "${text}"`,
     createdAt: getTime(),
    },
   ])
  }, 800)
 }

 function handleSuggestion(suggestion: Suggestion) {
  sendMessage(suggestion.label)
 }

 function handleCameraClick() {
  fileInputRef.current?.click()
 }

 function handlePhoto(event: React.ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0]

  if (!file) return

  const image = URL.createObjectURL(file)

  setMessages((prev) => [
   ...prev,
   {
    id: crypto.randomUUID(),
    role: 'user',
    image,
    createdAt: getTime(),
    content: 'Фото отправлено',
   },
  ])

  // Fake AI response
  setTimeout(() => {
   setMessages((prev) => [
    ...prev,
    {
     id: crypto.randomUUID(),
     role: 'assistant',
     content: 'Nice photo! 📸',
     createdAt: getTime(),
    },
   ])
  }, 800)

  event.target.value = ''
 }

 return (
  <>
   {/* <input
    ref={fileInputRef}
    hidden
    type='file'
    accept='image/*'
    capture='environment'
    onChange={handlePhoto}
   /> */}

   <div className='flex h-full flex-col'>
    <Chat
     restaurant={restaurant}
     messages={messages}
     suggestions={suggestions}
     loading={false}
     onSend={sendMessage}
     onSuggestionClick={handleSuggestion}
     onCameraClick={handleCameraClick}
    />
   </div>
  </>
 )
}
