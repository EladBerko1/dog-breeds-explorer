import type { Breed } from '../types'

interface BreedCardProps {
  breed: Breed
}

// כרטיס של גזע אחד: שם + כמה תתי-גזעים יש לו
function BreedCard({ breed }: BreedCardProps) {
  const count = breed.subBreeds.length

  return (
    <li className="breed-card">
      <h2>{breed.name}</h2>
      <p>{count === 0 ? 'No sub-breeds' : `${count} sub-breeds`}</p>
    </li>
  )
}

export default BreedCard
