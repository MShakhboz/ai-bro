import axios from 'axios'
import { useAppStore } from '@/store/use-app-store'

export const api = axios.create({
 baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

// Request Interceptor
api.interceptors.request.use(
 (config) => {
  // Only access token storage in browser/client environment
  if (typeof window !== 'undefined') {
   const token = useAppStore.getState().me?.token
   const deviceId = useAppStore.getState().me?.device_id
   if (token) {
    config.headers.Authorization = `Bearer ${token}`
   }
   if (deviceId) {
    config.headers['X-Device-Id'] = deviceId
   }
  }
  return config
 },
 (error) => Promise.reject(error),
)

// Response Interceptor
api.interceptors.response.use(
 (response) => response,
 (error) => {
  if (typeof window !== 'undefined' && error.response?.status === 401) {
   useAppStore.getState().reset()
   window.location.href = '/'
  }

  return Promise.reject(error)
 },
)
