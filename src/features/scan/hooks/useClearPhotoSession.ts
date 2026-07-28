// src/features/scan/hooks/useClearPhotoSession.ts
import { useQueryClient } from '@tanstack/react-query'
import { scanKeys } from '../api/scan.keys'

export function useClearPhotoSession() {
 const queryClient = useQueryClient()
 return () => queryClient.removeQueries({ queryKey: scanKeys.currentSession() })
}
