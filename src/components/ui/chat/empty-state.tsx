'use client'

import { MessageCircle } from 'lucide-react'
import Message from './message'

export default function EmptyState() {
  return (
    <div className='flex flex-col gap-4 px-4 py-6'>
      <Message
        message={{
          id: 'intro-message',
          role: 'assistant',
          type: 'text',
          text: 'Добрый вечер! Я загрузил меню Semplice. Что порекомендовать? Есть особые предпочтения?',
        }}
      />
    </div>
  )
}
