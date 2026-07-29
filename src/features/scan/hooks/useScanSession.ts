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

 const addPhoto = async (file: File) => {
  const validationError = validateMenuPhoto(file)

  if (validationError) {
   throw new Error(validationError)
  }

  let sessionId = currentSession?.sessionId
  const order = currentSession?.order ?? 1

  if (!sessionId) {
   const created = await createPhotoSession(sessionProps)
   sessionId = created.session_id
  }

  console.log('file', file)

  const result = await uploadPhoto({
   sessionId,
   file,
   order,
  })

  queryClient.setQueryData(scanKeys.currentSession(), {
   sessionId,
   order: order + 1,
  })

  return result
 }

 const scanQrCode = async (value: string) => {
  return scanQr({ url: value, ...sessionProps })
 }

 const finish = async () => {
  const sessionId = currentSession?.sessionId

  if (!sessionId) {
   throw new Error('No active scan session')
  }

  return completeSession(sessionId)
 }

 const reset = () => {
  queryClient.removeQueries({
   queryKey: scanKeys.currentSession(),
  })
 }

 return {
  sessionId: currentSession?.sessionId ?? null,
  addPhoto,
  scanQr: scanQrCode,
  finish,
  reset,
 }
}
