// src/features/chat/types/chat.types.ts

export type ChatMessageRole = 'user' | 'assistant'

export type ReferencedMenuItem = {
 id: number
 name_ru: string
 price: number
 image: string
}

export type ChatMessage = {
 id: number
 role: ChatMessageRole
 type: 'text'
 text: string
 referenced_items: ReferencedMenuItem[]
 created_at: string
}

export type GetMessagesResponse = {
 messages: ChatMessage[]
}

export type SendMessagePayload = {
 type: 'text'
 text: string
 menu_item_id?: number | null // optional — user referencing a specific dish while asking
}

export type SendMessageResponse = {
 message: ChatMessage // wrapped, singular — different envelope than GET
}

// src/features/scan/types/scan.types.ts

export type SelectRestaurantByPlacePayload = {
 place_id: string
 name: string
 address: string
 latitude: number
 longitude: number
}

export type SelectRestaurantManualPayload = {
 restaurant_name: string
}

// user picks one path or the other — not both at once
export type SelectRestaurantPayload =
 | SelectRestaurantByPlacePayload
 | SelectRestaurantManualPayload

export type MenuItem = {
 id: number
 name_original: string
 name_ru: string
 price: number
 currency: string
 tags: string[]
 allergens: string[]
}

export type MenuCategory = {
 id: number
 name_original: string
 name_ru: string
 items: MenuItem[]
}

export type SelectRestaurantResponse = {
 restaurant_id: number
 visit_id: number
 menu: {
  categories: MenuCategory[]
 }
}

export type SelectRestaurantConflictError = {
 message: string
}
