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

// מסנן את הגזעים לפי טקסט חיפוש, ואם צריך — רק גזעים שיש להם תתי-גזעים.
// החיפוש לא רגיש לאותיות גדולות/קטנות ומתעלם מרווחים בהתחלה ובסוף.
export function filterBreeds(breeds: Breed[], query: string, onlyWithSubBreeds: boolean): Breed[] {
  const search = query.trim().toLowerCase()

  return breeds.filter((breed) => {
    const matchesSearch = breed.id.includes(search)
    const matchesSubBreeds = !onlyWithSubBreeds || breed.subBreeds.length > 0
    return matchesSearch && matchesSubBreeds
  })
}
