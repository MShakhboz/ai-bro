'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'
import Tesseract from 'tesseract.js'

interface Props {
 onQrSuccess(value: string): void
 onMenuSuccess(text: string): void
 onError(error: string): void
}

export function useCamera({ onQrSuccess, onMenuSuccess, onError }: Props) {
 const videoRef = useRef<HTMLVideoElement>(null)
 const streamRef = useRef<MediaStream | null>(null)
 const scannerRef = useRef<QrScanner | null>(null)

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
     width: { ideal: 1920 },
     height: { ideal: 1080 },
    },
   })

   streamRef.current = stream

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

 async function captureMenu() {
  if (!videoRef.current) return

  setLoading(true)

  try {
   const canvas = document.createElement('canvas')

   canvas.width = videoRef.current.videoWidth
   canvas.height = videoRef.current.videoHeight

   const ctx = canvas.getContext('2d')!

   ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

   const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), 'image/jpeg', 1),
   )

   const {
    data: { text },
   } = await Tesseract.recognize(blob, 'eng+rus')

   onMenuSuccess(text)
  } catch {
   onError('OCR failed.')
  }

  setLoading(false)
 }

 function stopCamera() {
  scannerRef.current?.destroy()

  streamRef.current?.getTracks().forEach((track) => track.stop())

  streamRef.current = null
 }

 return {
  videoRef,
  ready,
  loading,
  startQr,
  stopQr,
  captureMenu,
  stopCamera,
 }
}
