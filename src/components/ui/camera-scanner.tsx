'use client'

import { useState, useRef, useEffect } from 'react'
import Webcam from 'react-webcam'
import { Button } from '@/components/ui/button'
import { X, Camera, Image as ImageIcon, Loader2 } from 'lucide-react'
import { useCamera } from '@/shared/hooks/useCamera'
import { compressToJpeg } from '@/shared/lib/compress-to-jpeg'

type Mode = 'qr' | 'menu'

interface Props {
 onQrSuccess(value: string): void
 onPhotoSuccess(photo: File, dataUrl: string): void
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

 const fileInputRef = useRef<HTMLInputElement>(null)

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
   if (activeModeRef.current === 'qr') {
    onQrSuccess(value)
   }
  },
  onPhotoSuccess,
  onError,
 })

 const handleGalleryClick = () => {
  fileInputRef.current?.click()
 }

 const handleGalleryChange = async (
  event: React.ChangeEvent<HTMLInputElement>,
 ) => {
  const file = event.target.files?.[0]

  // Reset so the same image can be selected again
  event.target.value = ''

  if (!file) return

  if (!file.type.startsWith('image/')) {
   onError('Выберите изображение.')
   return
  }

  try {
   const compressedFile = await compressToJpeg(file)

   const previewUrl = URL.createObjectURL(compressedFile)

   stopCamera()
   onPhotoSuccess(compressedFile, previewUrl)
  } catch (error) {
   console.error('Gallery image compression failed:', error)
   onError(
    error instanceof Error
     ? error.message
     : 'Не удалось обработать изображение.',
   )
  }
 }

 return (
  <div className='relative h-full w-full overflow-hidden bg-black'>
   <Webcam
    audio={false}
    ref={webcamRef}
    screenshotFormat='image/jpeg'
    onUserMedia={handleVideoLoad}
    onUserMediaError={(err) => {
     console.error('Webcam media tracking failure:', err)
     onError('Unable to access camera.')
    }}
    onCanPlay={handleVideoLoad}
    playsInline
    muted
    forceScreenshotSourceSize
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

   {/* Gallery input */}
   <input
    ref={fileInputRef}
    type='file'
    accept='image/*'
    className='hidden'
    onChange={handleGalleryChange}
   />

   <div className='absolute left-1/2 top-5 z-50 -translate-x-1/2'>
    <div className='flex rounded-full bg-black/60 p-1 backdrop-blur'>
     <button
      onClick={() => setMode('qr')}
      className={`whitespace-nowrap rounded-full px-6 py-2 text-sm transition ${
       mode === 'qr' ? 'bg-white text-black' : 'text-white'
      }`}
     >
      QR-код
     </button>

     <button
      onClick={() => setMode('menu')}
      className={`whitespace-nowrap rounded-full px-6 py-2 text-sm transition ${
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
    className='absolute right-5 top-5 z-50 rounded-full'
    onClick={() => {
     stopCamera()
     onClose()
    }}
   >
    <X />
   </Button>

   <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
    {mode === 'qr' && (
     <div className='relative h-72 w-72'>
      <svg
       className='absolute inset-0 h-full w-full'
       xmlns='http://www.w3.org/2000/svg'
      >
       <rect
        x='1'
        y='1'
        width='calc(100% - 2px)'
        height='calc(100% - 2px)'
        rx='24'
        fill='none'
        stroke='white'
        strokeWidth='2'
        strokeDasharray='16 32'
       />
      </svg>
     </div>
    )}
   </div>

   <div className='absolute bottom-26 left-0 right-0 text-center text-white'>
    {mode === 'qr'
     ? 'Наведите камеру на QR-код на столе'
     : 'Сфотографируйте страницу меню'}
   </div>

   {mode === 'menu' && (
    <div className='absolute bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-5'>
     {/* Gallery */}
     <Button
      type='button'
      size='icon'
      variant='secondary'
      disabled={loading}
      onClick={handleGalleryClick}
      className='h-12 w-12 rounded-full'
     >
      <ImageIcon />
     </Button>

     {/* Camera */}
     <Button
      type='button'
      disabled={!ready || loading}
      onClick={capturePhoto}
      className='h-20 w-20 rounded-full border-[6px] border-white bg-white text-black hover:bg-white'
     >
      {loading ? <Loader2 className='animate-spin' /> : <Camera />}
     </Button>

     {/* Keeps camera button centered */}
     <div className='h-12 w-12' />
    </div>
   )}
  </div>
 )
}
