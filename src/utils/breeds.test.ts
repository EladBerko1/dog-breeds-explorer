import { describe, expect, it } from 'vitest'
import type { Breed } from '../types'
import { filterBreeds, formatBreedName, toBreeds } from './breeds'

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

describe('filterBreeds', () => {
  const breeds: Breed[] = [
    { id: 'beagle', name: 'Beagle', subBreeds: [] },
    { id: 'bulldog', name: 'Bulldog', subBreeds: ['boston', 'english', 'french'] },
    { id: 'bullterrier', name: 'Bullterrier', subBreeds: ['staffordshire'] },
    { id: 'pitbull', name: 'Pitbull', subBreeds: [] },
  ]

  it('returns all breeds when the search is empty', () => {
    expect(filterBreeds(breeds, '', false)).toHaveLength(4)
  })

  it('keeps only breeds whose name contains the search text', () => {
    const ids = filterBreeds(breeds, 'bull', false).map((breed) => breed.id)

    expect(ids).toEqual(['bulldog', 'bullterrier', 'pitbull'])
  })

  it('ignores upper case letters and spaces around the search text', () => {
    const ids = filterBreeds(breeds, '  BEA ', false).map((breed) => breed.id)

    expect(ids).toEqual(['beagle'])
  })

  it('keeps only breeds with sub-breeds when the checkbox is on', () => {
    const ids = filterBreeds(breeds, 'bull', true).map((breed) => breed.id)

    expect(ids).toEqual(['bulldog', 'bullterrier'])
  })

  it('returns an empty array when nothing matches', () => {
    expect(filterBreeds(breeds, 'cat', false)).toEqual([])
  })
})
