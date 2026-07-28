import { useMutation, useQueryClient } from '@tanstack/react-query'
import { splashApi } from '../api/splash.api'
import { sessionKeys } from '../api/splash.keys'
import { useAppStore } from '@/store/use-app-store'

export function useSession() {
 const queryClient = useQueryClient()
 const { setMe } = useAppStore()

 return useMutation({
  mutationFn: splashApi.create,
  onSuccess: async (me, variables) => {
   setMe({ ...me, device_id: variables?.device_id })
  },
  mutationKey: sessionKeys.all,
 })
}
