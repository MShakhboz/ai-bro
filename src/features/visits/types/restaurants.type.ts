export interface Restaurant {
  id: number
  restaurant_name: string
  table_number: number | null
  visit_date: string
  preview_type: 'chat_message' | 'receipt' | string
  preview_text: string
  total_amount: number
}

export interface RestaurantsResponse {
  data: Restaurant[]
  meta: {
    current_page: number
    last_page: number
    total: number
  }
}

// src/features/scan/types/scan.types.ts

export type SelectRestaurantByPlacePayload = {
  place_id: string | number
  name?: string
  address?: string
  latitude?: number
  longitude?: number
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
