export type SessionPayload = {
 device_id: string
 platform: string
}

export interface SessionResponse {
 user: User
 has_name: boolean
 has_visit_history: boolean
 recent_visits: RecentVisit[]
 token: string
}

export interface User {
 id: number
 name: string | null
}

// Replace with the actual visit structure if it becomes available.
export type RecentVisit = unknown
