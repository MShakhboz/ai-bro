'use client'

import { useState } from 'react'

import ChatHeader from './chat-header'
import ChatInput from './chat-input'
import MessageList from './message-list'
import RestaurantCard from './restaurant-card'
import SuggestionList from './suggestion-list'
import { Message, Restaurant, Suggestion } from './types'
import { ScrollArea } from '../scroll-area'

interface ChatProps {
 restaurant: Restaurant
 messages: Message[]
 suggestions: Suggestion[]

 loading?: boolean

 onSend(message: string): void
 onSuggestionClick(suggestion: Suggestion): void
 onCameraClick(): void
}

export default function Chat({
 restaurant,
 messages,
 suggestions,
 loading,
 onSend,
 onSuggestionClick,
 onCameraClick,
}: ChatProps) {
 const [tab, setTab] = useState('assistant')

 return (
  <div className='flex h-full flex-col bg-background'>
   <ChatHeader value={tab} onValueChange={setTab} />

   <ScrollArea className='flex-1 min-h-0'>
    <RestaurantCard restaurant={restaurant} />
    <MessageList messages={messages} isTyping={loading} />
   </ScrollArea>

   <SuggestionList suggestions={suggestions} onSelect={onSuggestionClick} />

   <ChatInput loading={loading} onSend={onSend} onCameraClick={onCameraClick} />
  </div>
 )
}
