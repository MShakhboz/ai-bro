// src/features/chat/hooks/useChatMessages.ts
import { useQuery } from '@tanstack/react-query'
import { chatApi } from '../api/chatmenu.api'
import { chatKeys } from '../api/chatmenu.keys'

export function useChatMessages(visitId?: number) {
  return useQuery({
    queryKey: chatKeys.messages(visitId),
    queryFn: () => chatApi.getMessages(visitId),
    enabled: !!visitId,
  })
}
