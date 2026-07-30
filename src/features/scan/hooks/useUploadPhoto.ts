import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scanApi } from '../api/scan.api'
import { scanKeys } from '../api/scan.keys'
import { visitKeys } from '@/features/visits/api/restaurants.keys'
import { useCompleteSession } from './useCompleteSession'

export function useUploadPhoto() {
  const queryClient = useQueryClient()
  const { mutateAsync: completeSession } = useCompleteSession()

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

      // Debug delay (e.g. 5 seconds)
      // await new Promise((resolve) => setTimeout(resolve, 5000))

      // Complete session after successful upload
      await completeSession({
        sessionId,
        expectedCount: order,
      })

      return result
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: scanKeys.session(variables.sessionId),
      })
    },
  })
}
