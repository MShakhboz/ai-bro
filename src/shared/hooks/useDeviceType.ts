// src/shared/hooks/useDeviceType.ts
'use client'

import { useEffect, useState } from 'react'

type DeviceType = 'ios' | 'android' | 'web'

export function useDeviceType(): DeviceType {
 const [device, setDevice] = useState<DeviceType>('ios')

 useEffect(() => {
  const ua = navigator.userAgent

  if (/iPad|iPhone|iPod/.test(ua) && !('MSStream' in window)) {
   setDevice('ios')
  } else if (/Android/.test(ua)) {
   setDevice('android')
  } else {
   setDevice('ios')
  }
 }, [])

 return device
}
