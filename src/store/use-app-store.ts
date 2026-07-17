'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
 name: string
 qr: string | null

 setName: (name: string) => void
 setQr: (qr: string) => void

 reset: () => void
}

export const useAppStore = create<AppState>()(
 persist(
  (set) => ({
   name: '',
   qr: null,

   setName: (name) => set({ name }),

   setQr: (qr) => set({ qr }),

   reset: () =>
    set({
     name: '',
     qr: null,
    }),
  }),
  {
   name: 'ai-bro',
  },
 ),
)
