// src/features/scan/api/scan.keys.ts
export const scanKeys = {
  all: ['scan'] as const,
  sessions: () => [...scanKeys.all, 'sessions'] as const,
  session: (sessionId: string) => [...scanKeys.sessions(), sessionId] as const,
  sessionStatus: (sessionId: string) => ['session_status', sessionId] as const,
  currentSession: () => [...scanKeys.all, 'current-session'] as const, // new
}
