// hooks/useGetMenu.ts

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { chatApi } from '../api/chatmenu.api'
import { chatKeys } from '../api/chatmenu.keys'
import { MenuCategory } from '../types/chatmenu.types'

export function useGetMenu(
  restaurantId: number | string,
  options?: Omit<
    UseQueryOptions<{ categories: MenuCategory[] }>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: chatKeys.menu(restaurantId),
    queryFn: () => chatApi.getAllMenus(restaurantId),
    enabled: !!restaurantId,
    ...options,
  })
}
