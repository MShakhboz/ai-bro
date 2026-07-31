// hooks/useVisitItems.ts

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { OrderItem } from '../types/chatmenu.types'
import { chatApi } from '../api/chatmenu.api'
import { chatKeys } from '../api/chatmenu.keys'

// ---------- Query keys ----------

// ---------- GET /api/v1/visits/{visit_id}/items ----------

export function useOrderItems(
  visitId: number | string,
  options?: Omit<UseQueryOptions<OrderItem[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: chatKeys.allOrder(visitId),
    queryFn: () => chatApi.getAllOrders(visitId),
    enabled: !!visitId,
    ...options,
  })
}
