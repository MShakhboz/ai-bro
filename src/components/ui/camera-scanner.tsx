'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Webcam from 'react-webcam'
import { Button } from '@/components/ui/button'
import { X, Plus, Loader2 } from 'lucide-react'
import { useCamera } from '@/shared/hooks/useCamera'
import { compressToJpeg } from '@/shared/lib/compress-to-jpeg'

type Mode = 'qr' | 'menu'

type MenuPhoto = {
 id: string
 file: File
 preview: string
}

interface Props {
 onQrSuccess(value: string): void
 onPhotosSuccess(photos: File[]): void | Promise<void>
 onError(error: string): void
 onClose(): void
}

function toMenuPhoto(file: File): MenuPhoto {
 return {
  id: uuidv4(),
  file,
  preview: URL.createObjectURL(file),
 }
}

export default function CameraScanner({
 onQrSuccess,
 onPhotosSuccess,
 onError,
 onClose,
}: Props) {
 const [mode, setMode] = useState<Mode>('qr')
 const [photos, setPhotos] = useState<MenuPhoto[]>([])
 const [galleryLoading, setGalleryLoading] = useState(false)
 const [submitting, setSubmitting] = useState(false)

 const fileInputRef = useRef<HTMLInputElement>(null)

 // Keeps mutable track of what tab the user is seeing in real-time
 const activeModeRef = useRef<Mode>('qr')
 const isQrActive = useCallback(() => activeModeRef.current === 'qr', [])

 useEffect(() => {
  activeModeRef.current = mode
 }, [mode])

 // Release preview URLs when the scanner closes
 const photosRef = useRef(photos)
 useEffect(() => {
  photosRef.current = photos
 }, [photos])
 useEffect(() => {
  return () => {
   photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.preview))
  }
 }, [])

 const addPhotos = (files: File[]) => {
  setPhotos((prev) => [...prev, ...files.map(toMenuPhoto)])
 }

 const removePhoto = (id: string) => {
  setPhotos((prev) => {
   const removed = prev.find((photo) => photo.id === id)
   if (removed) URL.revokeObjectURL(removed.preview)

   return prev.filter((photo) => photo.id !== id)
  })
 }

 const {
  webcamRef,
  ready,
  loading,
  capturePhoto,
  stopCamera,
  handleVideoLoad,
 } = useCamera({
  onQrSuccess,
  onPhotoSuccess: (file) => addPhotos([file]),
  onError,
  isQrActive,
 })

 const handleGalleryChange = async (
  event: React.ChangeEvent<HTMLInputElement>,
 ) => {
  const files = Array.from(event.target.files ?? [])

  // Reset so the same image can be selected again
  event.target.value = ''

  if (!files.length) return

  if (files.some((file) => !file.type.startsWith('image/'))) {
   onError('Выберите изображение.')
   return
  }

  setGalleryLoading(true)

  try {
   const compressed: File[] = []

   for (const file of files) {
    compressed.push(await compressToJpeg(file))
   }

   addPhotos(compressed)
  } catch (error) {
   console.error('Gallery image compression failed:', error)
   onError(
    error instanceof Error
     ? error.message
     : 'Не удалось обработать изображение.',
   )
  } finally {
   setGalleryLoading(false)
  }
 }

 const handleSubmit = async () => {
  setSubmitting(true)

  try {
   await onPhotosSuccess(photos.map((photo) => photo.file))
  } finally {
   setSubmitting(false)
  }
 }

 const showReview = photos.length > 0

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
    multiple
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

   {mode === 'qr' && (
    <div className='absolute bottom-26 left-0 right-0 text-center text-white'>
     Наведите камеру на QR-код на столе
    </div>
   )}

   {mode === 'menu' && (
    <div className='absolute inset-x-0 bottom-0 z-50 bg-[#1D140F]/75 px-4 pt-4 pb-5 backdrop-blur-sm'>
     {showReview ? (
      <>
       {/* Taken pages */}
       <div className='flex gap-3 overflow-x-auto pt-2 pr-2'>
        <button
         type='button'
         aria-label='Добавить из галереи'
         disabled={galleryLoading || submitting}
         onClick={() => fileInputRef.current?.click()}
         className='flex size-14 shrink-0 items-center justify-center rounded-lg border border-dashed border-white/70 text-white disabled:opacity-50'
        >
         {galleryLoading ? (
          <Loader2 className='size-5 animate-spin' />
         ) : (
          <Plus className='size-5' />
         )}
        </button>

        {photos.map((photo, index) => (
         <div key={photo.id} className='relative size-14 shrink-0'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
           src={photo.preview}
           alt={`Страница ${index + 1}`}
           className='size-full rounded-lg object-cover'
          />

          <button
           type='button'
           aria-label={`Удалить страницу ${index + 1}`}
           disabled={submitting}
           onClick={() => removePhoto(photo.id)}
           className='absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-white text-[#C87437] shadow'
          >
           <X className='size-3.5' />
          </button>
         </div>
        ))}
       </div>

       <div className='mt-4 flex gap-3'>
        <Button
         type='button'
         disabled={!ready || loading || submitting}
         onClick={capturePhoto}
         className='h-11 flex-1 rounded-xl bg-white text-sm font-semibold text-[#7A6A52] hover:bg-white/90'
        >
         {loading && <Loader2 className='mr-2 size-4 animate-spin' />}
         Еще страница
        </Button>

        <Button
         type='button'
         disabled={submitting}
         onClick={handleSubmit}
         className='h-11 flex-1 rounded-xl bg-[#C87437] text-sm font-semibold text-white hover:bg-[#B96530]'
        >
         {submitting && <Loader2 className='mr-2 size-4 animate-spin' />}
         Распознать меню
        </Button>
       </div>
      </>
     ) : (
      <div className='flex flex-col items-center gap-4'>
       <p className='text-center text-sm text-white'>
        Сфотографируйте страницу меню
       </p>

       <div className='relative flex w-full items-center justify-center'>
        {/* Shutter */}
        <button
         type='button'
         aria-label='Сфотографировать'
         disabled={!ready || loading}
         onClick={capturePhoto}
         className='flex size-18 items-center justify-center rounded-full border-[3px] border-white/60 p-1 disabled:opacity-60'
        >
         <span className='flex size-full items-center justify-center rounded-full bg-white text-black'>
          {loading && <Loader2 className='size-6 animate-spin' />}
         </span>
        </button>
       </div>
      </div>
     )}
    </div>
   )}
  </div>
 )
}
