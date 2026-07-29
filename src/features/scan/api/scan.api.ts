// src/features/scan/api/scan.api.ts
import { api } from '@/shared/lib/axios'
import type {
 QRScanPayload,
 QRScanResponse,
 CreatePhotoSessionResponse,
 UploadPhotoResponse,
 SessionStatusResponse,
 SelectRestaurantPayload,
 CreatePhotoSession,
} from '../types/scan.type'

export const scanApi = {
 scanQr: async (payload: QRScanPayload) => {
  const { data } = await api.post<QRScanResponse>('/scan/qr', payload)
  return data
 },

 createPhotoSession: async (payload: CreatePhotoSession) => {
  const { data } = await api.post<CreatePhotoSessionResponse>(
   '/scan/photo/sessions',
   payload,
  )
  return data
 },

 uploadPhoto: async ({
  sessionId,
  file,
  order = 1,
 }: {
  sessionId: string
  file: File
  order?: number
 }) => {
  const formData = new FormData()

  formData.append('file', file)
  formData.append('order', String(order))

  const { data } = await api.post<UploadPhotoResponse>(
   `/scan/photo/sessions/${sessionId}/photos`,
   formData,
  )

  return data
 },

 deletePhoto: async (sessionId: string, photoId: string) => {
  await api.delete(`/scan/photo/sessions/${sessionId}/photos/${photoId}`)
 },

 completeSession: async (sessionId: string) => {
  const { data } = await api.post(`/scan/photo/sessions/${sessionId}/complete`)
  return data
 },

 getSessionStatus: async (sessionId: string) => {
  const { data } = await api.get<SessionStatusResponse>(
   `/scan/photo/sessions/${sessionId}/status`,
  )
  return data
 },

 selectRestaurant: async (
  sessionId: string,
  payload: SelectRestaurantPayload,
 ) => {
  const { data } = await api.post(
   `/scan/photo/sessions/${sessionId}/select-restaurant`,
   payload,
  )
  return data
 },
}
