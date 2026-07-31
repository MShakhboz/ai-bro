// hooks/useVisitItems.ts

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { AddOrderItemPayload, OrderItem } from '../types/chatmenu.types'
import { chatApi } from '../api/chatmenu.api'
import { chatKeys } from '../api/chatmenu.keys'

// ---------- Query keys ----------

// ---------- POST /api/v1/visits/{visit_id}/items ----------

export function useAddVisitItem(visitId?: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AddOrderItemPayload) =>
      chatApi.addOrder(visitId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.allOrder(visitId) })
    },
  })
}
