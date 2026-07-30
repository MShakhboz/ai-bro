// src/features/scan/hooks/useCreatePhotoSession.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { scanApi } from '../api/scan.api'
import { scanKeys } from '../api/scan.keys'
import { useAppStore } from '@/store/use-app-store'

export function useCreatePhotoSession() {
  const { setSession } = useAppStore()

  return useMutation({
    mutationFn: scanApi.createPhotoSession,
    onSuccess: (data) => {
      setSession(data.session_id)
    },
  })
}
