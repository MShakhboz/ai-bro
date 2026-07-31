// src/features/scan/hooks/useSessionStatus.ts
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { scanApi } from '../api/scan.api'
import { scanKeys } from '../api/scan.keys'
import { useRouter } from 'next/navigation'
import { SessionStatusResponse } from '../types/scan.type'
import { Dispatch, SetStateAction } from 'react'

export function useSessionStatus(
  sessionId?: string | null,
  enabled?: boolean,
  fallback?: () => void,
) {
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
        //     `/visits/${resId}?restaurant_name=${encodeURIComponent(resName ?? '')}`,
        //   )
        // }
        if (resName) {
          router.push(
            `/visits/new_restaurant?restaurant_name=${encodeURIComponent(resName ?? '')}`,
          )
        }
        fallback?.()
        return false
      }

      return 2000
    },
  })
}
