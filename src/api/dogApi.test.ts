import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchBreeds } from './dogApi'

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
