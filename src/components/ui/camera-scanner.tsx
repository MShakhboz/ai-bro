'use client'

import { useState, useRef, useEffect } from 'react'
import Webcam from 'react-webcam'
import { Button } from '@/components/ui/button'
import { X, Camera, Loader2 } from 'lucide-react'
import { useCamera } from '@/hooks/useCamera'

type Mode = 'qr' | 'menu'

interface Props {
 onQrSuccess(value: string): void
 onPhotoSuccess(photo: Blob, dataUrl: string): void
 onError(error: string): void
 onClose(): void
}

export default function CameraScanner({
 onQrSuccess,
 onPhotoSuccess,
 onError,
 onClose,
}: Props) {
 const [mode, setMode] = useState<Mode>('qr')

 // Keeps mutable track of what tab the user is seeing in real-time
 const activeModeRef = useRef<Mode>('qr')

 useEffect(() => {
  activeModeRef.current = mode
 }, [mode])

 const {
  webcamRef,
  ready,
  loading,
  capturePhoto,
  stopCamera,
  handleVideoLoad,
 } = useCamera({
  onQrSuccess: (value) => {
   // The background engine scans continuously, but we block processing unless the active tab is 'qr'
   if (activeModeRef.current === 'qr') {
    onQrSuccess(value)
   }
  },
  onPhotoSuccess,
  onError,
 })

 return (
  <div className='relative h-full w-full bg-black overflow-hidden'>
   <Webcam
    audio={false}
    ref={webcamRef}
    screenshotFormat='image/jpeg'
    onUserMedia={handleVideoLoad}
    onUserMediaError={(err) => {
     console.error('Webcam media tracking failure:', err)
     onError('Unable to access camera.')
    }}
    // Pass HTML video properties directly as top-level props
    onCanPlay={handleVideoLoad}
    playsInline={true}
    muted={true}
    forceScreenshotSourceSize={true}
    videoConstraints={{
     facingMode: { ideal: 'environment' },
     width: { ideal: 1280 },
     height: { ideal: 720 },
    }}
    className='h-full w-full object-cover'
   />

   {!ready && (
    <div className='absolute inset-0 z-50 flex items-center justify-center bg-black'>
     <Loader2 className='h-8 w-8 animate-spin text-white' />
    </div>
   )}

   <div className='absolute top-5 left-1/2 z-50 -translate-x-1/2'>
    <div className='flex rounded-full bg-black/60 p-1 backdrop-blur'>
     <button
      onClick={() => setMode('qr')}
      className={`rounded-full text-sm px-6 py-2 transition whitespace-nowrap ${
       mode === 'qr' ? 'bg-white text-black' : 'text-white'
      }`}
     >
      QR-код
     </button>

     <button
      onClick={() => setMode('menu')}
      className={`rounded-full text-sm px-6 py-2 transition whitespace-nowrap ${
       mode === 'menu' ? 'bg-white text-black' : 'text-white'
      }`}
     >
      Фото меню
     </button>
    </div>
   </div>

   <Button
    size='icon'
    variant='secondary'
    className='absolute left-5 top-5 z-50 rounded-full'
    onClick={() => {
     stopCamera()
     onClose()
    }}
   >
    <X />
   </Button>

   <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
    {mode === 'qr' ? (
     <div className='relative h-72 w-72 rounded-3xl border-2 border-white border-dashed' />
    ) : (
     <div className='h-72 w-72 rounded-3xl border-2 border-dashed border-white' />
    )}
   </div>

   <div className='absolute bottom-26 left-0 right-0 text-center text-white'>
    {mode === 'qr'
     ? 'Наведите камеру на QR-код на столе'
     : 'Сфотографируйте страницу меню'}
   </div>

   {mode === 'menu' && (
    <Button
     disabled={!ready || loading}
     onClick={capturePhoto}
     className='absolute bottom-5 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full border-[6px] border-white bg-white text-black hover:bg-white'
    >
     {loading ? <Loader2 className='animate-spin' /> : <Camera />}
    </Button>
   )}
  </div>
 )
}
