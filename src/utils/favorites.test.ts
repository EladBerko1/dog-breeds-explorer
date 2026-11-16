import { describe, expect, it } from 'vitest'
import { parseFavorites, toggleFavorite } from './favorites'

describe('toggleFavorite', () => {
  it('adds a breed that is not in the favorites yet', () => {
    expect(toggleFavorite(['beagle'], 'hound')).toEqual(['beagle', 'hound'])
  })

  it('removes a breed that is already in the favorites', () => {
    expect(toggleFavorite(['beagle', 'hound'], 'beagle')).toEqual(['hound'])
  })

  it('does not change the original array', () => {
    const favorites = ['beagle']

    toggleFavorite(favorites, 'hound')

    expect(favorites).toEqual(['beagle'])
  })
})

describe('parseFavorites', () => {
  it('reads a saved list of breed ids', () => {
    expect(parseFavorites('["beagle","hound"]')).toEqual(['beagle', 'hound'])
  })

  it('returns an empty list when nothing was saved', () => {
    expect(parseFavorites(null)).toEqual([])
  })

  it('returns an empty list when the saved text is broken', () => {
    expect(parseFavorites('not json')).toEqual([])
    expect(parseFavorites('{"beagle":true}')).toEqual([])
  })
})
