import { describe, expect, it } from 'vitest'
import { buildAnswerOptions, getBreedIdFromImageUrl, shuffle } from './quiz'

describe('getBreedIdFromImageUrl', () => {
  it('reads the breed from an image url', () => {
    expect(getBreedIdFromImageUrl('https://images.dog.ceo/breeds/labrador/n02099712_5000.jpg')).toBe('labrador')
  })

  it('returns the main breed when the url has a sub-breed', () => {
    expect(getBreedIdFromImageUrl('https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg')).toBe('hound')
  })

  it('returns null for a url that is not a breed image', () => {
    expect(getBreedIdFromImageUrl('https://example.com/cat.jpg')).toBeNull()
  })
})

describe('shuffle', () => {
  it('keeps the same items and does not change the original array', () => {
    const items = ['a', 'b', 'c', 'd']

    const result = shuffle(items)

    expect([...result].sort()).toEqual(['a', 'b', 'c', 'd'])
    expect(items).toEqual(['a', 'b', 'c', 'd'])
  })
})

describe('buildAnswerOptions', () => {
  const allIds = ['beagle', 'boxer', 'hound', 'husky', 'labrador', 'poodle', 'pug']

  it('returns 4 different options that include the correct answer', () => {
    const options = buildAnswerOptions('hound', allIds)

    expect(options).toHaveLength(4)
    expect(options).toContain('hound')
    expect(new Set(options).size).toBe(4)
  })

  it('only uses breeds from the list', () => {
    const options = buildAnswerOptions('hound', allIds)

    options.forEach((id) => expect(allIds).toContain(id))
  })

  it('returns fewer options when there are not enough breeds', () => {
    expect(buildAnswerOptions('hound', ['hound', 'pug']).sort()).toEqual(['hound', 'pug'])
  })
})
