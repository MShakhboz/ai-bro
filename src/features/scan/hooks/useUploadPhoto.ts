import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scanApi } from '../api/scan.api'
import { scanKeys } from '../api/scan.keys'

export function useUploadPhoto() {
 const queryClient = useQueryClient()

 return useMutation({
  mutationFn: async ({
   sessionId,
   file,
   order,
  }: {
   sessionId: string
   file: File
   order: number
  }) => {
   // Upload photo first
   const result = await scanApi.uploadPhoto({
    sessionId,
    file,
    order,
   })

   // Complete session after successful upload
   await scanApi.completeSession(sessionId, order)

   return result
  },

  onSuccess: (_, variables) => {
   queryClient.invalidateQueries({
    queryKey: scanKeys.session(variables.sessionId),
   })

   queryClient.invalidateQueries({
    queryKey: scanKeys.sessionStatus(variables.sessionId),
   })
  },
 })
}
