'use client'

import Image from 'next/image'
import { MapPin } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { Restaurant } from './types'

interface RestaurantCardProps {
  restaurant?: Restaurant
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card className='mx-4 mt-4 overflow-hidden p-3 rounded-3xl border-0 shadow-md max-w-[85%] min-h-46.5'>
      <div className='relative w-full h-25 rounded-[10px]'>
        <Image
          src='/res-img.png'
          alt={restaurant?.name ?? ''}
          fill
          priority
          className='object-cover rounded-[10px]'
        />
      </div>

      <CardContent className='space-y-2 p-0'>
        <div className='flex gap-2'>
          <h2 className='text-base font-semibold'>{restaurant?.name}</h2>
          {restaurant?.cuisine && (
            <>
              <span>•</span>
              <h2 className='text-base font-semibold uppercase'>
                {restaurant?.cuisine}
              </h2>
            </>
          )}
        </div>

        <Badge
          variant='secondary'
          className='flex w-full justify-center rounded-full p-3 text-sm bg-[#E5E0D5]'
        >
          Стол {restaurant?.table ?? '-'}
        </Badge>
      </CardContent>
    </Card>
  )
}

// ;<RestaurantCard
//  restaurant={{
//   id: '1',
//   name: 'Semplice',
//   cuisine: 'Итальянский',
//   table: '7',
//   image: '/restaurant.jpg',
//  }}
// />
