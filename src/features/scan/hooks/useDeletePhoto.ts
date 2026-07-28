// src/features/scan/hooks/useDeletePhoto.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scanApi } from '../api/scan.api'
import { scanKeys } from '../api/scan.keys'

export function useDeletePhoto(sessionId: string) {
 const queryClient = useQueryClient()

 return useMutation({
  mutationFn: (photoId: string) => scanApi.deletePhoto(sessionId, photoId),
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: scanKeys.session(sessionId) })
  },
 })
}
