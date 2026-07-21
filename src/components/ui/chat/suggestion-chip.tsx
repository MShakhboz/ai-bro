'use client'

import { Button } from '@/components/ui/button'

interface SuggestionChipProps {
 label: string
 onClick?: () => void
 disabled?: boolean
}

export default function SuggestionChip({
 label,
 onClick,
 disabled,
}: SuggestionChipProps) {
 return (
  <Button
   type='button'
   variant='outline'
   size='sm'
   disabled={disabled}
   onClick={onClick}
   className='h-10 rounded-full px-4 whitespace-nowrap'
  >
   {label}
  </Button>
 )
}
