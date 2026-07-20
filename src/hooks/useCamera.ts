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
 // Use a ref to quickly toggle decoding on/off without affecting the hardware stream
 const isQrActiveRef = useRef(true)

 const [ready, setReady] = useState(false)
 const [loading, setLoading] = useState(false)

 const handleUserMedia = useCallback(() => {
  const video = webcamRef.current?.video
  if (!video || scannerRef.current) return

  setTimeout(() => {
   try {
    if (scannerRef.current) return

    scannerRef.current = new QrScanner(
     video,
     (result) => {
      // ONLY trigger success if QR processing mode is active
      if (isQrActiveRef.current) {
       onQrSuccess(result.data)
      }
     },
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

 // Toggle flags instead of using pause() to protect the video feed track
 const startQr = useCallback(() => {
  isQrActiveRef.current = true
 }, [])

 const stopQr = useCallback(() => {
  isQrActiveRef.current = false
 }, [])

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
  startQr,
  stopQr,
  capturePhoto,
  stopCamera,
  handleUserMedia,
 }
}
