import type { Breed } from '../types'
import BreedCard from './BreedCard'

interface BreedListProps {
  breeds: Breed[]
  // לא חובה: רק בעמוד המועדפים מעבירים פונקציה, ואז לכל כרטיס יש כפתור "Remove"
  onRemove?: (breedId: string) => void
}

// רשימת הגזעים: map על המערך, ו-id (שם הגזע, ייחודי) משמש כ-key
function BreedList({ breeds, onRemove }: BreedListProps) {
  return (
    <ul className="breed-list">
      {breeds.map((breed) => (
        <BreedCard key={breed.id} breed={breed} onRemove={onRemove} />
      ))}
    </ul>
  )
}

export default BreedList
