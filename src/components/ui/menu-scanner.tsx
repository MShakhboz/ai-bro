'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Camera } from 'lucide-react'
import Tesseract from 'tesseract.js'

import { Button } from '@/components/ui/button'

interface Props {
 onSuccess(text: string): void
 onError(error: string): void
 onClose(): void
}

export default function MenuScanner({ onSuccess, onError, onClose }: Props) {
 const videoRef = useRef<HTMLVideoElement>(null)

 const streamRef = useRef<MediaStream>()

 const [loading, setLoading] = useState(false)

 useEffect(() => {
  startCamera()

  return stopCamera
 }, [])

 async function startCamera() {
  try {
   const stream = await navigator.mediaDevices.getUserMedia({
    video: {
     facingMode: 'environment',
    },
   })

   streamRef.current = stream

   if (videoRef.current) {
    videoRef.current.srcObject = stream
   }
  } catch {
   onError('Cannot access camera')
  }
 }

 function stopCamera() {
  streamRef.current?.getTracks().forEach((track) => track.stop())
 }

 async function capture() {
  if (!videoRef.current) return

  setLoading(true)

  try {
   const canvas = document.createElement('canvas')

   canvas.width = videoRef.current.videoWidth
   canvas.height = videoRef.current.videoHeight

   canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)

   const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.95),
   )

   const {
    data: { text },
   } = await Tesseract.recognize(blob, 'rus+eng')

   stopCamera()

   onSuccess(text)
  } catch {
   onError('Unable to recognize text.')
  } finally {
   setLoading(false)
  }
 }

 return (
  <div className='relative h-full'>
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
    className='absolute left-5 top-5'
    onClick={() => {
     stopCamera()
     onClose()
    }}
   >
    <X />
   </Button>

   <Button
    disabled={loading}
    onClick={capture}
    className='absolute bottom-8 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full'
   >
    <Camera />
   </Button>
  </div>
 )
}
