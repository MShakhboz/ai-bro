// src/features/scan/hooks/useSessionStatus.ts
import { useQuery } from '@tanstack/react-query'
import { scanApi } from '../api/scan.api'
import { scanKeys } from '../api/scan.keys'

export function useSessionStatus(sessionId: string | null) {
 return useQuery({
  queryKey: scanKeys.sessionStatus(sessionId ?? ''),
  queryFn: () => scanApi.getSessionStatus(sessionId as string),
  enabled: !!sessionId,
  refetchInterval: (query) => {
   // poll every 2s while processing, stop once completed or failed
   const status = query.state.data?.status
   if (status === 'completed' || status === 'failed') return false
   return 2000
  },
 })
}
