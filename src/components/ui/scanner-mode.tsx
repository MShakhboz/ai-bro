'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ScannerModeProps {
 value: 'qr' | 'menu'
 onChange: (value: 'qr' | 'menu') => void
}

export default function ScannerMode({ value, onChange }: ScannerModeProps) {
 return (
  <Tabs
   value={value}
   onValueChange={(v) => onChange(v as 'qr' | 'menu')}
   className='items-center'
  >
   <TabsList className='h-14 rounded-full bg-black/55 p-1 backdrop-blur-xl'>
    <TabsTrigger
     value='qr'
     className='rounded-full px-8 data-[state=active]:bg-white'
    >
     QR-код
    </TabsTrigger>

    <TabsTrigger
     value='menu'
     className='rounded-full px-8 data-[state=active]:bg-white'
    >
     Фото меню
    </TabsTrigger>
   </TabsList>
  </Tabs>
 )
}
