'use client'

import { useEffect, useRef } from 'react'
import { Check, MessageCircle, Receipt } from 'lucide-react'
import { useRestaurants } from '../hooks/useRestaurants'
import { Restaurant } from '../types/restaurants.type'
import RestaurantsLoading from './RestaurantsLoading'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/use-app-store'
import { useSelectRestaurant } from '../hooks/useSelectRestaurant'
import { useCurrentPhotoSession } from '@/features/scan/hooks/useCurrentPhotoSession'
import { useCreatePhotoSession } from '@/features/scan/hooks/useCreatePhotoSession'
import { useScanQr } from '@/features/scan/hooks/useScanQr'

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
 const sessionId = useAppStore((state) => state.sessionId)
 const loadMoreRef = useRef<HTMLDivElement>(null)
 const { data: session } = useCurrentPhotoSession()
 const { data: photoSession } = useCreatePhotoSession()
 const { data: qrSession } = useScanQr()
 const { mutate: selectRestaurant } = useSelectRestaurant(sessionId)

 console.log(photoSession?.session_id, qrSession?.session_id)

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

 const handleSelect = (visit: Restaurant) => {
  router.push(`/chat`)
  selectRestaurant(
   {
    place_id: 'ChIJ44WzFVK7akARtv9FFxd2NzE',
    restaurant_name: 'Тбилисури',
    name: 'FOM Yerevan',
    address: '21/1 Ձորագյուղ, Երևան 0015, Armenia',
    latitude: 40.1786142,
    longitude: 44.5000386,
   },
   {
    onSuccess: (data) => {
     setVisit(data.visit_id, 'Тбилисури')
    },
    onError: () => {
     // show a dialog/toast — selection failed, user stays on this screen
    },
   },
  )
  setVisit(visit.id, visit.restaurant_name)
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
   <div className='flex items-start gap-2 text-sm text-gray-500'>
    <Icon className='mt-0.5 h-4 w-4 flex-shrink-0' />
    <span className='line-clamp-2'>{visit.preview_text}</span>
   </div>
  )
 }

 if (isPending) {
  return <RestaurantsLoading />
 }

 if (error) {
  return (
   <div className='flex flex-col items-center gap-3 p-8 text-center'>
    <p className='text-sm text-gray-500'>
     {error instanceof Error ? error.message : 'Не удалось загрузить визиты'}
    </p>
   </div>
  )
 }

 if (visits.length === 0) {
  return (
   <div className='flex flex-col items-center gap-2 p-8 text-center'>
    <p className='text-sm text-gray-500'>Пока нет визитов</p>
   </div>
  )
 }

 return (
  <div className='flex h-full min-h-0 flex-col gap-4 p-4'>
   {/* Header */}
   <p className='shrink-0 text-xs text-gray-400'>{total} визитов</p>

   {/* Scrollable visits area */}
   <div
    className='
      min-h-0
      flex-1
      overflow-y-auto
      [scrollbar-width:none]
      [&::-webkit-scrollbar]:hidden
    '
   >
    <div className='flex flex-col gap-3'>
     {visits.map((visit) => (
      <button
       key={visit.id}
       onClick={() => handleSelect(visit)}
       className='
            flex
            flex-col
            gap-2
            rounded-xl
            border
            border-gray-100
            bg-white
            p-4
            text-left
            shadow-sm
            transition-colors
            active:bg-gray-50
          '
      >
       <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
         <h3 className='truncate font-medium text-gray-900'>
          {visit.restaurant_name}
         </h3>

         <p className='text-xs text-gray-400'>
          {formatDate(visit.visit_date)}
          {visit.table_number != null && ` · Стол ${visit.table_number}`}
         </p>
        </div>

        <span className='shrink-0 whitespace-nowrap text-sm font-semibold text-gray-900'>
         {formatAmount(visit.total_amount)} ₽
        </span>
       </div>

       {renderPreview(visit)}
      </button>
     ))}

     {/* Infinite scroll sentinel */}
     <div
      ref={loadMoreRef}
      className='flex min-h-10 items-center justify-center py-4'
     >
      {isFetchingNextPage && (
       <div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900' />
      )}
     </div>
    </div>
   </div>
  </div>
 )
}
