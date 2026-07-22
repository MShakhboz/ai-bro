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

export default function ScanPage() {
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

 const greeting = useMemo(() => {
  const hour = new Date().getHours()

  if (hour < 12) return 'Доброе утро'
  if (hour < 18) return 'Добрый день'

  return 'Добрый вечер'
 }, [])

 const showDialog = (title: string, description: string, imageUrl?: string) => {
  setIsScanning(false)

  setDialog({
   title,
   description,
   imageUrl,
  })

  setDialogOpen(true)
 }

 return (
  <>
   <div className='relative h-full w-full bg-[#F6F3EE]'>
    {isScanning ? (
     <CameraScanner
      onQrSuccess={(value) => {
       setPendingScan({
        type: 'qr',
        value,
       })

       router.push('/chat')
      }}
      onPhotoSuccess={(_photo, dataUrl) => {
       setPendingScan({
        type: 'image',
        preview: dataUrl,
       })

       router.push('/chat')
      }}
      onError={(error) => {
       showDialog('Camera Error', error)
      }}
      onClose={() => {
       setIsScanning(false)
      }}
     />
    ) : (
     <div className='flex h-full flex-col px-8 py-3'>
      <div className='mt-5 text-center'>
       <h1 className='text-2xl font-semibold leading-tight text-[#241C17]'>
        {greeting},
        <br />
        {name || 'Гость'}
       </h1>
      </div>

      <div className='mt-6 flex justify-center'>
       <div className='flex h-55 w-55 items-center justify-center rounded-[34px] border-2 border-dashed border-[#C87437]'>
        <Camera size={72} strokeWidth={1.5} className='text-[#C87437]' />
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
       className='mt-auto h-14 rounded-full bg-[#C87437] text-base hover:bg-[#B96530]'
      >
       <Camera className='mr-2 h-5 w-5' />
       Открыть камеру
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
