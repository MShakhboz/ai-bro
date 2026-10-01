'use client'

import { useEffect, useMemo, useState } from 'react'
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

import { useScanSession } from '../hooks/useScanSession'
import { useGeolocation } from '@/shared/hooks/useGeolocation'
import Image from 'next/image'
import RestaurantsLoading from '@/features/restaurants/ui/RestaurantsLoading'
import { useSessionStatus } from '../hooks/useSessionStatus'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['600'],
})

export default function ScanBox() {
  const { name, setPendingScan } = useAppStore()
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  const [startPolling, setStartPolling] = useState(false)
  const [open, setOpen] = useState(false)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialog, setDialog] = useState<{
    title: string
    description: string
    imageUrl?: string
  }>({
    title: '',
    description: '',
  })

  const { location } = useGeolocation()

  const {
    addPhoto: submitPhotoScan,
    scanQr,
    finish,
    reset,
    sessionId,
    isPending,
  } = useScanSession({
    latitude: location?.latitude ?? NaN,
    longitude: location?.longitude ?? NaN,
  })

  const {
    data: sessionStatus,
    isError: isSessionStatusError,
    isLoading,
    error,
  } = useSessionStatus(sessionId, startPolling, () => setStartPolling(false))

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Доброе утро'
    if (hour < 18) return 'Добрый день'
    return 'Добрый вечер'
  }, [])

  const showDialog = (
    title: string,
    description: string,
    imageUrl?: string,
  ) => {
    setIsScanning(false)
    setDialog({ title, description, imageUrl })
    setDialogOpen(true)
    setStartPolling(false)
  }

  const handleQrSuccess = async (value: string) => {
    try {
      await scanQr(value)
      setStartPolling(true)
      setIsScanning(false)
      //  setPendingScan({ type: 'qr', value })
      // router.push(`/restaurants`)
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
      setStartPolling(true)
      setIsScanning(false)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Не удалось обработать фото меню. Попробуйте снова.'
      showDialog('Ошибка загрузки', message)
    }
  }

  useEffect(() => {
    if (
      isSessionStatusError ||
      sessionStatus?.status === 'failed' ||
      sessionStatus?.candidates?.length == 0 ||
      !sessionStatus?.guessed_restaurant_name
    ) {
      setDialogOpen(isSessionStatusError)
      setDialog({
        title: 'Ошибка',
        description:
          sessionStatus?.status === 'failed'
            ? 'Попробуйет еше раз'
            : (error?.message ?? ''),
      })
    }
  }, [isSessionStatusError, sessionStatus])

  useEffect(() => {
    if (sessionStatus?.candidates?.length) {
      setOpen(true)
    }
  }, [sessionStatus?.candidates])

  if (
    isPending ||
    isLoading ||
    ['pending', 'processing'].includes(sessionStatus?.status ?? '')
  ) {
    return <RestaurantsLoading />
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
          <div className='flex h-full flex-col overflow-y-auto bg-white px-8 pt-3 pb-[clamp(0.75rem,4dvh,2rem)]'>
            <div className='flex flex-1 flex-col items-center justify-center gap-[clamp(1rem,4dvh,2.5rem)]'>
              <h1
                className={`${playfair.className} text-center text-[clamp(1.25rem,3.6dvh,1.75rem)] leading-tight font-semibold text-[#1C1409]`}
              >
                {greeting},
                <br />
                {name?.name || 'Гость'}
              </h1>

              <div
                className='flex size-[clamp(8rem,30dvh,13.75rem)] shrink-0 items-center justify-center rounded-[34px] bg-[#FBF9F7]'
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='none' rx='34' ry='34' stroke='%23C87437' stroke-width='3' stroke-dasharray='10%2C 8'/%3E%3C/svg%3E")`,
                }}
              >
                <Image
                  width={120}
                  height={120}
                  src='/smart-waiter-onboarding.svg'
                  alt=''
                  className='size-[30%]'
                />
              </div>

              <div className='text-center'>
                <h2
                  className={`${playfair.className} text-[clamp(1.125rem,2.8dvh,1.375rem)] font-semibold text-[#1C1409]`}
                >
                  Запустите сканирование
                </h2>
                <p className='mx-auto mt-[clamp(0.375rem,1.5dvh,0.75rem)] text-sm text-[#7A6A52]'>
                  Наведите камеру на QR-код или меню на
                  <br />
                  вашем столике, чтобы пригласить
                  <br />
                  AI-официанта
                </p>
              </div>
            </div>

            <Button
              onClick={() => setIsScanning(true)}
              className='mt-[clamp(0.75rem,3dvh,1.5rem)] h-[clamp(2.75rem,7dvh,3.5rem)] shrink-0 rounded-2xl bg-[#C87437] text-base font-semibold hover:bg-[#B96530]'
            >
              <Camera className='mr-2 h-5 w-5' />
              Сканировать
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

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className='fixed inset-x-0 bottom-0 mt-24 max-h-[85vh] rounded-t-3xl'>
          <DrawerHeader>
            <DrawerTitle>Select a restaurant</DrawerTitle>
          </DrawerHeader>

          <div className='overflow-y-auto'>
            {sessionStatus?.candidates?.map((c) => (
              <button
                key={c.place_id}
                // onClick={() => handleSelect({ id: c.place_id, name: c.name })}
                className='flex w-full items-start gap-3 border-b border-[#1C140908] px-6 py-4 text-left'
              >
                <div>
                  <h3 className='text-sm font-medium'>{c.name}</h3>
                  <p className='text-xs text-gray-400'>{c.address}</p>
                </div>
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
