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
 | 'pending'
 | 'processing'
 | 'completed'
 | 'failed'

export type SessionStatusResponse = {
 status: ScanSessionStatus
 // likely includes extracted menu data once completed — fill in
}

export type SelectRestaurantPayload = {
 restaurant_id: number
}
