// src/features/scan/hooks/useCurrentPhotoSession.ts
import { useQuery } from '@tanstack/react-query'
import { scanKeys } from '../api/scan.keys'

type CurrentSession = { sessionId: string; order: number }

export function useCurrentPhotoSession() {
 return useQuery<CurrentSession | null>({
  queryKey: scanKeys.currentSession(),
  queryFn: () => null, // never actually fetched — only ever set manually
  initialData: null,
  staleTime: Infinity, // never auto-refetch/expire this client-only value
 })
}
