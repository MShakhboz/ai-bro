import { useRef, useState } from 'react'
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

  const [submitting, setSubmitting] = useState(false)

  const sessionRef = useRef<{
    sessionId: string | null
    order: number
  }>({
    sessionId: currentSession ?? null,
    order: order ?? 1,
  })

  // Uploads every page into a fresh session, then completes it once
  const submitPhotos = async (files: File[]) => {
    if (!files.length) {
      throw new Error('No photos uploaded')
    }

    for (const file of files) {
      const validationError = validateMenuPhoto(file)

      if (validationError) {
        throw new Error(validationError)
      }
    }

    setSubmitting(true)

    try {
      const { session_id: sessionId } = await createPhotoSession(sessionProps)

      sessionRef.current = { sessionId, order: 1 }

      for (const [index, file] of files.entries()) {
        await uploadPhoto({ sessionId, file, order: index + 1 })
        sessionRef.current.order = index + 2
      }

      setSession(sessionId)
      setImgOrder(files.length + 1)

      return await completeSession({
        sessionId,
        expectedCount: files.length,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const scanQrCode = async (value: string) => {
    const result = await scanQr({
      url: value,
      ...sessionProps,
    })

    sessionRef.current.sessionId = result.session_id

    return result
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
    submitPhotos,
    scanQr: scanQrCode,
    finish,
    reset,
    isPending:
      submitting ||
      createSessionPending ||
      uploadingPending ||
      completePending ||
      scanPending,
  }
}
