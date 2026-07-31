import { Card } from '@/components/ui/card'
import { ShoppingBag } from 'lucide-react'

export default function EmptyCart() {
  return (
    <Card className='flex h-[80%] flex-col items-center justify-center bg-transparent border-0 shadow-none ring-0'>
      <div className='mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-[#F3EEE7]'>
        <ShoppingBag className='h-11 w-11 text-[#D9B998]' strokeWidth={1.6} />
      </div>

      <h2 className='font-serif text-2xl font-semibold text-[#2E211B]'>
        Заказ пуст
      </h2>

      <p className='text-base text-[#7A6A52]'>Добавьте блюда из меню</p>
    </Card>
  )
}
