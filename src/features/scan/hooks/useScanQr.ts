// src/features/scan/hooks/useScanQr.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scanApi } from '../api/scan.api'
import { scanKeys } from '../api/scan.keys'
import { QRScanResponse } from '../types/scan.type'
import { useAppStore } from '@/store/use-app-store'

export function useScanQr() {
 const queryClient = useQueryClient()
 const { name, setSession } = useAppStore()
 return useMutation({
  mutationFn: scanApi.scanQr,
  onSuccess: ({ session_id }: QRScanResponse) => {
   queryClient.invalidateQueries({ queryKey: scanKeys.session(session_id) })
   setSession(session_id)
  },
 })
}
