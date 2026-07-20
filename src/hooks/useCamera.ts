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
     facingMode: { ideal: 'environment' },
     width: { ideal: 1920 }, // was 3840
     height: { ideal: 1080 }, // was 2160
    },
    audio: false,
   })

   if (!mountedRef.current) {
    stream.getTracks().forEach((track) => track.stop())
    return
   }

   streamRef.current = stream
   trackRef.current = stream.getVideoTracks()[0] ?? null

   const video = videoRef.current!

   video.srcObject = stream

   // Wait until metadata is available before playing.
   await new Promise<void>((resolve) => {
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
     resolve()
    } else {
     video.onloadedmetadata = () => resolve()
    }
   })

   await video.play()

   // Debug events
   video.onpause = () => console.log('VIDEO PAUSED')
   video.onwaiting = () => console.log('VIDEO WAITING')
   video.onstalled = () => console.log('VIDEO STALLED')
   video.onerror = (e) => console.log('VIDEO ERROR', e)

   trackRef.current?.addEventListener('ended', () => {
    console.log('TRACK ENDED')
    if (mountedRef.current) {
     onError('Camera stream ended.')
    }
   })

   trackRef.current?.addEventListener('mute', () => {
    console.log('TRACK MUTED')
   })

   trackRef.current?.addEventListener('unmute', () => {
    console.log('TRACK UNMUTED')
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
  } catch (e) {
   console.error(e)

   if (mountedRef.current) {
    onError('Unable to access camera.')
   }
  }
 }

 const startQr = useCallback(() => {
  scannerRef.current?.start()
 }, [])

 const stopQr = useCallback(() => {
  scannerRef.current?.stop()
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
