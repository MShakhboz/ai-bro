'use client'

import Image from 'next/image'
import { MapPin } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { Restaurant } from './types'

interface RestaurantCardProps {
 restaurant: Restaurant
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
 return (
  <Card className='mx-4 mt-4 overflow-hidden rounded-3xl border-0 shadow-md'>
   <div className='relative aspect-[16/9] w-full'>
    <Image
     src={restaurant.image}
     alt={restaurant.name}
     fill
     priority
     className='object-cover'
    />
   </div>

   <CardContent className='space-y-4 p-4'>
    <div>
     <h2 className='text-xl font-semibold'>{restaurant.name}</h2>

     <div className='mt-1 flex items-center gap-1 text-muted-foreground'>
      <MapPin className='size-4' />
      <span className='text-sm'>{restaurant.cuisine}</span>
     </div>
    </div>

    <Badge
     variant='secondary'
     className='flex w-full justify-center rounded-full py-2 text-sm'
    >
     Стол {restaurant.table}
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
