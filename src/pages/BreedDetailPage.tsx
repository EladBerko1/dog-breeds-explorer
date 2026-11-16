import { Link, useParams } from 'react-router'
import type { Breed } from '../types'

interface BreedDetailPageProps {
  breeds: Breed[]
}

function BreedDetailPage({ breeds }: BreedDetailPageProps) {
  // id נקרא מהכתובת: בכתובת /breeds/hound הערך הוא "hound"
  const { id } = useParams()
  const breed = breeds.find((item) => item.id === id)

  if (!breed) {
    return <p>Breed not found.</p>
  }

  return (
    <>
      <Link to="/">← Back to all breeds</Link>
      <h1>{breed.name}</h1>
      {breed.subBreeds.length === 0 ? (
        <p>This breed has no sub-breeds.</p>
      ) : (
        <>
          <h2>Sub-breeds</h2>
          <ul>
            {breed.subBreeds.map((subBreed) => (
              <li key={subBreed}>{subBreed}</li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}

export default BreedDetailPage
