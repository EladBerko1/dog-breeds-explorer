import BreedList from '../components/BreedList'
import type { Breed } from '../types'

interface BreedsPageProps {
  breeds: Breed[]
}

function BreedsPage({ breeds }: BreedsPageProps) {
  return (
    <>
      <h1>All Breeds</h1>
      <BreedList breeds={breeds} />
    </>
  )
}

export default BreedsPage
