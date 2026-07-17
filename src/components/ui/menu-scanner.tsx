'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, X } from 'lucide-react'
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
    },
    audio: false,
   })

   streamRef.current = stream

   if (!videoRef.current) return

   videoRef.current.srcObject = stream

   await new Promise<void>((resolve) => {
    if (!videoRef.current) {
     resolve()
     return
    }

    videoRef.current.onloadedmetadata = () => {
     videoRef.current?.play()
     resolve()
    }
   })
  } catch (error) {
   console.error(error)
   onError('Cannot access camera.')
  }
 }

 function stopCamera() {
  streamRef.current?.getTracks().forEach((track) => track.stop())

  streamRef.current = null

  if (videoRef.current) {
   videoRef.current.srcObject = null
  }
 }

 async function capture() {
  if (!videoRef.current) return

  setLoading(true)

  try {
   const video = videoRef.current

   const canvas = document.createElement('canvas')

   canvas.width = video.videoWidth
   canvas.height = video.videoHeight

   const ctx = canvas.getContext('2d')

   if (!ctx) {
    throw new Error('Canvas not supported.')
   }

   ctx.drawImage(video, 0, 0)

   const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
     (blob) => {
      if (blob) {
       resolve(blob)
      } else {
       reject(new Error('Failed to capture image.'))
      }
     },
     'image/jpeg',
     0.95,
    )
   })

   const {
    data: { text },
   } = await Tesseract.recognize(blob, 'rus+eng')

   stopCamera()

   onSuccess(text.trim())
  } catch (error) {
   console.error(error)

   onError('Unable to recognize text.')
  } finally {
   setLoading(false)
  }
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
    <div className='h-72 w-72 rounded-3xl border-2 border-dashed border-white/80' />
   </div>

   <Button
    disabled={loading}
    onClick={capture}
    className='absolute bottom-8 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full'
   >
    {loading ? (
     <span className='text-sm'>...</span>
    ) : (
     <Camera className='h-6 w-6' />
    )}
   </Button>
  </div>
 )
}
