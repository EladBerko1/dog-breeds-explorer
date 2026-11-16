import { Link } from 'react-router'
import type { Breed } from '../types'

interface BreedCardProps {
  breed: Breed
  onRemove?: (breedId: string) => void
}

// כרטיס של גזע אחד: לחיצה עליו מובילה לכתובת של הגזע, למשל /breeds/hound.
// אם התקבלה onRemove (בעמוד המועדפים), מוצג גם כפתור הסרה.
function BreedCard({ breed, onRemove }: BreedCardProps) {
  const count = breed.subBreeds.length

  return (
    <li className="breed-card">
      <Link to={`/breeds/${breed.id}`}>
        <h2>{breed.name}</h2>
        <p>{count === 0 ? 'No sub-breeds' : `${count} sub-breeds`}</p>
      </Link>
      {onRemove && (
        <button type="button" className="remove-button" onClick={() => onRemove(breed.id)}>
          Remove
        </button>
      )}
    </li>
  )
}

export default BreedCard
