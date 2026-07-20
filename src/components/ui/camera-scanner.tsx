'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, Camera, Loader2 } from 'lucide-react'
import { useCamera } from '@/hooks/useCamera'

type Mode = 'qr' | 'menu'

interface Props {
 onQrSuccess(value: string): void
 onMenuSuccess(text: string): void
 onError(error: string): void
 onClose(): void
}

export default function CameraScanner({
 onQrSuccess,
 onMenuSuccess,
 onError,
 onClose,
}: Props) {
 const [mode, setMode] = useState<Mode>('qr')

 const { videoRef, ready, loading, startQr, stopQr, captureMenu, stopCamera } =
  useCamera({
   onQrSuccess,
   onMenuSuccess,
   onError,
  })

 useEffect(() => {
  if (mode === 'qr') {
   startQr()
  } else {
   stopQr()
  }
 }, [mode, startQr, stopQr])

 return (
  <div className='relative h-full bg-black'>
   <video
    ref={videoRef}
    autoPlay
    playsInline
    muted
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
      className={`rounded-full px-6 py-2 transition ${
       mode === 'qr' ? 'bg-white text-black' : 'text-white'
      }`}
     >
      QR-code
     </button>

     <button
      onClick={() => setMode('menu')}
      className={`rounded-full px-6 py-2 transition ${
       mode === 'menu' ? 'bg-white text-black' : 'text-white'
      }`}
     >
      Menu Photo
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
     <div className='h-72 w-72 rounded-3xl border-2 border-white'>
      <div className='absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 animate-pulse bg-green-400' />
     </div>
    ) : (
     <div className='h-[75%] w-[88%] rounded-3xl border-2 border-dashed border-white' />
    )}
   </div>

   <div className='absolute bottom-36 left-0 right-0 text-center text-white'>
    {mode === 'qr' ? 'Point camera at QR code' : 'Photograph menu page'}
   </div>

   {mode === 'menu' && (
    <Button
     disabled={!ready || loading}
     onClick={captureMenu}
     className='absolute bottom-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full border-[6px] border-white bg-white text-black hover:bg-white'
    >
     {loading ? <Loader2 className='animate-spin' /> : <Camera />}
    </Button>
   )}
  </div>
 )
}
