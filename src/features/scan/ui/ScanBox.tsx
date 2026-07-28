'use client'

import { useMemo, useState } from 'react'
import { Camera } from 'lucide-react'

import CameraScanner from '@/components/ui/camera-scanner'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/use-app-store'

import { Button } from '@/components/ui/button'

import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogHeader,
 DialogTitle,
} from '@/components/ui/dialog'

import { useScanQr } from '@/features/scan/hooks/useScanQr'
import { usePhotoScanSession } from '../hooks/usePhotoScanSession'
import { useGeolocation } from '@/shared/hooks/useGeolocation'
import Image from 'next/image'

export default function ScanBox() {
 const { name, setPendingScan } = useAppStore()
 const router = useRouter()
 const [isScanning, setIsScanning] = useState(false)

 const [dialogOpen, setDialogOpen] = useState(false)
 const [dialog, setDialog] = useState<{
  title: string
  description: string
  imageUrl?: string
 }>({
  title: '',
  description: '',
 })

 const { mutateAsync: scanQr, isPending: isQrPending } = useScanQr()
 const { location } = useGeolocation()

 const {
  addPhoto: submitPhotoScan,
  finish,
  reset,
 } = usePhotoScanSession({
  latitude: location?.latitude ?? NaN,
  longitude: location?.longitude ?? NaN,
 })

 const isProcessing = isQrPending

 const greeting = useMemo(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Доброе утро'
  if (hour < 18) return 'Добрый день'
  return 'Добрый вечер'
 }, [])

 const showDialog = (title: string, description: string, imageUrl?: string) => {
  setIsScanning(false)
  setDialog({ title, description, imageUrl })
  setDialogOpen(true)
 }

 const handleQrSuccess = async (value: string) => {
  try {
   const result = await scanQr({
    url: value,
    latitude: location?.latitude ?? NaN,
    longitude: location?.longitude ?? NaN,
   })
   setPendingScan({ type: 'qr', value })
   router.push(`/restaurants`)
  } catch {
   showDialog(
    'Ошибка сканирования',
    'Не удалось распознать QR-код. Попробуйте снова.',
   )
  }
 }

 const handlePhotoSuccess = async (photo: File, dataUrl: string) => {
  try {
   await submitPhotoScan(photo)
   setPendingScan({ type: 'image', preview: dataUrl })
   router.push(`/restaurants`)
  } catch (err) {
   const message =
    err instanceof Error
     ? err.message
     : 'Не удалось обработать фото меню. Попробуйте снова.'
   showDialog('Ошибка загрузки', message)
  }
 }

 return (
  <>
   <div className='relative h-full w-full bg-[#F6F3EE]'>
    {isScanning ? (
     <CameraScanner
      onQrSuccess={handleQrSuccess}
      onPhotoSuccess={handlePhotoSuccess}
      onError={(error) => showDialog('Ошибка камеры', error)}
      onClose={() => setIsScanning(false)}
     />
    ) : (
     <div className='flex h-full flex-col px-8 py-3'>
      <div className='mt-5 text-center'>
       <h1 className='text-2xl font-semibold leading-tight text-[#241C17]'>
        {greeting},
        <br />
        {name?.name || 'Гость'}
       </h1>
      </div>

      <div className='mt-6 flex justify-center'>
       <div
        className='flex h-55 w-55 items-center justify-center rounded-[34px]'
        style={{
         backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='none' rx='34' ry='34' stroke='%23C87437' stroke-width='2' stroke-dasharray='10%2C 8'/%3E%3C/svg%3E")`,
        }}
       >
        <Image
         width={120}
         height={120}
         src='/smart-waiter-onboarding.svg'
         alt='Smart waiter'
        />
       </div>
      </div>

      <div className='mt-5 text-center'>
       <h2 className='text-xl text-[#241C17]'>
        Сканируйте QR-код или сфотографируйте меню
       </h2>
       <p className='mx-auto mt-4 max-w-65 text-sm text-[#847B73]'>
        После открытия камеры вы сможете переключаться между QR-кодом и
        фотографией меню.
       </p>
      </div>

      <Button
       onClick={() => setIsScanning(true)}
       disabled={isProcessing}
       className='mt-auto h-14 rounded-full bg-[#C87437] text-base hover:bg-[#B96530]'
      >
       <Camera className='mr-2 h-5 w-5' />
       {isProcessing ? 'Обработка...' : 'Открыть камеру'}
      </Button>
     </div>
    )}
   </div>

   <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
    <DialogContent>
     <DialogHeader>
      <DialogTitle>{dialog.title}</DialogTitle>
      {dialog.description && (
       <DialogDescription className='break-all whitespace-pre-wrap'>
        {dialog.description}
       </DialogDescription>
      )}
     </DialogHeader>

     {dialog.imageUrl && (
      <img
       src={dialog.imageUrl}
       alt='Фото меню'
       className='max-h-[60vh] w-full rounded-lg object-contain'
      />
     )}

     <Button onClick={() => setDialogOpen(false)}>Закрыть</Button>
    </DialogContent>
   </Dialog>
  </>
 )
}
