'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

import { Progress } from '@/components/ui/progress'
import { useSession } from '../hooks/useSession'
import type { LoginResponse } from '@/types/AuthType'
import { useAppStore } from '@/store/use-app-store'
import { useDeviceType } from '@/shared/hooks/useDeviceType'

const SPLASH_DURATION = 2500

function resolveNextRoute(data: LoginResponse): string {
  if (!data.has_name) return '/name'
  if (!data.has_visit_history) return '/onboarding'

  return '/scan'
}

export function SplashScreen() {
  const router = useRouter()

  const [progress, setProgress] = useState(0)
  const [minDurationDone, setMinDurationDone] = useState(false)

  const platform = useDeviceType()
  const [deviceId] = useState(() => uuidv4())

  const { mutate: setSession, data, isSuccess, isError } = useSession()
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

    if (me?.token) {
      if (me?.recent_visits?.length > 0) {
        router.replace('/visits')
        return
      } else if (!me?.has_name) {
        router.replace('/name')
        return
      } else {
        router.replace('/onboarding')
        return
      }
    }
  }, [minDurationDone, router, me])

  return (
    <div className='relative flex h-full w-full flex-col items-center justify-center bg-[#1D140F] px-8 md:h-[860px] md:max-w-[430px] md:rounded-[36px] md:shadow-xl'>
      <div className='space-y-6 text-center'>
        <h1 className='font-serif text-5xl text-white'>AI Bro</h1>

        <p className='text-sm text-[#D6CFC8]'>Ваш персональный гид по меню</p>

        <Progress value={progress} className='h-1 bg-[#C8713A]' />
      </div>
    </div>
  )
}
