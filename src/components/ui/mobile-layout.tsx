// src/components/mobile-layout.tsx

import { ReactNode } from 'react'

interface MobileLayoutProps {
 children: ReactNode
 className?: string
}

export default function MobileLayout({
 children,
 className = '',
}: MobileLayoutProps) {
 return (
  <main className='flex min-h-dvh items-center justify-center bg-[#F6F3EE]'>
   <div
    className={`relative h-dvh w-full bg-white md:h-215 md:max-w-107.5 md:rounded-[36px] md:shadow-xl ${className}`}
   >
    {children}
   </div>
  </main>
 )
}
