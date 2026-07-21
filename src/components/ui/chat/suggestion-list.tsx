'use client'

import SuggestionChip from './suggestion-chip'
import { Suggestion } from './types'

interface SuggestionListProps {
 suggestions: Suggestion[]
 onSelect?(suggestion: Suggestion): void
}

export default function SuggestionList({
 suggestions,
 onSelect,
}: SuggestionListProps) {
 if (!suggestions.length) {
  return null
 }

 return (
  <div className='border-t bg-background'>
   <div className='flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide'>
    {suggestions.map((suggestion) => (
     <SuggestionChip
      key={suggestion.id}
      label={suggestion.label}
      onClick={() => onSelect?.(suggestion)}
     />
    ))}
   </div>
  </div>
 )
}

// <SuggestionList
//   suggestions={[
//     {
//       id: '1',
//       label: 'Хочу легко',
//     },
//     {
//       id: '2',
//       label: 'Хочу сытно',
//     },
//     {
//       id: '3',
//       label: 'Что посоветуешь?',
//     },
//   ]}
//   onSelect={suggestion => {
//     console.log(suggestion)
//   }}
// />
