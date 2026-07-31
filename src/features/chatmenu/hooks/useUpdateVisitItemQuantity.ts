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

export function useUpdateVisitItemQuantity(visitId: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      itemId,
      quantity,
    }: {
      itemId: number | string
      quantity: number
    }) => chatApi.updateQuantity(visitId, itemId, { quantity }),
    // Optimistic update so +/- quantity clicks feel instant
    onMutate: async ({ itemId, quantity }) => {
      const key = chatKeys.allOrder(visitId)
      await queryClient.cancelQueries({ queryKey: key })

      const previous = queryClient.getQueryData<OrderItem[]>(key)

      queryClient.setQueryData<OrderItem[]>(key, (old) =>
        old?.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
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
