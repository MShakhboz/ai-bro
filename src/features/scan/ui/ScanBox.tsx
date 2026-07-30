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
  } = useSessionStatus(sessionId, startPolling)

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
  }

  const handleQrSuccess = async (value: string) => {
    try {
      await scanQr(value)
      //  setPendingScan({ type: 'qr', value })
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
      setStartPolling(true)
      setIsScanning(false)
      // router.push(`/restaurants`)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Не удалось обработать фото меню. Попробуйте снова.'
      showDialog('Ошибка загрузки', message)
    }
  }

  useEffect(() => {
    if (isSessionStatusError || sessionStatus?.status === 'failed') {
      setDialogOpen(isSessionStatusError)
      setDialog({
        title: 'Ошибка',
        description:
          sessionStatus?.status === 'failed'
            ? 'Попробуйет еше раз'
            : (error?.message ?? ''),
      })
    }
  }, [isSessionStatusError, sessionStatus?.status])

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
              disabled={false}
              className='mt-auto h-14 rounded-full bg-[#C87437] text-base hover:bg-[#B96530]'
            >
              <Camera className='mr-2 h-5 w-5' />
              {false ? 'Обработка...' : 'Открыть камеру'}
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
