import { Link } from 'react-router'
import BreedList from '../components/BreedList'
import type { Breed } from '../types'

interface FavoritesPageProps {
  breeds: Breed[]
  favoriteIds: string[]
  onRemove: (breedId: string) => void
}

function FavoritesPage({ breeds, favoriteIds, onRemove }: FavoritesPageProps) {
  // ב-localStorage שמורים רק מזהים. כאן מוצאים את הגזעים המלאים לפי המזהים.
  const favoriteBreeds = breeds.filter((breed) => favoriteIds.includes(breed.id))

  return (
    <>
      <h1>My Favorites</h1>
      {favoriteBreeds.length === 0 ? (
        <p>
          You have no favorite breeds yet. <Link to="/">Browse all breeds</Link> and add some.
        </p>
      ) : (
        <>
          <p className="results-count">{favoriteBreeds.length} favorite breeds</p>
          <BreedList breeds={favoriteBreeds} onRemove={onRemove} />
        </>
      )}
    </>
  )
}

export default FavoritesPage
