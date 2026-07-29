// src/features/scan/hooks/useCreatePhotoSession.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scanApi } from '../api/scan.api'
import { scanKeys } from '../api/scan.keys'

export function useCreatePhotoSession() {
 const queryClient = useQueryClient()

 return useMutation({
  mutationFn: scanApi.createPhotoSession,
  onSuccess: (data) => {
   queryClient.setQueryData(scanKeys.currentSession(), {
    sessionId: data.session_id,
   })
  },
 })
}
