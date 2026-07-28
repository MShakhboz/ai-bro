import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { nameApi } from '../api/name.api'
import { useAppStore } from '@/store/use-app-store'
import { sessionKeys } from '@/features/splash-screen/api/splash.keys'

export function useName() {
 const queryClient = useQueryClient()
 const router = useRouter()
 const { setName } = useAppStore()

 return useMutation({
  mutationFn: nameApi.create,
  onSuccess: async (data) => {
   setName(data.user)
   await queryClient.invalidateQueries({
    queryKey: sessionKeys.all,
   })
   router.replace('/scan')
  },
 })
}
