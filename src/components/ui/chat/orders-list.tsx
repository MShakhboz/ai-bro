import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

const items = [
  {
    id: 1,
    name: 'Карбонара',
    price: 890,
    quantity: 1,
    image:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&q=80',
  },
  {
    id: 2,
    name: 'Спагетти Алио Олио',
    price: 890,
    quantity: 1,
    image:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&q=80',
  },
  {
    id: 3,
    name: 'Тальятелле с трюфелем',
    price: 890,
    quantity: 1,
    image:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&q=80',
  },
]

export default function CartPage() {
  const subtotal = 2360
  const total = 2596

  return (
    <div className='flex h-screen flex-col bg-[#F8F4EE]'>
      <div className='flex-1 overflow-y-auto'>
        {items.map((item, index) => (
          <div key={item.id}>
            <div className='flex items-center gap-4 px-5 py-6'>
              <img
                src={item.image}
                alt={item.name}
                className='h-24 w-24 rounded-xl object-cover'
              />

              <div className='flex-1'>
                <h3 className='text-3xl font-semibold'>{item.name}</h3>
                <p className='mt-2 text-xl text-[#D06F34]'>
                  {item.price.toLocaleString('ru-RU')} ₽
                </p>
              </div>

              <div className='flex items-center gap-6'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-11 w-11 rounded-full'
                >
                  <Minus className='h-7 w-7 text-[#8A7865]' />
                </Button>

                <span className='w-6 text-center text-3xl text-[#8A7865]'>
                  {item.quantity}
                </span>

                <Button
                  variant='ghost'
                  size='icon'
                  className='h-11 w-11 rounded-full'
                >
                  <Plus className='h-7 w-7 text-[#8A7865]' />
                </Button>
              </div>
            </div>

            {index !== items.length - 1 && <Separator />}
          </div>
        ))}

        <Separator />

        <div className='space-y-8 px-5 py-6'>
          <div className='flex items-center justify-between text-[34px] text-[#5F544B]'>
            <span>3 блюда</span>
            <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
          </div>

          <div className='flex items-center justify-between'>
            <span className='text-5xl font-bold'>Итого</span>

            <span className='text-5xl font-bold'>
              {total.toLocaleString('ru-RU')} ₽
            </span>
          </div>

          <div className='flex items-center justify-between pt-6'>
            <span className='text-[36px]'>Перевести для официанта</span>

            <Switch />
          </div>
        </div>
      </div>

      <div className='sticky bottom-0 border-t bg-[#F8F4EE] p-5'>
        <Button className='h-20 w-full rounded-[30px] bg-[#C97336] text-3xl font-semibold hover:bg-[#B7652E]'>
          Показать официанту
        </Button>
      </div>
    </div>
  )
}
