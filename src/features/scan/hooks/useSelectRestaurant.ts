// src/features/scan/hooks/useSelectRestaurant.ts
import { useMutation } from '@tanstack/react-query'
import { scanApi } from '../api/scan.api'
import type { SelectRestaurantPayload } from '../types/scan.type'

export function useSelectRestaurant(sessionId: string) {
 return useMutation({
  mutationFn: (payload: SelectRestaurantPayload) =>
   scanApi.selectRestaurant(sessionId, payload),
 })
}
