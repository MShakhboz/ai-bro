// src/features/scan/hooks/useSelectRestaurant.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { visitApi } from '../api/restaurants.api'
import type { SelectRestaurantPayload } from '../types/restaurants.type'
import { chatKeys } from '@/features/chatmenu/api/chatmenu.keys'
import { useChatMessages } from '@/features/chatmenu/hooks/useChatMessages'

export function useSelectRestaurant({
  sessionId,
  payload,
}: {
  sessionId: string | null
  payload: SelectRestaurantPayload
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => visitApi.selectRestaurant(sessionId, payload),

    onSuccess: (data) => {
      // seed the visit's chat cache so the chat page has visitId ready,
      // and seed the menu cache so MenuScreen doesn't refetch what we just got
      queryClient.setQueryData(
        ['menu', 'restaurant', data.restaurant_id],
        data.menu,
      )
      // queryClient.setQueryData(chatKeys.visit(data.visit_id), {
      //   visitId: data.visit_id,
      //   restaurantId: data.restaurant_id,
      // })
    },
  })
}
