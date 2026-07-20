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
 const scannerRef = useRef<QrScanner | null>(null)
 const trackRef = useRef<MediaStreamTrack | null>(null)
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
  try {
   const stream = await navigator.mediaDevices.getUserMedia({
    video: {
     facingMode: 'environment',
     width: { ideal: 3840 },
     height: { ideal: 2160 },
    },
   })

   // Effect was cleaned up (e.g. Strict Mode double-invoke) while we
   // were awaiting getUserMedia — kill this stream, don't attach it.
   if (!mountedRef.current) {
    stream.getTracks().forEach((track) => track.stop())
    return
   }

   streamRef.current = stream
   trackRef.current = stream.getVideoTracks()[0] ?? null

   const video = videoRef.current!

   video.srcObject = stream

   await video.play()

   // If the camera track ever ends unexpectedly (e.g. another app
   // claims the camera, or the tab loses focus on some devices),
   // surface it instead of silently showing a black frame.
   trackRef.current?.addEventListener('ended', () => {
    if (mountedRef.current) onError('Camera stream ended.')
   })

   scannerRef.current = new QrScanner(
    video,
    (result) => onQrSuccess(result.data),
    {
     preferredCamera: 'environment',
     returnDetailedScanResult: true,
    },
   )

   setReady(true)
  } catch {
   if (mountedRef.current) onError('Unable to access camera.')
  }
 }

 const startQr = useCallback(() => {
  scannerRef.current?.start()
  // start() resumes the video itself, but play() is a safe no-op
  // if it's already playing.
  videoRef.current?.play().catch(() => {})
 }, [])

 const stopQr = useCallback(() => {
  scannerRef.current?.stop()
  // QrScanner.stop() pauses the <video> element — resume it so the
  // live feed keeps showing while we're just not scanning for QR.
  videoRef.current?.play().catch(() => {})
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

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    blob = await new Promise<Blob>((resolve) =>
     canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.95),
    )
   }

   const dataUrl = await new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.readAsDataURL(blob!)
   })

   onPhotoSuccess(blob, dataUrl)
  } catch {
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
