import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import Image from 'next/image'

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

export default function CartList() {
  const subtotal = 2360
  const total = 2596

  return (
    <div className='flex h-full flex-col'>
      <div className='flex-1 overflow-y-auto'>
        {items.map((item, index) => (
          <div className='flex items-center gap-2 px-3 py-3.5 border-b border-b-white'>
            <Image
              src={item.image}
              alt={item.name}
              width={48}
              height={48}
              className='h-12 w-12 rounded-lg object-cover'
            />

            <div className='flex-1'>
              <h3 className='text-sm font-semibold'>{item.name}</h3>
              <p className='mt-1 text-xs text-[#C8713A]'>
                {item.price.toLocaleString('ru-RU')} ₽
              </p>
            </div>

            <div className='flex items-center gap-3'>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-full'
              >
                <Minus className='h-6 w-6 text-[#7A6A52]' />
              </Button>

              <span className='w-4 text-center text-lg text-[#7A6A52]'>
                {item.quantity}
              </span>

              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-full'
              >
                <Plus className='h-6 w-6 text-[#7A6A52]' />
              </Button>
            </div>
          </div>
        ))}

        <div className='space-y-4 px-3 py-3'>
          <div className='flex items-center justify-between text-sm text-[#5A5048]'>
            <span>3 блюда</span>
            <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
          </div>

          <div className='flex items-center justify-between'>
            <span className='text-lg font-bold'>Итого</span>
            <span className='text-lg font-bold'>
              {total.toLocaleString('ru-RU')} ₽
            </span>
          </div>

          <div className='flex items-center text-sm justify-between pt-3'>
            <span className='text-sm font-medium'>Перевести для официанта</span>
            <Switch />
          </div>
        </div>
      </div>

      <div className='sticky px-3 py-4'>
        <Button className='h-14 w-full rounded-2xl bg-[#C8713A] text-base font-semibold text-white shadow-md hover:bg-[#AD6A3B]'>
          Показать официанту
        </Button>
      </div>
    </div>
  )
}
