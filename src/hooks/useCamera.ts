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
   scannerRef.current = new QrScanner(
    videoRef.current,
    (result) => onQrSuccess(result.data),
    {
     preferredCamera: 'environment',
     returnDetailedScanResult: true,
     maxScansPerSecond: 10,
    },
   )

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

 const startQr = useCallback(() => {
  scannerRef.current?.start().catch(() => {})
 }, [])

 const stopQr = useCallback(() => {
  scannerRef.current?.pause()
 }, [])

 async function capturePhoto() {
  if (!videoRef.current || !ready) return

  setLoading(true)

  try {
   const video = videoRef.current

   // Crucial: Fallback if QrScanner downsamples the canvas target dimensions
   let width = video.videoWidth
   let height = video.videoHeight

   // If video dimensions haven't updated or are flattened by the scanner engine,
   // pull them out of the active hardware stream track itself
   if (!width || !height) {
    const stream = video.srcObject as MediaStream | null
    const track = stream?.getVideoTracks()[0]
    const settings = track?.getSettings()
    width = settings?.width || 1280
    height = settings?.height || 720
   }

   const canvas = document.createElement('canvas')
   canvas.width = width
   canvas.height = height

   const ctx = canvas.getContext('2d')
   if (!ctx) throw new Error('Canvas context unavailable')

   ctx.imageSmoothingEnabled = true
   ctx.imageSmoothingQuality = 'high'

   // Draw current visual frame buffer
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
