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
 const canvasRef = useRef<HTMLCanvasElement>(null)

 const streamRef = useRef<MediaStream | null>(null)
 const scannerRef = useRef<QrScanner | null>(null)

 const [ready, setReady] = useState(false)
 const [loading, setLoading] = useState(false)

 const startCamera = useCallback(async () => {
  if (streamRef.current) return

  try {
   const stream = await navigator.mediaDevices.getUserMedia({
    video: {
     facingMode: {
      ideal: 'environment',
     },
     width: {
      ideal: 1920,
     },
     height: {
      ideal: 1080,
     },
    },
    audio: false,
   })

   streamRef.current = stream

   const video = videoRef.current

   if (!video) return

   video.srcObject = stream

   await video.play()

   setReady(true)
  } catch (err) {
   console.error(err)
   onError('Unable to access camera.')
  }
 }, [onError])

 const startQr = useCallback(async () => {
  const video = videoRef.current

  if (!video) return

  if (!scannerRef.current) {
   scannerRef.current = new QrScanner(
    video,
    (result) => {
     onQrSuccess(result.data)
    },
    {
     returnDetailedScanResult: true,
     maxScansPerSecond: 10,
    },
   )
  }

  await scannerRef.current.start()
 }, [onQrSuccess])

 const stopQr = useCallback(async () => {
  await scannerRef.current?.stop()
 }, [])

 const capturePhoto = useCallback(async () => {
  const video = videoRef.current
  const canvas = canvasRef.current

  if (!video || !canvas) return

  setLoading(true)

  try {
   canvas.width = video.videoWidth
   canvas.height = video.videoHeight

   const ctx = canvas.getContext('2d')

   if (!ctx) throw new Error()

   ctx.drawImage(video, 0, 0)

   const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
     (blob) => {
      if (!blob) {
       reject(new Error())
       return
      }

      resolve(blob)
     },
     'image/jpeg',
     0.95,
    )
   })

   const dataUrl = canvas.toDataURL('image/jpeg', 0.95)

   onPhotoSuccess(blob, dataUrl)
  } catch (err) {
   console.error(err)
   onError('Failed to capture photo.')
  } finally {
   setLoading(false)
  }
 }, [onPhotoSuccess, onError])

 const stopCamera = useCallback(() => {
  scannerRef.current?.destroy()
  scannerRef.current = null

  streamRef.current?.getTracks().forEach((track) => track.stop())
  streamRef.current = null

  setReady(false)
 }, [])

 useEffect(() => {
  startCamera()

  return () => {
   stopCamera()
  }
 }, [startCamera, stopCamera])

 return {
  videoRef,
  canvasRef,
  ready,
  loading,
  startQr,
  stopQr,
  capturePhoto,
  stopCamera,
 }
}
