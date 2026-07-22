'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PendingScan =
 | {
    type: 'qr'
    value: string
   }
 | {
    type: 'image'
    preview: string
   }

interface AppState {
 name: string
 pendingScan: PendingScan | null

 setName: (name: string) => void
 setPendingScan: (scan: PendingScan | null) => void

 reset: () => void
}

export const useAppStore = create<AppState>()(
 persist(
  (set) => ({
   name: '',
   pendingScan: null,

   setName: (name) => set({ name }),

   setPendingScan: (scan) =>
    set({
     pendingScan: scan,
    }),

   reset: () =>
    set({
     name: '',
     pendingScan: null,
    }),
  }),
  {
   name: 'ai-bro',
   partialize: (state) => ({
    name: state.name,
   }),
  },
 ),
)
