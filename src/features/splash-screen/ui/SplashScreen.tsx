'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

import { Progress } from '@/components/ui/progress'
import { useSession } from '../hooks/useSession'
import type { SessionResponse } from '../types/session.type'
import { useAppStore } from '@/store/use-app-store'
import { useDeviceType } from '@/shared/hooks/useDeviceType'

const SPLASH_DURATION = 2500

function resolveNextRoute(session: SessionResponse): string {
  // new user: onboarding leads on to the name step
  if (!session.has_name) return '/onboarding'
  if (session.has_visit_history || session.recent_visits?.length > 0) {
    return '/visits'
  }

  // known user without visits: straight to the greeting
  return '/scan'
}

export function SplashScreen() {
  const router = useRouter()

  const [progress, setProgress] = useState(0)
  const [minDurationDone, setMinDurationDone] = useState(false)

  const platform = useDeviceType()
  const [deviceId] = useState(() => uuidv4())

  const { mutate: setSession, data, isError } = useSession()
  const { me } = useAppStore()

  const initialized = useRef(false)

  // Splash timer
  useEffect(() => {
    const interval = 25
    const step = 100 / (SPLASH_DURATION / interval)

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + step, 100)

        if (next >= 100) {
          clearInterval(timer)
          setMinDurationDone(true)
        }

        return next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [])

  // Create session only when there is no token
  useEffect(() => {
    if (initialized.current) return

    // Zustand hasn't hydrated yet
    if (me === undefined) return

    const timer = setTimeout(() => {
      if (initialized.current) return
      initialized.current = true

      setSession({
        device_id: me?.device_id ? me.device_id : deviceId,
        platform,
      })
    }, 300) // small buffer to let hydration settle

    return () => clearTimeout(timer)
  }, [me, platform, deviceId, setSession])

  // Decide where to go after splash
  useEffect(() => {
    if (!minDurationDone) return

    // route on the fresh bootstrap response; the persisted session is only
    // a fallback when the request fails
    const session = data ?? (isError && me?.token ? me : null)
    if (!session) return

    router.replace(resolveNextRoute(session))
  }, [minDurationDone, router, me, data, isError])

  return (
    <div className='relative flex h-full w-full flex-col items-center justify-center bg-[#1D140F] px-8 md:h-[860px] md:max-w-[430px] md:rounded-[36px] md:shadow-xl'>
      <div className='space-y-6 text-center'>
        <h1 className='font-serif text-5xl text-white'>Hi Bro</h1>

        <p className='text-sm text-[#D6CFC8]'>Ваш персональный гид по меню</p>

        <Progress value={progress} className='h-1 bg-[#C8713A]' />
      </div>
    </div>
  )
}
