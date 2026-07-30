// src/features/scan/hooks/useScanQr.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scanApi } from '../api/scan.api'
import { scanKeys } from '../api/scan.keys'
import { QRScanResponse } from '../types/scan.type'
import { useAppStore } from '@/store/use-app-store'
import { visitKeys } from '@/features/visits/api/restaurants.keys'

export function useScanQr() {
  const queryClient = useQueryClient()
  const { setSession } = useAppStore()

  return useMutation({
    mutationFn: scanApi.scanQr,

    onSuccess: ({ session_id }: QRScanResponse) => {
      queryClient.invalidateQueries({
        queryKey: scanKeys.sessionStatus(session_id),
      })
      queryClient.invalidateQueries({
        queryKey: visitKeys.all,
      })
      setSession(session_id)
    },
  })
}
