'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, Check, MessageCircle, Receipt } from 'lucide-react'
import { useRestaurants } from '../hooks/useRestaurants'
import { Restaurant } from '../types/restaurants.type'
import RestaurantsLoading from './RestaurantsLoading'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/use-app-store'
import { useSelectRestaurant } from '../hooks/useSelectRestaurant'
import { useCreatePhotoSession } from '@/features/scan/hooks/useCreatePhotoSession'
import { useScanQr } from '@/features/scan/hooks/useScanQr'
import { Button } from '@base-ui/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useGeolocation } from '@/shared/hooks/useGeolocation'
import { useScanSession } from '@/features/scan/hooks/useScanSession'
import CameraScanner from '@/components/ui/camera-scanner'
import { useSessionStatus } from '@/features/scan/hooks/useSessionStatus'

interface VisitsListProps {
  userName: string
}

export default function VisitsList() {
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
  const { sessionId } = useAppStore()
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

  const { location } = useGeolocation()

  const {
    addPhoto: submitPhotoScan,
    scanQr,
    finish,
    reset,
  } = useScanSession({
    latitude: location?.latitude ?? NaN,
    longitude: location?.longitude ?? NaN,
  })

  const loadMoreRef = useRef<HTMLDivElement>(null)
  const { mutate: selectRestaurant } = useSelectRestaurant(sessionId)

  const {
    data: sessionStatus,
    isPending: isSessionStatusPending,
    isError: isSessionStatusError,
    isFetching,
  } = useSessionStatus(sessionId)

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
  const hasVisits = !isPending && !error && visits.length > 0

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  const handleSelect = async ({
    id,
    name,
  }: {
    id: string | number
    name: string
  }) => {
    selectRestaurant({ place_id: String(id), name })
    router.push(`/visits/${id}?restaurant_name=${encodeURIComponent(name)}`)
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

  const handlePhotoSuccess = async (photo: File, dataUrl: string) => {
    try {
      await submitPhotoScan(photo)
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

  const pluralizeRestaurants = (n: number) => {
    const mod10 = n % 10
    const mod100 = n % 100
    if (mod10 === 1 && mod100 !== 11) return 'ресторан'
    if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100))
      return 'ресторана'
    return 'ресторанов'
  }

  const renderPreview = (visit: Restaurant) => {
    const Icon =
      visit.preview_type === 'chat_message'
        ? MessageCircle
        : visit.preview_type === 'receipt'
          ? Receipt
          : Check

    return (
      <p className='line-clamp-1 text-sm text-gray-500'>
        {visit.preview_type === 'chat_message' ? (
          <span className='text-[#B96A45]'>AI: {visit.preview_text}</span>
        ) : (
          visit.preview_text
        )}
      </p>
    )
  }

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
      {isScanning ? (
        <CameraScanner
          onQrSuccess={handleQrSuccess}
          onPhotoSuccess={handlePhotoSuccess}
          onError={(error) => showDialog('Ошибка камеры', error)}
          onClose={() => setIsScanning(false)}
        />
      ) : (
        <>
          {/* Greeting */}
          <div className='shrink-0 px-6 pt-6 text-center'>
            <p className='text-base italic text-gray-400'>Добрый вечер,</p>
            <h1 className='font-serif text-2xl font-bold text-gray-900'>
              {userName}!
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
                    className='cursor-pointer flex items-start justify-between gap-3 py-3 px-6 text-left border-b border-b-[#1C140908]'
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

            {hasVisits && (
              <div className='relative flex min-h-0 flex-col'>
                {/* Header */}
                <div className='flex shrink-0 items-baseline justify-between px-6 pb-3'>
                  <p className='text-sm text-gray-900'>Ваши места</p>
                  <p className='text-xs text-gray-400'>
                    {total} {pluralizeRestaurants(total)}
                  </p>
                </div>

                {/* Scrollable visits area */}
                <div className='min-h-0 overflow-y-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden '>
                  <div className='flex flex-col gap-5 pb-2'>
                    {visits.map((visit, i) => (
                      <button
                        key={visit.id}
                        onClick={() =>
                          handleSelect({
                            id: visit.id,
                            name: visit.restaurant_name,
                          })
                        }
                        className='flex items-start justify-between gap-3 text-left'
                      >
                        <div className='flex min-w-0 items-start gap-3'>
                          {i === 0 ? (
                            <span className='mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#C1633E]' />
                          ) : (
                            <span className='mt-0.5 w-2 shrink-0 text-center text-xs text-gray-300'>
                              {i + 1}
                            </span>
                          )}

                          <div className='min-w-0'>
                            <h3 className='truncate text-sm font-semibold text-gray-900'>
                              {visit.restaurant_name}
                              {visit.table_number != null && (
                                <span className='font-normal text-gray-400'>
                                  {' '}
                                  · Стол {visit.table_number}
                                </span>
                              )}
                            </h3>

                            {renderPreview(visit)}
                          </div>
                        </div>

                        <div className='shrink-0 whitespace-nowrap text-right'>
                          <p className='text-xs text-gray-400'>
                            {formatDate(visit.visit_date)}
                          </p>
                          <p className='text-sm text-gray-900'>
                            {formatAmount(visit.total_amount)} ₽
                          </p>
                        </div>
                      </button>
                    ))}

                    {/* Infinite scroll sentinel */}
                    <div
                      ref={loadMoreRef}
                      className='flex min-h-0 items-center justify-center'
                    >
                      {isFetchingNextPage && (
                        <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900' />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scan button */}
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
