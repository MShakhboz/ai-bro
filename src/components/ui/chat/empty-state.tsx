'use client'

import { MessageCircle } from 'lucide-react'

export default function EmptyState() {
 return (
  <div className='flex flex-1 flex-col items-center justify-center px-8 text-center'>
   <div className='mb-4 rounded-full bg-muted p-4'>
    <MessageCircle className='size-8 text-muted-foreground' />
   </div>

   <h3 className='text-lg font-semibold'>Начните разговор</h3>

   <p className='mt-2 max-w-xs text-sm text-muted-foreground'>
    Задайте вопрос о меню, попросите рекомендацию или оформите заказ.
   </p>
  </div>
 )
}
