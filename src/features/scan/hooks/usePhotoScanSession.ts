import { useQueryClient } from '@tanstack/react-query'
import { useCurrentPhotoSession } from './useCurrentPhotoSession'
import { useCreatePhotoSession } from './useCreatePhotoSession'
import { useUploadPhoto } from './useUploadPhoto'
import { CreatePhotoSession } from '../types/scan.type'
import { validateMenuPhoto } from '@/shared/lib/validate-menu-photo'
import { scanKeys } from '../api/scan.keys'
import { useCompleteSession } from './useCompleteSession'

export function usePhotoScanSession(sessionProps: CreatePhotoSession) {
 const queryClient = useQueryClient()
 const { data: currentSession } = useCurrentPhotoSession()

 const { mutateAsync: createPhotoSession } = useCreatePhotoSession()
 const { mutateAsync: uploadPhoto } = useUploadPhoto()
 const { mutateAsync: completeSession } = useCompleteSession()

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
  finish,
  reset,
 }
}
