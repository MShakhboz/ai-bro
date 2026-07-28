'use client'

import { RespondNameType } from '@/features/name/types/name.type'
import {
 SessionPayload,
 SessionResponse,
} from '@/features/splash-screen/types/session.type'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type PendingScan =
 | {
    type: 'qr'
    value: string
   }
 | {
    type: 'image'
    preview: string
   }

interface MeType extends SessionResponse {
 device_id: SessionPayload['device_id']
}
interface AppState {
 name: RespondNameType['user'] | null
 visitId: number | null
 restaurant: {}
 pendingScan: PendingScan | null
 me: MeType | null
 sessionId: string | null

 setName: (name: RespondNameType['user'] | null) => void
 setVisit: (visitId: number, restaurant: string) => void
 setPendingScan: (scan: PendingScan | null) => void
 setSession: (sessionId: string | null) => void
 reset: () => void
 setMe: (me: MeType) => void
}

export const useAppStore = create<AppState>()(
 persist(
  (set) => ({
   name: null,
   visitId: null,
   restaurant: '',
   pendingScan: null,
   sessionId: null,
   me: null,

   setName: (user) => set({ name: user }),
   setSession: (sessionId) => set({ sessionId }),
   setVisit: (visitId, restaurant) => set({ visitId, restaurant }),
   setPendingScan: (scan) => set({ pendingScan: scan }),
   setMe: (me: MeType) => set({ me }),

   reset: () =>
    set({
     name: null,
     visitId: null,
     restaurant: '',
     pendingScan: null,
     me: null,
    }),
  }),
  {
   name: 'ai-bro',
   storage: createJSONStorage(() => localStorage),
   partialize: (state) => ({
    sessionId: state.sessionId,
    me: state.me,
    name: state.name,
   }),
  },
 ),
)
