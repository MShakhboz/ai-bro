import { useInfiniteQuery } from '@tanstack/react-query'
import { visitApi } from '../api/restaurants.api'
import { visitKeys } from '../api/restaurants.keys'
import { getMockVisits } from '../api/visit.mock'

const USE_MOCK = true // ← flip to false to hit the real API

export function useRestaurants() {
 return useInfiniteQuery({
  queryKey: visitKeys.all,
  queryFn: ({ pageParam }) =>
   USE_MOCK ? getMockVisits(pageParam) : visitApi.getAll(pageParam),
  initialPageParam: 1,
  getNextPageParam: (lastPage) =>
   lastPage.meta.current_page < lastPage.meta.last_page
    ? lastPage.meta.current_page + 1
    : undefined,
 })
}
