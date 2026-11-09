import BreedList from './components/BreedList'
import breedsData from './data/breeds.json'
import type { Breed } from './types'

// משימה 1: המידע מגיע מקובץ מקומי. במשימה 3 הוא יוחלף ב-fetch מה-API.
const breeds: Breed[] = breedsData

function App() {
  return (
    <main className="app">
      <h1>Dog Breeds Explorer</h1>
      <BreedList breeds={breeds} />
    </main>
  )
}

export default App
