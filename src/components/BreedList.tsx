import type { Breed } from '../types'
import BreedCard from './BreedCard'

interface BreedListProps {
  breeds: Breed[]
}

// רשימת הגזעים: map על המערך, ו-id (שם הגזע, ייחודי) משמש כ-key
function BreedList({ breeds }: BreedListProps) {
  return (
    <ul className="breed-list">
      {breeds.map((breed) => (
        <BreedCard key={breed.id} breed={breed} />
      ))}
    </ul>
  )
}

export default BreedList
