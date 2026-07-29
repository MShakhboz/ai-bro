// src/features/scan/types/scan.types.ts

export type QRScanPayload = {
 url: string
 latitude: number
 longitude: number
}

export type CreatePhotoSession = {
 latitude: number
 longitude: number
}

export type QRScanResponse = {
 session_id: string
}

export type CreatePhotoSessionResponse = {
 session_id: string
}

export type UploadPhotoResponse = {
 photo_id: string
 url: string
}

export type ScanSessionStatus =
 | 'processing'
 | 'awaiting_restaurant'
 | 'done'
 | 'failed'
 | 'pending'

export type RestaurantCandidate = {
 place_id: string
 name: string
 address: string
 latitude: number
 longitude: number
}

export type SessionStatusResponse = {
 status: ScanSessionStatus
 candidates: RestaurantCandidate[]
 guessed_restaurant_name: string | null
 fallback_prompt: string | null
 restaurant_id: number
}

export type SelectRestaurantPayload = {
 restaurant_id: number
}
