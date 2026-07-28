'use client'

import { useState } from 'react'

import ChatHeader from './chat-header'
import ChatInput from './chat-input'
import MessageList from './message-list'
import RestaurantCard from './restaurant-card'
import SuggestionList from './suggestion-list'

import { Message, Restaurant, Suggestion } from './types'
import { ChatMessage } from '@/features/chatmenu/types/chatmenu.types'

import { ScrollArea } from '../scroll-area'
import { Tabs, TabsContent } from '../tabs'

interface ChatProps {
 restaurant?: Restaurant
 messages: ChatMessage[]
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
  <div className='flex h-full min-h-0 flex-col bg-background'>
   <ChatHeader value={tab} onValueChange={setTab} />

   <Tabs
    value={tab}
    onValueChange={setTab}
    className='flex min-h-0 flex-1 flex-col'
   >
    <TabsContent
     value='assistant'
     className='mt-0 flex min-h-0 flex-1 flex-col'
    >
     <ScrollArea className='min-h-0 flex-1'>
      <RestaurantCard restaurant={restaurant} />

      <MessageList messages={messages} isTyping={loading} />
     </ScrollArea>

     <SuggestionList suggestions={suggestions} onSelect={onSuggestionClick} />

     <ChatInput
      loading={loading}
      onSend={onSend}
      onCameraClick={onCameraClick}
     />
    </TabsContent>

    <TabsContent value='menu' className='mt-0 min-h-0 flex-1'>
     <div className='h-full overflow-auto'>menu</div>
    </TabsContent>

    <TabsContent value='order' className='mt-0 min-h-0 flex-1'>
     <div className='h-full overflow-auto'>order</div>
    </TabsContent>
   </Tabs>
  </div>
 )
}
