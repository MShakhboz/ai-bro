// src/features/chat/types/chat.types.ts

export type ChatMessageRole = 'user' | 'assistant'

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
  image?: string
  popular?: boolean
}

export type MenuCategory = {
  id: number
  name_original: string
  name_ru: string
  items: ReferenceItem[]
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

export interface Nutrition {
  calories: number
  protein: number
  fat: number
  carbs: number
}

export interface ReferenceItem {
  id: number
  name_original: string
  name_ru: string | null
  description_original: string | null
  description_ru: string | null

  price: string
  currency: string
  weight_volume: string | null

  origin_guess: string | null

  nutrition: Nutrition

  allergens: string[]
  tags: string[]
  taste_profile: string[]

  image?: string
  popular?: boolean
}

export type ChatMessage = {
  id: number | string
  role?: ChatMessageRole
  type: 'text'
  text: string
  referenced_items?: ReferenceItem[]
  created_at?: string
}

export interface MenuDetailItem {
  id: number
  name_original: string
  name_ru: string
  description_ru: string
  price: number
  currency: string
  weight_volume: string | null
  tags: string[]
  allergens: string[]
  nutrition: Nutrition
  taste_profile: string[]
  origin_guess: string | null
  image?: string
}

export interface MenuItemResponse {
  item: MenuDetailItem
}

export interface OrderItem {
  id: number
  quantity: number
  price_at_add: number
  menu_item: Partial<MenuItem>
  image?: string
}

export interface AddOrderItemPayload {
  menu_item_id: number
  quantity: number
}

export interface UpdateOrderItemQuantityPayload {
  quantity: number
}
