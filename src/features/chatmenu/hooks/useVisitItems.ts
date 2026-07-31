// hooks/useVisitItems.ts

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import { AddOrderItemPayload, OrderItem } from '../types/chatmenu.types'
import { chatApi } from '../api/chatmenu.api'

// ---------- Query keys ----------

export const visitItemsKeys = {
  all: (visitId: number | string) => ['visits', visitId, 'items'] as const,
}

// ---------- GET /api/v1/visits/{visit_id}/items ----------

export function useVisitItems(
  visitId: number | string,
  options?: Omit<UseQueryOptions<OrderItem[]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: visitItemsKeys.all(visitId),
    queryFn: () => chatApi.getAllOrders(visitId),
    enabled: !!visitId,
    ...options,
  })
}
