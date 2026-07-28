// src/features/scan/lib/validate-menu-photo.ts

const MAX_FILE_SIZE_BYTES = 2048 * 1024 // 2048 KB per the spec
const ALLOWED_TYPES = ['image/jpeg']

export function validateMenuPhoto(file: File): string | null {
 if (!ALLOWED_TYPES.includes(file.type)) {
  return 'Файл должен быть в формате JPEG'
 }
 if (file.size > MAX_FILE_SIZE_BYTES) {
  return 'Размер файла не должен превышать 2 МБ'
 }
 return null
}
