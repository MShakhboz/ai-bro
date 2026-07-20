'use client'

import { useEffect, useState } from 'react'
import { Camera, Loader2, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
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

 const {
  videoRef,
  canvasRef,
  ready,
  loading,
  startQr,
  stopQr,
  capturePhoto,
  stopCamera,
 } = useCamera({
  onQrSuccess,
  onPhotoSuccess,
  onError,
 })

 useEffect(() => {
  if (!ready) return

  if (mode === 'qr') {
   void startQr()
  } else {
   void stopQr()
  }
 }, [mode, ready, startQr, stopQr])

 return (
  <div className='relative h-full w-full overflow-hidden bg-black'>
   <video
    ref={videoRef}
    playsInline
    muted
    autoPlay
    className='h-full w-full object-cover'
   />

   {/* Hidden canvas used for photo capture */}
   <canvas ref={canvasRef} className='hidden' />

   {!ready && (
    <div className='absolute inset-0 z-50 flex items-center justify-center bg-black'>
     <Loader2 className='h-8 w-8 animate-spin text-white' />
    </div>
   )}

   {/* Mode Switch */}
   <div className='absolute left-1/2 top-5 z-50 -translate-x-1/2'>
    <div className='flex rounded-full bg-black/60 p-1 backdrop-blur'>
     <button
      onClick={() => setMode('qr')}
      className={`rounded-full px-6 py-2 text-sm transition whitespace-nowrap ${
       mode === 'qr' ? 'bg-white text-black' : 'text-white'
      }`}
     >
      QR-код
     </button>

     <button
      onClick={() => setMode('menu')}
      className={`rounded-full px-6 py-2 text-sm transition whitespace-nowrap ${
       mode === 'menu' ? 'bg-white text-black' : 'text-white'
      }`}
     >
      Фото меню
     </button>
    </div>
   </div>

   {/* Close */}
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

   {/* QR Overlay */}
   {mode === 'qr' && (
    <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
     <div className='h-72 w-72 rounded-3xl border-2 border-dashed border-white' />
    </div>
   )}

   {/* Hint */}
   <div className='absolute bottom-28 left-0 right-0 px-6 text-center text-white'>
    {mode === 'qr'
     ? 'Наведите камеру на QR-код на столе'
     : 'Сфотографируйте страницу меню'}
   </div>

   {/* Capture Button */}
   {mode === 'menu' && (
    <Button
     disabled={!ready || loading}
     onClick={() => void capturePhoto()}
     className='absolute bottom-6 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full border-[6px] border-white bg-white text-black hover:bg-white'
    >
     {loading ? <Loader2 className='animate-spin' /> : <Camera />}
    </Button>
   )}
  </div>
 )
}
