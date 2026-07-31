// src/features/chat/api/chat.api.ts
import { api } from '@/shared/lib/axios'
import type {
  AddOrderItemPayload,
  GetMessagesResponse,
  MenuItemResponse,
  OrderItem,
  SelectRestaurantPayload,
  SelectRestaurantResponse,
  SendMessagePayload,
  SendMessageResponse,
  UpdateOrderItemQuantityPayload,
} from '../types/chatmenu.types'

export const chatApi = {
  getMessages: async (visitId?: number) => {
    const { data } = await api.get<GetMessagesResponse>(
      `/visits/${visitId}/chat/messages`,
    )
    return data.messages
  },

  sendMessage: async (visitId?: number, payload?: SendMessagePayload) => {
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

  getAllOrders: async (visitId: number | string): Promise<OrderItem[]> => {
    const { data } = await api.get<{ items: OrderItem[] }>(
      `/visits/${visitId}/items`,
    )
    return data.items
  },

  addOrder: async (
    visitId?: number | string,
    payload?: AddOrderItemPayload,
  ): Promise<OrderItem> => {
    const { data } = await api.post<OrderItem>(
      `/visits/${visitId}/items`,
      payload,
    )
    return data
  },

  updateQuantity: async (
    visitId: number | string,
    itemId: number | string,
    payload: UpdateOrderItemQuantityPayload,
  ): Promise<OrderItem> => {
    const { data } = await api.patch<OrderItem>(
      `/visits/${visitId}/items/${itemId}`,
      payload,
    )
    return data
  },

  remove: async (
    visitId: number | string,
    itemId: number | string,
  ): Promise<void> => {
    await api.delete(`/visits/${visitId}/items/${itemId}`)
  },
}
