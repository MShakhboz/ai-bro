'use client'

import { EllipsisVertical, ChevronLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ChatHeaderProps {
 value: string
 onValueChange(value: string): void
 onBack?(): void
 onMore?(): void
}

export default function ChatHeader({
 value,
 onValueChange,
 onBack,
 onMore,
}: ChatHeaderProps) {
 return (
  <header className='sticky top-0 z-40 border-b'>
   <div className='flex items-center gap-2 p-4'>
    <Button size='icon' variant='ghost' onClick={onBack}>
     <ChevronLeft className='size-5' />
    </Button>

    <Tabs value={value} onValueChange={onValueChange} className='flex-1'>
     <TabsList className='grid w-full grid-cols-3 bg-[#F2EDE4]'>
      <TabsTrigger value='assistant'>AI Bro</TabsTrigger>

      <TabsTrigger value='menu'>Меню</TabsTrigger>

      <TabsTrigger value='order'>Заказ</TabsTrigger>
     </TabsList>
    </Tabs>

    <Button size='icon' variant='ghost' onClick={onMore}>
     <EllipsisVertical className='size-5' />
    </Button>
   </div>
  </header>
 )
}
