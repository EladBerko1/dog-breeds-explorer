import { describe, expect, it } from 'vitest'
import { formatBreedName, toBreeds } from './breeds'

describe('formatBreedName', () => {
  it('capitalizes the first letter of a breed name', () => {
    expect(formatBreedName('hound')).toBe('Hound')
  })

  it('returns an empty string for an empty name', () => {
    expect(formatBreedName('')).toBe('')
  })
})

describe('toBreeds', () => {
  it('turns the API object into an array of breeds', () => {
    const message = {
      beagle: [],
      bulldog: ['boston', 'english', 'french'],
    }

    expect(toBreeds(message)).toEqual([
      { id: 'beagle', name: 'Beagle', subBreeds: [] },
      { id: 'bulldog', name: 'Bulldog', subBreeds: ['boston', 'english', 'french'] },
    ])
  })

  it('uses the API breed name as the id, without formatting it', () => {
    const [breed] = toBreeds({ hound: ['afghan'] })

    expect(breed.id).toBe('hound')
    expect(breed.name).toBe('Hound')
  })

  it('returns an empty array when the API returns no breeds', () => {
    expect(toBreeds({})).toEqual([])
  })
})
