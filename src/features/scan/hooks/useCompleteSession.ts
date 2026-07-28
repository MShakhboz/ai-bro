import { useMutation } from '@tanstack/react-query'
import { scanApi } from '../api/scan.api'

export function useCompleteSession() {
 return useMutation({
  mutationFn: (sessionId: string) => scanApi.completeSession(sessionId),
 })
}
