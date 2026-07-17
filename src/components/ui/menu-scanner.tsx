'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, Loader2, X } from 'lucide-react'
import Tesseract from 'tesseract.js'

import { Button } from '@/components/ui/button'

interface Props {
 onSuccess(text: string): void
 onError(error: string): void
 onClose(): void
}

export default function MenuScanner({ onSuccess, onError, onClose }: Props) {
 const videoRef = useRef<HTMLVideoElement>(null)
 const streamRef = useRef<MediaStream | null>(null)

 const [loading, setLoading] = useState(false)
 const [cameraReady, setCameraReady] = useState(false)

 useEffect(() => {
  void startCamera()

  return () => {
   stopCamera()
  }
 }, [])

 async function startCamera() {
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

   await new Promise<void>((resolve) => {
    video.onloadedmetadata = async () => {
     await video.play()

     console.log('Camera resolution:', video.videoWidth, 'x', video.videoHeight)

     setCameraReady(true)

     resolve()
    }
   })
  } catch (e) {
   console.error(e)
   onError('Unable to access camera.')
  }
 }

 function stopCamera() {
  streamRef.current?.getTracks().forEach((track) => track.stop())

  streamRef.current = null

  if (videoRef.current) {
   videoRef.current.srcObject = null
  }

  setCameraReady(false)
 }

 async function capture() {
  if (!videoRef.current || !streamRef.current) return

  setLoading(true)

  try {
   // allow autofocus
   await new Promise((resolve) => setTimeout(resolve, 800))

   let blob: Blob

   const track = streamRef.current.getVideoTracks()[0]

   if (track && typeof window !== 'undefined' && 'ImageCapture' in window) {
    try {
     const imageCapture = new (window as any).ImageCapture(track)

     blob = await imageCapture.takePhoto()

     console.log('Captured using ImageCapture')
    } catch {
     blob = await captureFromCanvas()
    }
   } else {
    blob = await captureFromCanvas()
   }

   console.log('Blob size:', blob.size)

   const {
    data: { text },
   } = await Tesseract.recognize(blob, 'eng+rus')

   stopCamera()

   onSuccess(text.trim())
  } catch (e) {
   console.error(e)

   onError('Unable to recognize text.')
  } finally {
   setLoading(false)
  }
 }

 async function captureFromCanvas(): Promise<Blob> {
  const video = videoRef.current!

  const canvas = document.createElement('canvas')

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const ctx = canvas.getContext('2d')

  if (!ctx) {
   throw new Error('Canvas is unavailable.')
  }

  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

  return new Promise<Blob>((resolve, reject) => {
   canvas.toBlob(
    (blob) => {
     if (blob) {
      resolve(blob)
     } else {
      reject(new Error('Failed to capture image.'))
     }
    },
    'image/jpeg',
    1,
   )
  })
 }

 return (
  <div className='relative h-full bg-black'>
   <video
    ref={videoRef}
    autoPlay
    playsInline
    muted
    className='h-full w-full object-cover'
   />

   {!cameraReady && (
    <div className='absolute inset-0 z-50 flex flex-col items-center justify-center bg-black'>
     <Loader2 className='h-10 w-10 animate-spin text-white' />

     <p className='mt-4 text-sm text-white'>Opening camera...</p>
    </div>
   )}

   <Button
    size='icon'
    variant='secondary'
    className='absolute left-5 top-5 z-50 rounded-full'
    onClick={() => {
     stopCamera()
     onClose()
    }}
   >
    <X className='h-5 w-5' />
   </Button>

   <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
    <div className='h-72 w-72 rounded-3xl border-2 border-dashed border-white' />
   </div>

   <Button
    disabled={!cameraReady || loading}
    onClick={capture}
    className='absolute bottom-8 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full'
   >
    {loading ? (
     <Loader2 className='h-6 w-6 animate-spin' />
    ) : (
     <Camera className='h-6 w-6' />
    )}
   </Button>
  </div>
 )
}
