import { Link } from 'react-router'
import type { Breed } from '../types'

interface BreedCardProps {
  breed: Breed
}

// כרטיס של גזע אחד: לחיצה עליו מובילה לכתובת של הגזע, למשל /breeds/hound
function BreedCard({ breed }: BreedCardProps) {
  const count = breed.subBreeds.length

  return (
    <li className="breed-card">
      <Link to={`/breeds/${breed.id}`}>
        <h2>{breed.name}</h2>
        <p>{count === 0 ? 'No sub-breeds' : `${count} sub-breeds`}</p>
      </Link>
    </li>
  )
}

export default BreedCard
