import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scanApi } from '../api/scan.api'
import { scanKeys } from '../api/scan.keys'
import { useAppStore } from '@/store/use-app-store'

export function useUploadPhoto() {
 const queryClient = useQueryClient()
 const { setSession } = useAppStore()

 return useMutation({
  mutationFn: ({
   sessionId,
   file,
   order,
  }: {
   sessionId: string
   file: File
   order: number
  }) => scanApi.uploadPhoto({ sessionId, file, order }),

  onSuccess: (_, variables) => {
   queryClient.invalidateQueries({
    queryKey: scanKeys.session(variables.sessionId),
   })

   setSession(variables.sessionId)
  },
 })
}
