'use client'

import { useMemo, useState } from 'react'
import { Camera } from 'lucide-react'

import QRScanner from '@/components/ui/qr-scanner'
import MenuScanner from '@/components/ui/menu-scanner'
import ScannerMode from '@/components/ui/scanner-mode'

import { useAppStore } from '@/store/use-app-store'

import { Button } from '@/components/ui/button'

import {
 Dialog,
 DialogContent,
 DialogDescription,
 DialogHeader,
 DialogTitle,
} from '@/components/ui/dialog'

type ScanMode = 'qr' | 'menu'

export default function ScanPage() {
 const { name } = useAppStore()

 const [mode, setMode] = useState<ScanMode>('qr')

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

 const showDialog = (title: string, description: string) => {
  setIsScanning(false)

  setDialog({
   title,
   description,
  })

  setDialogOpen(true)
 }

 return (
  <>
   <div className='relative h-full w-full bg-[#F6F3EE] py-3'>
    {isScanning ? (
     mode === 'qr' ? (
      <QRScanner
       active
       onSuccess={(value) => showDialog('QR Code', value)}
       onError={(error) => showDialog('Camera Error', error)}
       onClose={() => setIsScanning(false)}
      />
     ) : (
      <MenuScanner
       onSuccess={(text) => showDialog('Menu Text', text)}
       onError={(error) => showDialog('Camera Error', error)}
       onClose={() => setIsScanning(false)}
      />
     )
    ) : (
     <div className='flex h-full flex-col px-8'>
      <ScannerMode value={mode} onChange={setMode} />

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
        {mode === 'qr' ? 'Запустите сканирование' : 'Сфотографируйте меню'}
       </h2>

       <p className='mx-auto mt-4 max-w-65 text-sm text-[#847B73]'>
        {mode === 'qr'
         ? 'Наведите камеру на QR-код.'
         : 'Сделайте фотографию меню для распознавания.'}
       </p>
      </div>

      <Button
       onClick={() => setIsScanning(true)}
       className='mt-auto h-14 rounded-full bg-[#C87437] text-base hover:bg-[#B96530]'
      >
       <Camera className='mr-2 h-5 w-5' />
       {mode === 'qr' ? 'Сканировать QR' : 'Сделать фото'}
      </Button>
     </div>
    )}
   </div>

   <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
    <DialogContent>
     <DialogHeader>
      <DialogTitle>{dialog.title}</DialogTitle>

      <DialogDescription className='break-all whitespace-pre-wrap'>
       {dialog.description}
      </DialogDescription>
     </DialogHeader>

     <Button onClick={() => setDialogOpen(false)}>Закрыть</Button>
    </DialogContent>
   </Dialog>
  </>
 )
}
