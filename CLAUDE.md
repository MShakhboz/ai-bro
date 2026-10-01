# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev     # next dev on 0.0.0.0:3001 (not 3000, despite the README)
npm run build   # next build
npm run start   # next start on port 3002 (what PM2 runs in production, see ecosystem.config.js, app name "hibro-site")
npm run lint    # eslint (flat config, eslint-config-next core-web-vitals + typescript)
```

There is no test runner configured and no typecheck script; use `npx tsc --noEmit` to typecheck.

`NEXT_PUBLIC_BASE_URL` (in `.env`) is the backend API base URL and is required — every request goes through it.

Camera and geolocation APIs need a secure context. `certificates/` holds a local `localhost` cert (untracked) for running dev over HTTPS when testing from a phone on the LAN.

## What this is

"AI Bro" — a mobile-first, client-rendered Next.js 16 (App Router) / React 19 frontend for an AI restaurant menu guide. The user scans a restaurant QR code or photographs a menu, the backend identifies the restaurant, and the user chats with an AI about the menu and builds an order. All UI copy is in Russian. There are no API routes or server-side data fetching here; the backend is a separate service.

## Architecture

### Layers

- `src/app/**/page.tsx` — thin route shells. Each one only renders a component from `src/features/<feature>/ui/`. Put logic in the feature, not the page.
- `src/features/<feature>/` — feature slices, each with the same layout:
  - `api/<feature>.api.ts` — an object of async functions calling the shared axios instance and unwrapping `data`
  - `api/<feature>.keys.ts` — TanStack Query key factory
  - `hooks/` — one `useQuery`/`useMutation` hook per file wrapping an api function
  - `types/` — request/response types
  - `ui/` — the screen component(s), `'use client'`
- `src/components/ui/` — shadcn components (style `base-nova`, built on `@base-ui/react`, not Radix) plus app-level presentational components: `chat/` (the whole chat/menu/cart UI, exported through `chat/index.ts`) and the camera/QR scanner components.
- `src/shared/` — cross-feature hooks (`useCamera`, `useGeolocation`, `useDeviceType`) and libs (`axios`, JPEG compression, menu photo validation).
- `src/store/use-app-store.ts` — the single Zustand store.

Path alias: `@/*` → `src/*`.

### Auth and session

There is no login. `SplashScreen` (route `/`) posts a generated `device_id` + platform to `/session/bootstrap` and stores the response (including `token`) as `me` in the Zustand store. The axios instance in `src/shared/lib/axios.ts` reads `me` straight from the store to attach `Authorization: Bearer` and `X-Device-Id` to every request; on a 401 it resets the store and hard-redirects to `/`.

The store is persisted to `localStorage` under key `ai-bro`, but only `sessionId`, `me`, and `name` are in `partialize` — everything else (`visitId`, `pendingScan`, `imgOrder`, …) is lost on reload. Note that `sessionId` here is the **scan photo session** id, not the auth session.

### Screen flow

`/` splash → `/onboarding` (first time) → `/name` → `/scan`, or → `/visits` if the bootstrap response has `recent_visits`.

Scan (`features/scan`, `ScanBox`): QR scan or menu photo upload creates a scan session on the backend (`/scan/qr` or `/scan/photo/sessions` + photo uploads + `complete`). `useSessionStatus` then polls `/scan/photo/sessions/{id}/status` every 2s until `done` / `failed` / `awaiting_restaurant`, and performs the navigation itself from inside `refetchInterval` — to `/visits/new_restaurant?restaurant_name=…`. `useScanSession` is the orchestrating hook that composes the individual scan mutations.

Chat (`features/chatmenu`, `Chatmenu`): both `/visits/[id]` and `/restaurants/[id]` render the same component. On mount it calls `select-restaurant` for the stored scan `sessionId`, which returns the `visit_id` and menu. The route `id` is a restaurant/place id, or the literal `new_restaurant`; the visit id comes from the select-restaurant response or the `visit_id` query param, and the restaurant name from the `restaurant_name` query param. Chat messages, menu, and order items (cart) are all keyed on that visit id (`/visits/{visitId}/chat/messages`, `/visits/{visitId}/items`). `useSendMessage` optimistically appends the user message and then appends the assistant reply on success rather than refetching.

### Things that will trip you up

- `features/restaurants` and `features/visits` are near-duplicates (both export `visitApi`, same file names) with diverging hook signatures — e.g. `useSelectRestaurant` takes `{ sessionId, payload }` in `restaurants` but just `sessionId` in `visits`. Check which one a file imports before changing either.
- Header comments like `// src/app/page.tsx` at the top of files are frequently stale copy-paste; trust the real path.
- Formatting is inconsistent between files (1-space vs 2-space indent); match the file you are editing. Style is single quotes, no semicolons.
- Colors are hard-coded hex Tailwind arbitrary values (`bg-[#C87437]`, `text-[#241C17]`, …) rather than theme tokens. Tailwind is v4 (config lives in `src/app/globals.css`, no `tailwind.config`).
- `MobileLayout` in the root layout constrains every page to a phone-sized frame on desktop; screens should be built to fill `h-full`.
- Menu photos must be JPEG ≤ 2 MB (`validate-menu-photo.ts`); use `compress-to-jpeg.ts` before upload.
- `ecosystem.config.js` starts the app via `yarn`, but the repo's lockfile is `package-lock.json`.
