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

 const [ready, setReady] = useState(false)
 const [loading, setLoading] = useState(false)

 useEffect(() => {
  startCamera()

  return () => {
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

   streamRef.current = stream
   trackRef.current = stream.getVideoTracks()[0] ?? null

   const video = videoRef.current!

   video.srcObject = stream

   await video.play()

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
   onError('Unable to access camera.')
  }
 }

 const startQr = useCallback(() => {
  scannerRef.current?.start()
 }, [])

 const stopQr = useCallback(() => {
  scannerRef.current?.stop()
 }, [])

 async function capturePhoto() {
  if (!videoRef.current) return

  setLoading(true)

  try {
   // Prefer ImageCapture — grabs a full-res frame straight from the
   // sensor/pipeline, same as a native camera app, instead of
   // whatever resolution the <video> element happens to be
   // rendering at.
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
