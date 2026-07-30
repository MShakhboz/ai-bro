import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scanApi } from '../api/scan.api'
import { scanKeys } from '../api/scan.keys'
import { visitKeys } from '@/features/restaurants/api/restaurants.keys'
import { useSessionStatus } from './useSessionStatus'

export function useCompleteSession() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      sessionId,
      expectedCount,
    }: {
      sessionId: string
      expectedCount: number
    }) => scanApi.completeSession(sessionId, expectedCount),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: scanKeys.sessionStatus(variables.sessionId),
      })

      queryClient.invalidateQueries({
        queryKey: visitKeys.all,
      })
    },
  })
}
