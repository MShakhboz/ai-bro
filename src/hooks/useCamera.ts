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

 const streamRef = useRef<MediaStream | null>(null)
 const trackRef = useRef<MediaStreamTrack | null>(null)
 const scannerRef = useRef<QrScanner | null>(null)

 const mountedRef = useRef(true)
 const qrEnabledRef = useRef(true)

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
  try {
   const stream = await navigator.mediaDevices.getUserMedia({
    video: {
     facingMode: { ideal: 'environment' },
     width: { ideal: 1920 },
     height: { ideal: 1080 },
    },
   })

   if (!mountedRef.current) {
    stream.getTracks().forEach((t) => t.stop())
    return
   }

   streamRef.current = stream
   trackRef.current = stream.getVideoTracks()[0] ?? null

   const video = videoRef.current!
   video.srcObject = stream

   await video.play()

   scannerRef.current = new QrScanner(
    video,
    (result) => {
     if (!qrEnabledRef.current) return
     onQrSuccess(result.data)
    },
    {
     preferredCamera: 'environment',
     returnDetailedScanResult: true,
    },
   )

   await scannerRef.current.start()

   setReady(true)
  } catch (e) {
   console.error(e)
   onError('Unable to access camera.')
  }
 }

 const startQr = useCallback(() => {
  qrEnabledRef.current = true
 }, [])

 const stopQr = useCallback(() => {
  qrEnabledRef.current = false
 }, [])

 async function capturePhoto() {
  if (!videoRef.current) return

  setLoading(true)

  try {
   let blob: Blob | null = null

   if ('ImageCapture' in window && trackRef.current) {
    try {
     const imageCapture = new ImageCapture(trackRef.current)
     blob = await imageCapture.takePhoto()
    } catch {
     blob = null
    }
   }

   if (!blob) {
    const video = videoRef.current

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')!
    ctx.drawImage(video, 0, 0)

    blob = await new Promise<Blob>((resolve) =>
     canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.95),
    )
   }

   // Some mobile browsers pause preview after takePhoto()
   await videoRef.current.play().catch(() => {})

   const dataUrl = await new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(blob!)
   })

   onPhotoSuccess(blob, dataUrl)
  } catch (e) {
   console.error(e)
   onError('Failed to capture photo.')
  }

  setLoading(false)
 }

 function stopCamera() {
  scannerRef.current?.destroy()
  scannerRef.current = null

  streamRef.current?.getTracks().forEach((track) => track.stop())

  streamRef.current = null
  trackRef.current = null
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
