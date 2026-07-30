import { api } from '@/shared/lib/axios'
import {
  RestaurantsResponse,
  SelectRestaurantPayload,
  SelectRestaurantResponse,
} from '../types/restaurants.type'

export const visitApi = {
  getAll: async (page: number) => {
    const { data } = await api.get<RestaurantsResponse>('/visits', {
      params: { page },
    })
    return data
  },

  // src/features/scan/api/scan.api.ts (add to existing file)
  selectRestaurant: async (
    sessionId: string | null,
    payload: SelectRestaurantPayload,
  ) => {
    const { data } = await api.post<SelectRestaurantResponse>(
      `/scan/photo/sessions/${sessionId}/select-restaurant`,
      payload,
    )
    return data
  },
}
