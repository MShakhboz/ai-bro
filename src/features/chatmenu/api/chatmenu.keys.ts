// src/features/chat/api/chat.keys.ts

export const chatKeys = {
 all: ['chat'] as const,
 visit: (visitId: number | null) => [...chatKeys.all, visitId] as const,
 messages: (visitId: number | null) =>
  [...chatKeys.visit(visitId), 'messages'] as const,
}
