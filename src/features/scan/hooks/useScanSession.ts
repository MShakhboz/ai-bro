import { useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useCurrentPhotoSession } from './useCurrentPhotoSession'
import { useCreatePhotoSession } from './useCreatePhotoSession'
import { useUploadPhoto } from './useUploadPhoto'
import { useCompleteSession } from './useCompleteSession'
import { useScanQr } from './useScanQr'
import { CreatePhotoSession } from '../types/scan.type'
import { validateMenuPhoto } from '@/shared/lib/validate-menu-photo'
import { scanKeys } from '../api/scan.keys'

export function useScanSession(sessionProps: CreatePhotoSession) {
 const queryClient = useQueryClient()
 const { data: currentSession } = useCurrentPhotoSession()

 const { mutateAsync: createPhotoSession } = useCreatePhotoSession()
 const { mutateAsync: uploadPhoto } = useUploadPhoto()
 const { mutateAsync: completeSession } = useCompleteSession()
 const { mutateAsync: scanQr } = useScanQr()

 const sessionRef = useRef<{
  sessionId: string | null
  order: number
 }>({
  sessionId: currentSession?.sessionId ?? null,
  order: currentSession?.order ?? 1,
 })

 const addPhoto = async (file: File) => {
  const validationError = validateMenuPhoto(file)

  if (validationError) {
   throw new Error(validationError)
  }

  let { sessionId, order } = sessionRef.current

  if (!sessionId) {
   const created = await createPhotoSession(sessionProps)

   sessionId = created.session_id

   sessionRef.current.sessionId = sessionId
  }

  const result = await uploadPhoto({
   sessionId,
   file,
   order,
  })

  const nextOrder = order + 1

  sessionRef.current.order = nextOrder

  queryClient.setQueryData(scanKeys.currentSession(), {
   sessionId,
   order: nextOrder,
  })

  return result
 }

 const scanQrCode = async (value: string) => {
  return scanQr({
   url: value,
   ...sessionProps,
  })
 }

 const finish = async () => {
  const { sessionId, order } = sessionRef.current

  if (!sessionId) {
   throw new Error('No active scan session')
  }

  const expectedCount = order - 1

  if (expectedCount < 1) {
   throw new Error('No photos uploaded')
  }

  return completeSession({
   sessionId,
   expectedCount,
  })
 }

 const reset = () => {
  sessionRef.current = {
   sessionId: null,
   order: 1,
  }

  queryClient.removeQueries({
   queryKey: scanKeys.currentSession(),
  })
 }

 return {
  sessionId: sessionRef.current.sessionId,
  addPhoto,
  scanQr: scanQrCode,
  finish,
  reset,
 }
}
