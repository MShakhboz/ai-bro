'use client'

import { useState } from 'react'

import CameraScanner from '@/components/ui/camera-scanner'
import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Chat, Restaurant, Suggestion } from '@/components/ui/chat'
import { type Message as MessageType } from '@/components/ui/chat/types'

const restaurant: Restaurant = {
 id: '1',
 name: 'Semplice',
 cuisine: 'Итальянский',
 table: '7',
 image: '/restaurant.jpg',
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
 const [messages, setMessages] = useState<MessageType[]>([
  {
   id: crypto.randomUUID(),
   role: 'assistant',
   content: 'Добрый вечер! 👋 Чем могу помочь?',
   createdAt: getTime(),
  },
 ])

 const [isScanning, setIsScanning] = useState(false)
 const [cameraError, setCameraError] = useState<string | null>(null)

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
  setIsScanning(true)
 }

 function handleQrSuccess(value: string) {
  setIsScanning(false)

  sendMessage(value)
 }

 async function handlePhotoSuccess(photo: File, dataUrl: string) {
  setIsScanning(false)

  setMessages((prev) => [
   ...prev,
   {
    id: crypto.randomUUID(),
    role: 'user',
    image: dataUrl,
    content: 'Photo',
    createdAt: getTime(),
   },
  ])

  // TODO: Upload to your backend
  console.log('Photo:', photo)

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
 }

 function handleCameraError(error: string) {
  console.error(error)

  setIsScanning(false)
  setCameraError(error)
 }

 return (
  <div className='flex h-full flex-col relative'>
   {isScanning && (
    <div className='absolute inset-0 z-50 flex items-center justify-center bg-black/50'>
     <CameraScanner
      onQrSuccess={handleQrSuccess}
      onPhotoSuccess={handlePhotoSuccess}
      onError={handleCameraError}
      onClose={() => setIsScanning(false)}
     />
    </div>
   )}

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

   <AlertDialog
    open={!!cameraError}
    onOpenChange={(open) => {
     if (!open) setCameraError(null)
    }}
   >
    <AlertDialogContent>
     <AlertDialogHeader>
      <AlertDialogTitle>Camera Error</AlertDialogTitle>

      <AlertDialogDescription>{cameraError}</AlertDialogDescription>
     </AlertDialogHeader>

     <AlertDialogFooter>
      <AlertDialogAction onClick={() => setCameraError(null)}>
       OK
      </AlertDialogAction>
     </AlertDialogFooter>
    </AlertDialogContent>
   </AlertDialog>
  </div>
 )
}
