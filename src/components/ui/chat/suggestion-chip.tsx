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
   className='h-10 rounded-full bg-white text-[#7A6A52] px-4 whitespace-nowrap'
  >
   {label}
  </Button>
 )
}
