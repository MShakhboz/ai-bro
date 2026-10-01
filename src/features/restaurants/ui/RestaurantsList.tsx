'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, MessageCircle, Receipt } from 'lucide-react'
import { useRestaurants } from '../hooks/useRestaurants'
import { Restaurant } from '../types/restaurants.type'
import RestaurantsLoading from './RestaurantsLoading'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/use-app-store'
import { useSelectRestaurant } from '../hooks/useSelectRestaurant'
import { useSessionStatus } from '@/features/scan/hooks/useSessionStatus'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import CameraScanner from '@/components/ui/camera-scanner'
import { useScanSession } from '@/features/scan/hooks/useScanSession'
import { useGeolocation } from '@/shared/hooks/useGeolocation'

export default function RestaurantsList() {
  const {
    data,
    error,
    isPending,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useRestaurants()
  const router = useRouter()
  const setVisit = useAppStore((state) => state.setVisit)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const { sessionId, imgOrder } = useAppStore()
  const name = useAppStore((state) => state.name)
  const me = useAppStore((state) => state.me)
  const userName = me?.user.name ?? name?.name

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

  useEffect(() => {
    const el = loadMoreRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const visits = data?.pages.flatMap((p) => p.data) ?? []
  const total = data?.pages[0]?.meta.total ?? 0

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  const {
    data: sessionStatus,
    isPending: isSessionStatusPending,
    isError: isSessionStatusError,
  } = useSessionStatus(sessionId)

  const { location } = useGeolocation()

  const {
    submitPhotos: submitPhotoScan,
    scanQr,
    finish,
    reset,
  } = useScanSession({
    latitude: location?.latitude ?? NaN,
    longitude: location?.longitude ?? NaN,
  })

  const handleSelect = async ({
    id,
    name,
  }: {
    id: string | number
    name: string
  }) => {
    // selectRestaurant({ place_id: String(id), name })
    router.push(
      `/restaurants/${id}?restaurant_name=${encodeURIComponent(name)}`,
    )
  }

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
      setIsScanning(false)
    } catch {
      showDialog(
        'Ошибка сканирования',
        'Не удалось распознать QR-код. Попробуйте снова.',
      )
    }
  }

  const handlePhotosSuccess = async (photos: File[]) => {
    try {
      await submitPhotoScan(photos)
      setIsScanning(false)
      //  setPendingScan({ type: 'image', preview: dataUrl })
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Не удалось обработать фото меню. Попробуйте снова.'
      showDialog('Ошибка загрузки', message)
    }
  }

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat('ru-RU').format(amount)

  const renderPreview = (visit: Restaurant) => {
    const Icon =
      visit.preview_type === 'chat_message'
        ? MessageCircle
        : visit.preview_type === 'receipt'
          ? Receipt
          : Check

    return (
      <div className='flex items-center gap-1.5 text-xs text-[#B96A45]'>
        {visit.preview_type === 'chat_message' && (
          <span className='font-medium'>AI:</span>
        )}
        <span className='line-clamp-1'>{visit.preview_text}</span>
      </div>
    )
  }

  // if (
  //   isSessionStatusPending ||
  //   ['pending', 'processing'].includes(sessionStatus?.status ?? '')
  // ) {
  //   return <RestaurantsLoading />
  // }

  if (error) {
    return (
      <div className='flex flex-col items-center gap-3 p-8 text-center'>
        <p className='text-sm text-gray-500'>
          {error instanceof Error
            ? error.message
            : 'Не удалось загрузить визиты'}
        </p>
      </div>
    )
  }

  return (
    <div className='flex h-full min-h-0 flex-col bg-[#F5F1EA]'>
      {/* Header */}
      {isScanning ? (
        <CameraScanner
          onQrSuccess={handleQrSuccess}
          onPhotosSuccess={handlePhotosSuccess}
          onError={(error) => showDialog('Ошибка камеры', error)}
          onClose={() => setIsScanning(false)}
        />
      ) : (
        <>
          {/* Greeting */}
          <div className='shrink-0 px-6 pt-6 text-center'>
            <p className='text-base italic text-gray-400'>Добрый вечер,</p>
            <h1 className='font-serif text-2xl font-bold text-gray-900'>
              {userName}
            </h1>
          </div>

          {/* Middle section */}
          <div className='relative flex min-h-0 flex-1 flex-col justify-end'>
            <div className='pointer-events-none inset-0 flex flex-1 items-center justify-center py-4'>
              <span className='select-none font-serif text-5xl text-gray-900/5'>
                HI Bro
              </span>
            </div>

            <div className='relative flex min-h-0 flex-col '>
              {sessionStatus?.candidates &&
                sessionStatus?.candidates.map((c, i) => (
                  <button
                    key={c.place_id}
                    onClick={() =>
                      handleSelect({ id: c.place_id, name: c.name })
                    }
                    className='flex items-start justify-between gap-3 py-3 px-6 text-left border-b border-b-[#1C140908]'
                  >
                    <div className='flex min-w-0 items-start gap-3'>
                      <div>
                        <h3 className='truncate text-sm font-medium text-gray-900'>
                          {c.name}
                        </h3>
                        <p className='text-xs text-gray-400'>{c.address}</p>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
          <div className='shrink-0 px-6 pb-8 pt-4'>
            <Button
              onClick={() => setIsScanning(true)}
              disabled={false}
              className='mt-auto flex h-14 w-full cursor-pointer flex-col items-center justify-center rounded-[16px] bg-[#C8713A] text-base hover:bg-[#B96530]'
            >
              <p className='font-semibold text-white/80'>Сканировать</p>
              <p className='text-xs text-white/80'>
                Наведите камеру на QR-код или меню
              </p>
            </Button>
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
      )}
    </div>
  )
}
