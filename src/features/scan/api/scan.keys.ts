// src/features/scan/api/scan.keys.ts
export const scanKeys = {
 all: ['scan'] as const,
 sessions: () => [...scanKeys.all, 'sessions'] as const,
 session: (sessionId: string) => [...scanKeys.sessions(), sessionId] as const,
 sessionStatus: (sessionId: string) =>
  [...scanKeys.session(sessionId), 'status'] as const,
 currentSession: () => [...scanKeys.all, 'current-session'] as const, // new
}
