import { Route, Routes } from 'react-router'
import NavBar from './components/NavBar'
import breedsData from './data/breeds.json'
import BreedDetailPage from './pages/BreedDetailPage'
import BreedsPage from './pages/BreedsPage'
import type { Breed } from './types'

// המידע עדיין מגיע מקובץ מקומי. במשימה 3 הוא יוחלף ב-fetch מה-API.
const breeds: Breed[] = breedsData

function App() {
  return (
    <>
      <NavBar />
      <main className="app">
        <Routes>
          <Route path="/" element={<BreedsPage breeds={breeds} />} />
          <Route path="/breeds/:id" element={<BreedDetailPage breeds={breeds} />} />
        </Routes>
      </main>
    </>
  )
}

export default App
