import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import { fetchBreeds } from './api/dogApi'
import ErrorMessage from './components/ErrorMessage'
import Loader from './components/Loader'
import NavBar from './components/NavBar'
import { useFavorites } from './hooks/useFavorites'
import BreedDetailPage from './pages/BreedDetailPage'
import BreedsPage from './pages/BreedsPage'
import FavoritesPage from './pages/FavoritesPage'
import QuizPage from './pages/QuizPage'
import type { Breed } from './types'

function App() {
  // ה-state של הגזעים נמצא כאן, כי גם עמוד הרשימה וגם עמוד הפרטים צריכים אותו
  const [breeds, setBreeds] = useState<Breed[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // המועדפים כאן, כי שלושה חלקים צריכים אותם: עמוד הפרטים, עמוד המועדפים והתפריט
  const favorites = useFavorites()

  // רץ פעם אחת, כשהאפליקציה עולה ([] = בלי תלויות)
  useEffect(() => {
    // אם הרכיב יורד מהמסך לפני שהתשובה הגיעה, לא מעדכנים state
    let ignore = false

    fetchBreeds()
      .then((data) => {
        if (!ignore) setBreeds(data)
      })
      .catch(() => {
        if (!ignore) setError('Could not load the breeds. Check your internet connection and refresh the page.')
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  // שלושה מצבים: טוען · שגיאה · יש מידע
  let content
  if (isLoading) {
    content = <Loader text="Loading breeds…" />
  } else if (error) {
    content = <ErrorMessage message={error} />
  } else {
    content = (
      <Routes>
        <Route path="/" element={<BreedsPage breeds={breeds} />} />
        <Route
          path="/breeds/:id"
          element={
            <BreedDetailPage
              breeds={breeds}
              isFavorite={favorites.isFavorite}
              onToggleFavorite={favorites.toggle}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <FavoritesPage
              breeds={breeds}
              favoriteIds={favorites.favoriteIds}
              onRemove={favorites.toggle}
            />
          }
        />
        <Route path="/quiz" element={<QuizPage breeds={breeds} />} />
      </Routes>
    )
  }

  return (
    <>
      <NavBar favoritesCount={favorites.favoriteIds.length} />
      <main className="app">{content}</main>
    </>
  )
}

export default App
