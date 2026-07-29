// src/features/scan/hooks/useScanQr.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scanApi } from '../api/scan.api'
import { scanKeys } from '../api/scan.keys'
import { QRScanResponse } from '../types/scan.type'
import { useAppStore } from '@/store/use-app-store'

export function useScanQr() {
 const queryClient = useQueryClient()

 return useMutation({
  mutationFn: scanApi.scanQr,

  onSuccess: ({ session_id }: QRScanResponse) => {
   const currentSession = queryClient.getQueryData<{
    sessionId: string
    order: number
   }>(scanKeys.currentSession())

   queryClient.setQueryData(scanKeys.currentSession(), {
    sessionId: session_id,
    order: currentSession?.order ?? 1,
   })

   queryClient.invalidateQueries({
    queryKey: scanKeys.sessionStatus(session_id),
   })
  },
 })
}
