import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import { fetchBreeds } from './api/dogApi'
import ErrorMessage from './components/ErrorMessage'
import Loader from './components/Loader'
import NavBar from './components/NavBar'
import BreedDetailPage from './pages/BreedDetailPage'
import BreedsPage from './pages/BreedsPage'
import type { Breed } from './types'

function App() {
  // ה-state של הגזעים נמצא כאן, כי גם עמוד הרשימה וגם עמוד הפרטים צריכים אותו
  const [breeds, setBreeds] = useState<Breed[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        <Route path="/breeds/:id" element={<BreedDetailPage breeds={breeds} />} />
      </Routes>
    )
  }

  return (
    <>
      <NavBar />
      <main className="app">{content}</main>
    </>
  )
}

export default App
