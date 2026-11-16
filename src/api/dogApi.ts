import type { Breed, BreedsApiResponse } from '../types'
import { toBreeds } from '../utils/breeds'

const BASE_URL = 'https://dog.ceo/api'

// מושך את כל הגזעים מה-API ומחזיר אותם כמערך מוכן לשימוש.
// זורק שגיאה אם השרת לא החזיר תשובה תקינה.
export async function fetchBreeds(): Promise<Breed[]> {
  const response = await fetch(`${BASE_URL}/breeds/list/all`)

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`)
  }

  const data: BreedsApiResponse = await response.json()

  if (data.status !== 'success') {
    throw new Error('The API returned an unexpected response')
  }

  return toBreeds(data.message)
}
