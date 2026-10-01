import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scanApi } from '../api/scan.api'
import { scanKeys } from '../api/scan.keys'

export function useUploadPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: scanApi.uploadPhoto,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: scanKeys.session(variables.sessionId),
      })
    },
  })
}
