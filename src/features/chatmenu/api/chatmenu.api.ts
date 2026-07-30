// src/features/chat/api/chat.api.ts
import { api } from '@/shared/lib/axios'
import type {
  GetMessagesResponse,
  MenuItemResponse,
  SelectRestaurantPayload,
  SelectRestaurantResponse,
  SendMessagePayload,
  SendMessageResponse,
} from '../types/chatmenu.types'

export const chatApi = {
  getMessages: async (visitId?: number) => {
    const { data } = await api.get<GetMessagesResponse>(
      `/visits/${visitId}/chat/messages`,
    )
    return data.messages
  },

  sendMessage: async (visitId?: number, payload: SendMessagePayload) => {
    const { data } = await api.post<SendMessageResponse>(
      `/visits/${visitId}/chat/messages`,
      payload,
    )
    return data.message // unwrap — GET uses `messages` (plural), POST uses `message` (singular)
  },

  getMenuItem: async (id: string | number) => {
    const { data } = await api.get<MenuItemResponse>(`/menu-items/${id}`)
    return data.item
  },
}
