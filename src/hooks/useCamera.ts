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

 // Triggers once the video element has successfully loaded frames
 const handleVideoLoad = useCallback(() => {
  const video = webcamRef.current?.video

  // Guard clause: ensure the video element is rendering frames and scanner isn't already running
  if (!video || video.readyState < 2 || scannerRef.current) return

  try {
   // Point to the official worker CDN directly inside the client lifecycle to avoid Next.js SSR build breaks
   QrScanner.WORKER_PATH =
    'https://cdnjs.cloudflare.com/ajax/libs/qr-scanner/1.4.2/qr-scanner-worker.min.js'

   scannerRef.current = new QrScanner(
    video,
    (result) => onQrSuccess(result.data),
    {
     preferredCamera: 'environment',
     returnDetailedScanResult: true,
     maxScansPerSecond: 8,
     highlightScanRegion: false,
    },
   )

   scannerRef.current
    .start()
    .then(() => setReady(true))
    .catch((err) => {
     console.error('Failed to start QR engine stream:', err)
     onError('Failed to start QR engine.')
    })
  } catch (e) {
   console.error('QR Scanner initialization failed:', e)
   onError('Unable to bind QR scanner.')
  }
 }, [onQrSuccess, onError])

 async function capturePhoto() {
  if (!webcamRef.current || !ready) return

  setLoading(true)
  try {
   const dataUrl = webcamRef.current.getScreenshot()
   if (!dataUrl) throw new Error('Screenshot came back null')

   const response = await fetch(dataUrl)
   const blob = await response.blob()

   onPhotoSuccess(blob, dataUrl)
  } catch (err) {
   console.error('Photo capture operation failed:', err)
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
  handleVideoLoad,
 }
}
