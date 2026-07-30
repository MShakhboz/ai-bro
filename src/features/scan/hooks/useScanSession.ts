import { useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useCreatePhotoSession } from './useCreatePhotoSession'
import { useUploadPhoto } from './useUploadPhoto'
import { useCompleteSession } from './useCompleteSession'
import { useScanQr } from './useScanQr'
import { CreatePhotoSession } from '../types/scan.type'
import { validateMenuPhoto } from '@/shared/lib/validate-menu-photo'
import { scanKeys } from '../api/scan.keys'
import { useAppStore } from '@/store/use-app-store'
import { useSessionStatus } from './useSessionStatus'

export function useScanSession(sessionProps: CreatePhotoSession) {
  const {
    sessionId: currentSession,
    imgOrder: order,
    setSession,
    setImgOrder,
  } = useAppStore()

  const { mutateAsync: createPhotoSession, isPending: createSessionPending } =
    useCreatePhotoSession()
  const { mutateAsync: uploadPhoto, isPending: uploadingPending } =
    useUploadPhoto()
  const { mutateAsync: completeSession, isPending: completePending } =
    useCompleteSession()
  const { mutateAsync: scanQr, isPending: scanPending } = useScanQr()

  const sessionRef = useRef<{
    sessionId: string | null
    order: number
  }>({
    sessionId: currentSession ?? null,
    order: order ?? 1,
  })

  const addPhoto = async (file: File) => {
    const validationError = validateMenuPhoto(file)

    if (validationError) {
      throw new Error(validationError)
    }

    let { sessionId, order } = sessionRef.current

    // if (!sessionId) {
    const created = await createPhotoSession(sessionProps)

    sessionId = created.session_id

    sessionRef.current.sessionId = sessionId
    // }

    const result = await uploadPhoto({
      sessionId,
      file,
      order,
    })

    const nextOrder = order + 1

    sessionRef.current.order = nextOrder

    setSession(sessionId)
    setImgOrder(nextOrder)

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
    setSession(null)
    setImgOrder(1)
  }

  return {
    sessionId: sessionRef.current.sessionId,
    addPhoto,
    scanQr: scanQrCode,
    finish,
    reset,
    isPending:
      createSessionPending ||
      uploadingPending ||
      completePending ||
      scanPending,
  }
}
