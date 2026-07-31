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

export function useDeleteVisitItem(visitId: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId: number | string) => chatApi.remove(visitId, itemId),
    onMutate: async (itemId) => {
      const key = chatKeys.allOrder(visitId)
      await queryClient.cancelQueries({ queryKey: key })

      const previous = queryClient.getQueryData<OrderItem[]>(key)

      queryClient.setQueryData<OrderItem[]>(key, (old) =>
        old?.filter((item) => item.id !== itemId),
      )

      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(chatKeys.allOrder(visitId), context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.allOrder(visitId) })
    },
  })
}
