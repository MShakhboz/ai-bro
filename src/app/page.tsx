import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
 return (
  <main className='flex min-h-screen items-center justify-center p-6'>
   <Card className='w-full max-w-sm'>
    <CardHeader>
     <CardTitle className='text-center'>Camera Demo</CardTitle>
    </CardHeader>

    <CardContent className='flex flex-col gap-4'>
     <Button size='lg'>
      <Link href='/camera'>📷 Camera</Link>
     </Button>

     <Button size='lg' variant='secondary'>
      <Link href='/qr'>🔳 QR Scanner</Link>
     </Button>
    </CardContent>
   </Card>
  </main>
 )
}
