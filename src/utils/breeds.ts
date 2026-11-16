import type { Breed } from '../types'

// "hound" → "Hound"
export function formatBreedName(name: string): string {
  if (name === '') return ''
  return name.charAt(0).toUpperCase() + name.slice(1)
}

// ה-API מחזיר אובייקט { "hound": ["afghan", ...], ... } — הופכים אותו למערך של Breed.
// שם הגזע משמש כ-id, כי ב-API אין שדה id.
export function toBreeds(message: Record<string, string[]>): Breed[] {
  return Object.entries(message).map(([id, subBreeds]) => ({
    id,
    name: formatBreedName(id),
    subBreeds,
  }))
}
