import { useMutation } from '@tanstack/react-query'
import { scanApi } from '../api/scan.api'

export function useCompleteSession() {
 return useMutation({
  mutationFn: ({
   sessionId,
   expectedCount,
  }: {
   sessionId: string
   expectedCount: number
  }) => scanApi.completeSession(sessionId, expectedCount),
 })
}
