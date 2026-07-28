import { api } from '@/shared/lib/axios'
import { NameType, RespondNameType } from '../types/name.type'

export const nameApi = {
 create: async (payload: NameType) => {
  const { data } = await api.patch<RespondNameType>('/users/me', payload)
  return data
 },
}
