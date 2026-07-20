'use client'

import { useCallback, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'
import Webcam from 'react-webcam'

interface Props {
 onQrSuccess(value: string): void
 onPhotoSuccess(photo: Blob, dataUrl: string): void
 onError(error: string): void
}

export function useCamera({ onQrSuccess, onPhotoSuccess, onError }: Props) {
 const webcamRef = useRef<Webcam>(null)
 const scannerRef = useRef<QrScanner | null>(null)
 const [ready, setReady] = useState(false)
 const [loading, setLoading] = useState(false)

 const handleUserMedia = useCallback(() => {
  const video = webcamRef.current?.video
  if (!video || scannerRef.current) return

  // Brief timeout to ensure WebRTC stream track buffers are fully loaded
  setTimeout(() => {
   try {
    if (scannerRef.current) return

    scannerRef.current = new QrScanner(
     video,
     (result) => onQrSuccess(result.data), // Stream data straight out cleanly
     {
      preferredCamera: 'environment',
      returnDetailedScanResult: true,
      maxScansPerSecond: 10,
     },
    )

    scannerRef.current.start()
    setReady(true)
   } catch (e) {
    console.error('QR Scanner attach failed:', e)
    onError('Unable to bind QR scanner.')
   }
  }, 200)
 }, [onQrSuccess, onError])

 async function capturePhoto() {
  if (!webcamRef.current || !ready) return

  setLoading(true)

  try {
   const dataUrl = webcamRef.current.getScreenshot()
   if (!dataUrl) throw new Error('Screenshot failed')

   const response = await fetch(dataUrl)
   const blob = await response.blob()

   onPhotoSuccess(blob, dataUrl)
  } catch (err) {
   console.error('Photo capture failed:', err)
   onError('Failed to capture photo.')
  } finally {
   setLoading(false)
  }
 }

 function stopCamera() {
  if (scannerRef.current) {
   scannerRef.current.destroy()
   scannerRef.current = null
  }
  setReady(false)
 }

 return {
  webcamRef,
  ready,
  loading,
  capturePhoto,
  stopCamera,
  handleUserMedia,
 }
}
