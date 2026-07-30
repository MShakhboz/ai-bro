// src/features/scan/hooks/useSelectRestaurant.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { visitApi } from '../api/restaurants.api'
import type {
  SelectRestaurantPayload,
  SelectRestaurantConflictError,
} from '../types/restaurants.type'

export function useSelectRestaurant(sessionId: string | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SelectRestaurantPayload) =>
      visitApi.selectRestaurant(sessionId, payload),

    onSuccess: (data) => {
      // seed the visit's chat cache so the chat page has visitId ready,
      // and seed the menu cache so MenuScreen doesn't refetch what we just got
      queryClient.setQueryData(
        ['menu', 'restaurant', data.restaurant_id],
        data.menu,
      )
    },
  })
}
