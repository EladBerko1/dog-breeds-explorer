import { useState } from 'react'
import BreedList from '../components/BreedList'
import SearchBar from '../components/SearchBar'
import type { Breed } from '../types'
import { filterBreeds } from '../utils/breeds'

interface BreedsPageProps {
  breeds: Breed[]
}

function BreedsPage({ breeds }: BreedsPageProps) {
  // ה-state של החיפוש שייך רק לעמוד הרשימה
  const [query, setQuery] = useState('')
  const [onlyWithSubBreeds, setOnlyWithSubBreeds] = useState(false)

  // הרשימה המסוננת לא נשמרת ב-state: מחשבים אותה מחדש בכל ציור מתוך breeds + החיפוש
  const visibleBreeds = filterBreeds(breeds, query, onlyWithSubBreeds)

  return (
    <>
      <h1>All Breeds</h1>
      <SearchBar
        query={query}
        onQueryChange={setQuery}
        onlyWithSubBreeds={onlyWithSubBreeds}
        onOnlyWithSubBreedsChange={setOnlyWithSubBreeds}
      />
      <p className="results-count">
        Showing {visibleBreeds.length} of {breeds.length} breeds
      </p>
      {visibleBreeds.length === 0 ? (
        <p>No breeds match your search.</p>
      ) : (
        <BreedList breeds={visibleBreeds} />
      )}
    </>
  )
}

export default BreedsPage
