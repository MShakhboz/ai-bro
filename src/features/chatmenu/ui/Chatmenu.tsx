'use client'

import { useEffect, useState } from 'react'

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
import { Chat, Suggestion } from '@/components/ui/chat'
import { useAppStore } from '@/store/use-app-store'

import { useChatMessages } from '@/features/chatmenu/hooks/useChatMessages'
import { useSendMessage } from '@/features/chatmenu/hooks/useSendMessage'
import type { ChatMessage } from '@/features/chatmenu/types/chatmenu.types'
import dayjs from 'dayjs'
import { useSelectRestaurant } from '@/features/restaurants/hooks/useSelectRestaurant'
import { useSearchParams } from 'next/navigation'
import { useGetMenu } from '../hooks/useGetAllMenus'

const suggestions: Suggestion[] = [
  { id: '1', label: 'Хочу легко' },
  { id: '3', label: 'Что посоветуешь?' },
]

// maps your backend's ChatMessage shape to the UI's MessageType shape
function toUiMessage(msg: ChatMessage): ChatMessage {
  return {
    id: msg.id, // adjust if your UI's MessageType.id is a number instead of string
    role: msg.role,
    text: msg.text, // backend field is `text`, UI field is `content`
    created_at: dayjs(msg.created_at).format('HH:mm'),
    referenced_items: msg.referenced_items, // new — see below
    type: 'text',
  }
}

export default function ChatPage({ id }: { id: string | number }) {
  // TODO: confirm where visitId actually comes from — assuming app store here,
  // set during the scan/restaurant-selection flow before landing on /chat
  // const { pendingScan, setPendingScan, visitId, restaurant } = useAppStore()

  const [isScanning, setIsScanning] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const { sessionId } = useAppStore()

  const searchParams = useSearchParams()
  const restaurantName = searchParams.get('restaurant_name')
  const visitIdQuery = searchParams.get('visit_id')
  const { mutate: selectRestaurant, data } = useSelectRestaurant({
    sessionId,
    payload: {
      ...(id !== 'new_restaurant'
        ? { place_id: String(id), name: restaurantName ?? '' }
        : {}),
      restaurant_name: restaurantName ?? '',
    },
  })
  const visitId = data?.visit_id ?? visitIdQuery
  const { data: history, isLoading } = useChatMessages(Number(visitId))
  const { mutate: sendMessageMutation, isPending: isSending } = useSendMessage(
    Number(visitId),
  )
  const { data: menus } = useGetMenu(Number(id))

  const messages: ChatMessage[] = (history ?? []).map(toUiMessage)

  function sendMessage(text: string, menuItemId?: number) {
    if (!text.trim() || !visitId) return
    sendMessageMutation({
      type: 'text',
      text: text.trim(),
      ...(menuItemId ? { menu_item_id: menuItemId } : {}),
    })
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
    // TODO: photo-in-chat likely needs its own endpoint/param — the two chat
    // endpoints we have (GET/POST /visits/{id}/chat/messages) only show
    // `content` as text in the Swagger preview so far. If sending a photo
    // through chat is a real requirement, we need the expanded POST schema
    // to confirm whether it accepts an image field or a separate upload step.
  }

  function handleCameraError(error: string) {
    setIsScanning(false)
    setCameraError(error)
  }

  //  useEffect(() => {
  //   if (!pendingScan) return

  //   const scan = pendingScan
  //   setPendingScan(null)

  //   if (scan.type === 'qr') {
  //    sendMessage(scan.value)
  //   }
  //   // scan.type === 'image' case intentionally left out — see TODO above
  //  }, [pendingScan, setPendingScan])

  useEffect(() => {
    if (id) {
      selectRestaurant()
    }
  }, [id])

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
          restaurant={{ id: data?.restaurant_id, name: restaurantName }}
          messages={messages}
          suggestions={suggestions}
          loading={isLoading || isSending}
          onSend={sendMessage}
          onSuggestionClick={handleSuggestion}
          onCameraClick={handleCameraClick}
          menudata={data?.menu?.categories ?? menus?.categories}
          visitId={Number(visitId)}
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
