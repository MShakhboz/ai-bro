'use client'

import { useMemo, useState } from 'react'
import { Camera } from 'lucide-react'

import QRScanner from '@/components/ui/qr-scanner'
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
 const { name } = useAppStore()

 const [isScanning, setIsScanning] = useState(false)

 const [dialogOpen, setDialogOpen] = useState(false)

 const [dialog, setDialog] = useState({
  title: '',
  description: '',
 })

 const greeting = useMemo(() => {
  const hour = new Date().getHours()

  if (hour < 12) return 'Доброе утро'
  if (hour < 18) return 'Добрый день'

  return 'Добрый вечер'
 }, [])

 const openSuccess = (value: string) => {
  setIsScanning(false)

  setDialog({
   title: 'QR Code',
   description: value,
  })

  setDialogOpen(true)
 }

 const openError = (message: string) => {
  setIsScanning(false)

  setDialog({
   title: 'Camera Error',
   description: message,
  })

  setDialogOpen(true)
 }

 const closeDialog = () => {
  setDialogOpen(false)
 }

 return (
  <>
   <div className='relative h-screen w-full overflow-hidden bg-[#F6F3EE] md:h-[860px] md:max-w-[430px] md:rounded-[36px] md:shadow-xl'>
    {isScanning ? (
     <QRScanner
      active={isScanning}
      onSuccess={openSuccess}
      onError={openError}
     />
    ) : (
     <div className='flex h-full flex-col px-8 py-10'>
      <div className='mt-14 text-center'>
       <h1 className='text-2xl leading-tight font-semibold text-[#241C17]'>
        {greeting},
        <br />
        {name || 'Гость'}
       </h1>
      </div>

      <div className='mt-14 flex justify-center'>
       <div className='flex h-72 w-72 items-center justify-center rounded-[34px] border-2 border-dashed border-[#C87437]'>
        <Camera size={72} strokeWidth={1.5} className='text-[#C87437]' />
       </div>
      </div>

      <div className='mt-10 text-center'>
       <h2
        className='text-3xl text-[#241C17]'
        style={{
         fontFamily: 'Georgia, serif',
        }}
       >
        Запустите сканирование
       </h2>

       <p className='mt-4 text-lg leading-8 text-[#847B73]'>
        Наведите камеру на QR-код или меню на вашем столике, чтобы пригласить
        AI-официанта
       </p>
      </div>

      <Button
       onClick={() => setIsScanning(true)}
       className='mt-auto h-16 rounded-2xl bg-[#C87437] text-lg hover:bg-[#B86631]'
      >
       <Camera className='mr-2 h-5 w-5' />
       Сканировать
      </Button>
     </div>
    )}
   </div>

   <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
    <DialogContent className='sm:max-w-md'>
     <DialogHeader>
      <DialogTitle>{dialog.title}</DialogTitle>

      <DialogDescription className='break-all pt-2 text-base'>
       {dialog.description}
      </DialogDescription>
     </DialogHeader>

     <Button onClick={closeDialog} className='mt-4'>
      Закрыть
     </Button>
    </DialogContent>
   </Dialog>
  </>
 )
}
