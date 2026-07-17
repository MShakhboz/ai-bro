'use client'

import { useEffect, useRef } from 'react'
import QrScanner from 'qr-scanner'

interface QRScannerProps {
 active: boolean
 onSuccess: (value: string) => void
 onError: (message: string) => void
}

export default function QRScanner({
 active,
 onSuccess,
 onError,
}: QRScannerProps) {
 const videoRef = useRef<HTMLVideoElement>(null)
 const scannerRef = useRef<QrScanner | null>(null)

 useEffect(() => {
  if (!active || !videoRef.current) return

  let mounted = true

  const scanner = new QrScanner(
   videoRef.current,
   (result) => {
    if (!mounted) return

    scanner.stop()

    onSuccess(result.data)
   },
   {
    preferredCamera: 'environment',
    highlightScanRegion: true,
    highlightCodeOutline: true,
    returnDetailedScanResult: true,
   },
  )

  scannerRef.current = scanner

  scanner.start().catch((error) => {
   if (!mounted) return

   onError(error instanceof Error ? error.message : 'Unable to access camera.')
  })

  return () => {
   mounted = false

   scanner.destroy()

   scannerRef.current = null
  }
 }, [active, onSuccess, onError])

 if (!active) return null

 return (
  <div className='absolute inset-0 bg-black'>
   <video
    ref={videoRef}
    className='h-full w-full object-cover'
    playsInline
    muted
   />

   {/* Dark overlay */}
   <div className='pointer-events-none absolute inset-0 bg-black/35' />

   {/* Scan frame */}
   <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
    <div className='relative h-72 w-72 rounded-3xl border-2 border-white'>
     <div className='absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 animate-pulse bg-green-400' />
    </div>
   </div>

   <div className='absolute bottom-12 left-0 right-0 px-6 text-center text-white'>
    <h2 className='text-lg font-semibold'>Scan a QR Code</h2>

    <p className='mt-2 text-sm opacity-80'>Point your camera at a QR code.</p>
   </div>
  </div>
 )
}

{
 /* <QRScanner
  active={isScanning}
  onSuccess={(data) => {
    setResult(data)
    setDialogOpen(true)
    setIsScanning(false)
  }}
  onError={(error) => {
    setResult(error)
    setDialogOpen(true)
    setIsScanning(false)
  }}
/> */
}
