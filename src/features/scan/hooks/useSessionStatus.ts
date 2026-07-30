// src/features/scan/hooks/useSessionStatus.ts
import { useQuery } from '@tanstack/react-query'
import { scanApi } from '../api/scan.api'
import { scanKeys } from '../api/scan.keys'
import { useRouter } from 'next/navigation'

export function useSessionStatus(sessionId?: string | null, enabled?: boolean) {
  const router = useRouter()
  return useQuery({
    queryKey: scanKeys.sessionStatus(sessionId!),
    queryFn: async () => {
      const result = await scanApi.getSessionStatus(sessionId!)

      return result
    },
    enabled: enabled && Boolean(sessionId),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      const resId = query.state.data?.restaurant_id
      const resName = query.state.data?.guessed_restaurant_name

      if (
        status === 'done' ||
        status === 'failed' ||
        status === 'awaiting_restaurant'
      ) {
        // if (resId) {
        //   router.push(
        //     `/restaurants/${resId}?restaurant_name=${encodeURIComponent(resName ?? '')}`,
        //   )
        // }
        if (resName) {
          router.push(
            `/restaurants/new_restaurant?restaurant_name=${encodeURIComponent(resName ?? '')}`,
          )
        }
        return false
      }

      return 2000
    },
  })
}
