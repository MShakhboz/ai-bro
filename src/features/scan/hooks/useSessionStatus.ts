// src/features/scan/hooks/useSessionStatus.ts
import { useQuery } from '@tanstack/react-query'
import { scanApi } from '../api/scan.api'
import { scanKeys } from '../api/scan.keys'

export function useSessionStatus(sessionId: string | null) {
 return useQuery({
  queryKey: scanKeys.sessionStatus(sessionId ?? ''),
  queryFn: async () => {
   const result = await scanApi.getSessionStatus(sessionId!)

   return result
  },
  enabled: Boolean(sessionId),
  refetchInterval: (query) => {
   const status = query.state.data?.status

   if (
    status === 'done' ||
    status === 'failed' ||
    status === 'awaiting_restaurant'
   ) {
    return false
   }

   return 2000
  },
 })
}
