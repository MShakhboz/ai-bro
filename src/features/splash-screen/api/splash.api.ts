import { api } from '@/shared/lib/axios'
import { SessionPayload, SessionResponse } from '../types/session.type'

export const splashApi = {
 create: async (payload: SessionPayload) => {
  const { data } = await api.post<SessionResponse>(
   '/session/bootstrap',
   payload,
  )
  return data
 },
}
