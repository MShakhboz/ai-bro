'use client'

import { useEffect, useRef, useState } from 'react'
import QrScanner from 'qr-scanner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function QRScannerPage() {
 const videoRef = useRef<HTMLVideoElement>(null)
 const scannerRef = useRef<QrScanner | null>(null)

 const [result, setResult] = useState('')
 const [error, setError] = useState('')
 const [scanning, setScanning] = useState(false)

 useEffect(() => {
  if (!videoRef.current) return

  const scanner = new QrScanner(
   videoRef.current,
   (scanResult) => {
    setResult(scanResult.data)

    // Stop after first successful scan
    scanner.stop()
    setScanning(false)
   },
   {
    highlightScanRegion: true,
    highlightCodeOutline: true,
    preferredCamera: 'environment',
   },
  )

  scannerRef.current = scanner

  return () => {
   scanner.destroy()
  }
 }, [])

 const startScanner = async () => {
  setError('')

  try {
   await scannerRef.current?.start()
   setScanning(true)
  } catch (err) {
   console.error(err)
   setError('Unable to access camera.')
  }
 }

 const stopScanner = async () => {
  await scannerRef.current?.stop()
  setScanning(false)
 }

 const scanAgain = async () => {
  setResult('')
  await startScanner()
 }

 return (
  <main className='container mx-auto flex min-h-screen items-center justify-center p-6'>
   <Card className='w-full max-w-lg'>
    <CardHeader>
     <CardTitle>QR Scanner</CardTitle>
    </CardHeader>

    <CardContent className='space-y-4'>
     <video ref={videoRef} className='w-full rounded-xl bg-black' />

     {!scanning && !result && (
      <Button className='w-full' onClick={startScanner}>
       Start Scanner
      </Button>
     )}

     {scanning && (
      <Button variant='secondary' className='w-full' onClick={stopScanner}>
       Stop Scanner
      </Button>
     )}

     {result && (
      <div className='space-y-3'>
       <div className='rounded-lg border p-4'>
        <p className='text-sm text-muted-foreground'>QR Code Data</p>

        <p className='break-all font-medium'>{result}</p>
       </div>

       <Button className='w-full' onClick={scanAgain}>
        Scan Again
       </Button>
      </div>
     )}

     {error && <p className='text-sm text-red-500'>{error}</p>}
    </CardContent>
   </Card>
  </main>
 )
}
