export interface Restaurant {
 id: string
 name: string
 cuisine: string
 table: string
 image: string
}

export type MessageRole = 'assistant' | 'user'

export interface Message {
 id: string
 role: MessageRole
 content: string
 createdAt: string
}

export interface Suggestion {
 id: string
 label: string
}
