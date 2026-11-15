# Hi Bro: AI guide to restaurant menus (guest app)

**Live demo:** https://ai-bro-theta.vercel.app · **Product:** [hibro.am](https://hibro.am)

A mobile-first Next.js app for restaurant guests: scan the table's QR code or photograph the menu, ask an AI assistant about the dishes, and build an order. It talks to the Hi Bro Laravel API.

## Features

- **Scanning:** read the table's QR code with the camera, or take several photos of a paper menu. Photos are compressed to JPEG and checked before upload, and text is recognized on the device with Tesseract (English and Russian).
- **AI menu chat:** ask about dishes in a chat with suggestion chips, open a dish in a drawer, and build the order in a cart (add, change and remove items).
- **Restaurants nearby:** a list based on the guest's location, with restaurant pages.
- **Visits:** a history of the guest's restaurant visits.
- **Onboarding:** a splash screen, a short onboarding and the guest's name.

## Architecture

Each feature (`scan`, `chatmenu`, `restaurants`, `visits`, `name`, `splash-screen`) lives in `src/features/<feature>/` with its own `api`, query `keys`, `hooks`, `types` and `ui`. Server data goes through TanStack Query; app state is in a Zustand store. Camera, geolocation and device-type helpers are shared hooks in `src/shared/hooks`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · TanStack Query · Zustand · Axios · Tailwind CSS v4 · shadcn/ui and Base UI · Embla Carousel · react-webcam · qr-scanner · Tesseract.js · Day.js

## Run locally

```bash
npm install
NEXT_PUBLIC_BASE_URL=<api-url> npm run dev   # http://localhost:3001
npm run build && npm run start                # port 3002, run with PM2 in production (ecosystem.config.js)
```
