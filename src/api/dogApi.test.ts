import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchBreedImages, fetchBreeds } from './dogApi'

// בבדיקות לא פונים לאינטרנט: מחליפים את fetch בפונקציה מזויפת שמחזירה תשובה שאנחנו קובעים
function mockFetch(body: unknown, ok = true, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok,
      status,
      json: () => Promise.resolve(body),
    }),
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('fetchBreeds', () => {
  it('returns the breeds as an array when the API succeeds', async () => {
    mockFetch({ message: { hound: ['afghan', 'basset'] }, status: 'success' })

    const breeds = await fetchBreeds()

    expect(breeds).toEqual([{ id: 'hound', name: 'Hound', subBreeds: ['afghan', 'basset'] }])
  })

  it('throws an error when the server returns an error status', async () => {
    mockFetch({}, false, 500)

    await expect(fetchBreeds()).rejects.toThrow('Server error: 500')
  })
})

describe('fetchBreedImages', () => {
  it('returns at most 12 images by default', async () => {
    const urls = Array.from({ length: 20 }, (_, i) => `https://images.dog.ceo/breeds/hound/${i}.jpg`)
    mockFetch({ message: urls, status: 'success' })

    const images = await fetchBreedImages('hound')

    expect(images).toHaveLength(12)
    expect(images[0]).toBe(urls[0])
  })

  it('throws an error when the breed does not exist', async () => {
    mockFetch({ status: 'error', message: 'Breed not found', code: 404 }, false, 404)

    await expect(fetchBreedImages('xyz')).rejects.toThrow('Server error: 404')
  })
})
