'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'

interface Props {
 onQrSuccess(value: string): void
 onPhotoSuccess(photo: Blob, dataUrl: string): void
 onError(error: string): void
}

export function useCamera({ onQrSuccess, onPhotoSuccess, onError }: Props) {
 const videoRef = useRef<HTMLVideoElement>(null)
 const scannerRef = useRef<QrScanner | null>(null)
 const mountedRef = useRef(true)

 const [ready, setReady] = useState(false)
 const [loading, setLoading] = useState(false)

 useEffect(() => {
  mountedRef.current = true
  startCamera()

  return () => {
   mountedRef.current = false
   stopCamera()
  }
 }, [])

 async function startCamera() {
  if (!videoRef.current) return

  try {
   // Let QrScanner handle the camera initialization and stream lifecycle entirely
   scannerRef.current = new QrScanner(
    videoRef.current,
    (result) => onQrSuccess(result.data),
    {
     preferredCamera: 'environment',
     returnDetailedScanResult: true,
     // Match your ideal resolution requirements within the scanner configuration
     maxScansPerSecond: 10,
    },
   )

   // Start the camera stream automatically
   await scannerRef.current.start()

   if (!mountedRef.current) {
    stopCamera()
    return
   }

   setReady(true)
  } catch (e) {
   console.error('Camera initialization failed:', e)
   if (mountedRef.current) {
    onError('Unable to access camera.')
   }
  }
 }

 // Since the camera runs constantly now, startQr/stopQr toggle the decoding engine
 const startQr = useCallback(() => {
  scannerRef.current?.start().catch(() => {})
 }, [])

 const stopQr = useCallback(() => {
  // pause() stops the scanning intervals without destroying the camera feed stream
  scannerRef.current?.pause()
 }, [])

 async function capturePhoto() {
  if (!videoRef.current || !ready) return

  setLoading(true)

  try {
   const video = videoRef.current
   const canvas = document.createElement('canvas')

   // Capture at native stream resolution
   canvas.width = video.videoWidth
   canvas.height = video.videoHeight

   const ctx = canvas.getContext('2d')
   if (!ctx) throw new Error('Canvas context unavailable')

   ctx.imageSmoothingEnabled = true
   ctx.imageSmoothingQuality = 'high'
   ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

   const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
     (b) => (b ? resolve(b) : reject(new Error('Blob generation failed'))),
     'image/jpeg',
     0.95,
    )
   })

   const dataUrl = await new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(blob)
   })

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
  videoRef,
  ready,
  loading,
  startQr,
  stopQr,
  capturePhoto,
  stopCamera,
 }
}
