// src/features/chat/hooks/useSendMessage.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { chatApi } from '../api/chatmenu.api'
import { chatKeys } from '../api/chatmenu.keys'
import type { ChatMessage, SendMessagePayload } from '../types/chatmenu.types'

export function useSendMessage(visitId: number | null) {
 const queryClient = useQueryClient()

 return useMutation({
  mutationFn: (payload: SendMessagePayload) =>
   chatApi.sendMessage(visitId, payload),

  onMutate: async (payload) => {
   await queryClient.cancelQueries({ queryKey: chatKeys.messages(visitId) })

   const previousMessages = queryClient.getQueryData<ChatMessage[]>(
    chatKeys.messages(visitId),
   )

   const optimisticMessage: ChatMessage = {
    id: -Date.now(),
    role: 'user',
    type: 'text',
    text: payload.text,
    referenced_items: [],
    created_at: new Date().toISOString(),
   }

   queryClient.setQueryData<ChatMessage[]>(
    chatKeys.messages(visitId),
    (old) => [...(old ?? []), optimisticMessage],
   )

   return { previousMessages }
  },

  onError: (_err, _payload, context) => {
   if (context?.previousMessages) {
    queryClient.setQueryData(
     chatKeys.messages(visitId),
     context.previousMessages,
    )
   }
  },

  onSuccess: (assistantMessage) => {
   // append the assistant's reply — it's a new message, not a replacement
   // for the user's own optimistic bubble
   queryClient.setQueryData<ChatMessage[]>(
    chatKeys.messages(visitId),
    (old) => [...(old ?? []), assistantMessage],
   )
  },
 })
}
