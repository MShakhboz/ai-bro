'use client'

import { useCallback, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'
import Webcam from 'react-webcam'

interface Props {
 onQrSuccess(value: string): void
 onPhotoSuccess(photo: File, dataUrl: string): void
 onError(error: string): void
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB

async function compressToJpeg(
 blob: Blob,
 maxSize = MAX_FILE_SIZE,
): Promise<File> {
 const bitmap = await createImageBitmap(blob)

 let width = bitmap.width
 let height = bitmap.height

 // Start with a reasonable resolution
 const maxDimension = 1920

 if (width > maxDimension || height > maxDimension) {
  const scale = Math.min(maxDimension / width, maxDimension / height)

  width = Math.round(width * scale)
  height = Math.round(height * scale)
 }

 for (let attempt = 0; attempt < 10; attempt++) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')

  if (!ctx) {
   bitmap.close()
   throw new Error('Could not create canvas context')
  }

  ctx.drawImage(bitmap, 0, 0, width, height)

  // Gradually reduce quality
  const quality = Math.max(0.4, 0.9 - attempt * 0.06)

  const result = await new Promise<Blob | null>((resolve) => {
   canvas.toBlob(resolve, 'image/jpeg', quality)
  })

  if (result && result.size <= maxSize) {
   bitmap.close()

   return new File([result], `menu-${Date.now()}.jpg`, {
    type: 'image/jpeg',
    lastModified: Date.now(),
   })
  }

  // If quality isn't enough, also reduce dimensions
  width = Math.round(width * 0.85)
  height = Math.round(height * 0.85)
 }

 bitmap.close()

 throw new Error('Не удалось сжать изображение до 2 МБ')
}

export function useCamera({ onQrSuccess, onPhotoSuccess, onError }: Props) {
 const webcamRef = useRef<Webcam>(null)
 const scannerRef = useRef<QrScanner | null>(null)

 const [ready, setReady] = useState(false)
 const [loading, setLoading] = useState(false)

 function stopCamera() {
  scannerRef.current?.destroy()
  scannerRef.current = null

  const stream = webcamRef.current?.video?.srcObject as MediaStream | null

  stream?.getTracks().forEach((track) => track.stop())

  if (webcamRef.current?.video) {
   webcamRef.current.video.srcObject = null
  }

  setReady(false)
 }

 const handleVideoLoad = useCallback(() => {
  const video = webcamRef.current?.video

  if (!video || video.readyState < 2 || scannerRef.current) {
   return
  }

  try {
   QrScanner.WORKER_PATH =
    'https://cdnjs.cloudflare.com/ajax/libs/qr-scanner/1.4.2/qr-scanner-worker.min.js'

   scannerRef.current = new QrScanner(
    video,
    (result) => {
     stopCamera()
     onQrSuccess(result.data)
    },
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

   if (!dataUrl) {
    throw new Error('Screenshot came back null')
   }

   const response = await fetch(dataUrl)
   const blob = await response.blob()

   // Convert + compress to JPEG <= 2 MB
   const file = await compressToJpeg(blob)

   console.log('Original:', blob.size)
   console.log('Compressed:', file.size)
   console.log('Type:', file.type)

   stopCamera()

   onPhotoSuccess(file, dataUrl)
  } catch (err) {
   console.error('Photo capture operation failed:', err)

   stopCamera()

   onError(err instanceof Error ? err.message : 'Failed to capture photo.')
  } finally {
   setLoading(false)
  }
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
