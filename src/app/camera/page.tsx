'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CameraPage() {
 const videoRef = useRef<HTMLVideoElement>(null)
 const canvasRef = useRef<HTMLCanvasElement>(null)

 const [stream, setStream] = useState<MediaStream | null>(null)
 const [photo, setPhoto] = useState<string | null>(null)
 const [loading, setLoading] = useState(false)

 const startCamera = async () => {
  try {
   setLoading(true)

   const mediaStream = await navigator.mediaDevices.getUserMedia({
    video: {
     facingMode: {
      ideal: 'environment',
     },
    },
    audio: false,
   })

   setStream(mediaStream)

   if (videoRef.current) {
    videoRef.current.srcObject = mediaStream
    await videoRef.current.play()
   }
  } catch (error) {
   console.error(error)
   alert('Could not access the camera.')
  } finally {
   setLoading(false)
  }
 }

 const stopCamera = () => {
  stream?.getTracks().forEach((track) => track.stop())
  setStream(null)
 }

 const capture = () => {
  if (!videoRef.current || !canvasRef.current) return

  const video = videoRef.current
  const canvas = canvasRef.current

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const ctx = canvas.getContext('2d')

  if (!ctx) return

  ctx.drawImage(video, 0, 0)

  const image = canvas.toDataURL('image/jpeg', 0.95)

  setPhoto(image)
 }

 const retake = () => {
  setPhoto(null)
 }

 useEffect(() => {
  return () => {
   stream?.getTracks().forEach((track) => track.stop())
  }
 }, [stream])

 return (
  <main className='container mx-auto flex min-h-screen items-center justify-center p-6'>
   <Card className='w-full max-w-lg'>
    <CardHeader>
     <CardTitle>Camera MVP</CardTitle>
    </CardHeader>

    <CardContent className='space-y-4'>
     {!stream && (
      <Button className='w-full' onClick={startCamera} disabled={loading}>
       {loading ? 'Opening camera...' : 'Open Camera'}
      </Button>
     )}

     {stream && !photo && (
      <>
       <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className='aspect-[3/4] w-full rounded-xl bg-black object-cover'
       />

       <div className='flex gap-2'>
        <Button className='flex-1' onClick={capture}>
         Capture
        </Button>

        <Button variant='secondary' className='flex-1' onClick={stopCamera}>
         Stop
        </Button>
       </div>
      </>
     )}

     {photo && (
      <>
       <img src={photo} alt='Captured' className='w-full rounded-xl' />

       <div className='flex gap-2'>
        <Button className='flex-1' onClick={retake}>
         Retake
        </Button>

        <Button
         variant='secondary'
         className='flex-1'
         onClick={() => {
          console.log(photo)
         }}
        >
         Upload
        </Button>
       </div>
      </>
     )}

     <canvas ref={canvasRef} className='hidden' />
    </CardContent>
   </Card>
  </main>
 )
}
