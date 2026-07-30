import { useQuery } from '@tanstack/react-query'
import { chatKeys } from '../api/chatmenu.keys'
import { chatApi } from '../api/chatmenu.api'

export function useMenuItem(menuItemId: number | null) {
  return useQuery({
    queryKey: chatKeys.menuItem(menuItemId),
    queryFn: () => chatApi.getMenuItem(menuItemId as number),
    enabled: menuItemId !== null,
    staleTime: Infinity, // computed once at recognition time, never regenerated
  })
}
