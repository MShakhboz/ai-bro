'use client'

import { useState } from 'react'

import ChatHeader from './chat-header'
import ChatInput from './chat-input'
import MessageList from './message-list'
import RestaurantCard from './restaurant-card'
import SuggestionList from './suggestion-list'

import { Restaurant, Suggestion } from './types'
import {
  ChatMessage,
  MenuCategory,
} from '@/features/chatmenu/types/chatmenu.types'

import { ScrollArea } from '../scroll-area'
import { Tabs, TabsContent } from '../tabs'
import RestaurantMenu from './restaurant-menu'
import MenuItemDrawer from './menu-item-drawer'
import CartList from './cart-list'
import { useAddVisitItem } from '@/features/chatmenu/hooks/useAddVisitItem'

interface ChatProps {
  restaurant?: Restaurant
  messages: ChatMessage[]
  suggestions: Suggestion[]
  loading?: boolean
  onSend(message: string): void
  onSuggestionClick(suggestion: Suggestion): void
  onCameraClick(): void
  menudata?: MenuCategory[]
  visitId?: string | number
}

export default function Chat({
  restaurant,
  messages,
  suggestions,
  loading,
  onSend,
  onSuggestionClick,
  onCameraClick,
  menudata,
  visitId,
}: ChatProps) {
  const [tab, setTab] = useState('assistant')
  const [openedMenuItem, setOpenedMenuItem] = useState<boolean>(false)
  const [menuItem, setMenuItem] = useState<number | null>(null) // 988

  const addItem = useAddVisitItem(visitId)

  const onSelectItem = (i: number | null) => {
    setMenuItem(i)
    setOpenedMenuItem(true)
  }

  return (
    <div className='flex h-full min-h-0 flex-col bg-background relative'>
      <ChatHeader value={tab} onValueChange={setTab} />

      <Tabs
        value={tab}
        onValueChange={setTab}
        className='flex min-h-0 flex-1 flex-col'
      >
        <TabsContent
          value='assistant'
          keepMounted
          className='mt-0 flex min-h-0 flex-1 flex-col'
        >
          <ScrollArea className='min-h-0 flex-1'>
            <RestaurantCard restaurant={restaurant} />

            <MessageList
              messages={messages}
              isTyping={loading}
              onItemClick={onSelectItem}
            />
          </ScrollArea>

          <SuggestionList
            suggestions={suggestions}
            onSelect={onSuggestionClick}
          />

          <ChatInput
            loading={loading}
            onSend={onSend}
            onCameraClick={onCameraClick}
          />
        </TabsContent>

        <TabsContent
          value='menu'
          keepMounted
          className='mt-0 flex-1 overflow-y-auto'
        >
          <RestaurantMenu menuData={menudata} onItemClick={onSelectItem} />
        </TabsContent>

        <TabsContent value='order' keepMounted className='mt-0 min-h-0 flex-1'>
          <CartList />
        </TabsContent>
      </Tabs>
      <MenuItemDrawer
        isOpened={openedMenuItem}
        onOpen={setOpenedMenuItem}
        menuItemId={menuItem}
        onAskAi={(v) => {
          setOpenedMenuItem(false)
          setTab('assistant')
          onSuggestionClick(v)
        }}
      />
    </div>
  )
}
