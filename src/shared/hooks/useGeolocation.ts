'use client'

import { useCallback, useState } from 'react'

interface LocationData {
 latitude: number
 longitude: number
 accuracy: number
}

export function useGeolocation() {
 const [location, setLocation] = useState<LocationData | null>(null)
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState<string | null>(null)

 const getLocation = useCallback(() => {
  if (!navigator.geolocation) {
   setError('Geolocation is not supported by this browser')
   return
  }

  setLoading(true)
  setError(null)

  navigator.geolocation.getCurrentPosition(
   ({ coords }) => {
    setLocation({
     latitude: coords.latitude,
     longitude: coords.longitude,
     accuracy: coords.accuracy,
    })

    setLoading(false)
   },
   (error) => {
    setLoading(false)

    switch (error.code) {
     case error.PERMISSION_DENIED:
      setError('Location permission denied')
      break

     case error.POSITION_UNAVAILABLE:
      setError('Location unavailable')
      break

     case error.TIMEOUT:
      setError('Location request timed out')
      break

     default:
      setError('Unable to get location')
    }
   },
   {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
   },
  )
 }, [])

 return {
  location,
  loading,
  error,
  getLocation,
 }
}
