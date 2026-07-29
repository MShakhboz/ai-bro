'use client'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB

export async function compressToJpeg(
 blob: Blob,
 maxSize = MAX_FILE_SIZE,
): Promise<File> {
 const bitmap = await createImageBitmap(blob)

 let width = bitmap.width
 let height = bitmap.height

 // Start with a reasonable resolution
 const maxDimension = 1920

 if (width > maxDimension || height > maxDimension) {
  const scale = Math.min(maxDimension / width, maxDimension / height)

  width = Math.round(width * scale)
  height = Math.round(height * scale)
 }

 for (let attempt = 0; attempt < 10; attempt++) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')

  if (!ctx) {
   bitmap.close()
   throw new Error('Could not create canvas context')
  }

  ctx.drawImage(bitmap, 0, 0, width, height)

  // Gradually reduce quality
  const quality = Math.max(0.4, 0.9 - attempt * 0.06)

  const result = await new Promise<Blob | null>((resolve) => {
   canvas.toBlob(resolve, 'image/jpeg', quality)
  })

  if (result && result.size <= maxSize) {
   bitmap.close()

   return new File([result], `menu-${Date.now()}.jpg`, {
    type: 'image/jpeg',
    lastModified: Date.now(),
   })
  }

  // If quality isn't enough, also reduce dimensions
  width = Math.round(width * 0.85)
  height = Math.round(height * 0.85)
 }

 bitmap.close()

 throw new Error('Не удалось сжать изображение до 2 МБ')
}
