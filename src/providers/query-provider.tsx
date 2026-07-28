'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
 // useState ensures a stable client per browser session, not per render
 const [queryClient] = useState(
  () =>
   new QueryClient({
    defaultOptions: {
     queries: {
      staleTime: 60 * 1000, // 1 min - tune per feature with query-level overrides
      retry: 1,
      refetchOnWindowFocus: false,
     },
    },
   }),
 )

 return (
  <QueryClientProvider client={queryClient}>
   {children}
   {process.env.NODE_ENV === 'development' && (
    <ReactQueryDevtools initialIsOpen={false} />
   )}
  </QueryClientProvider>
 )
}
