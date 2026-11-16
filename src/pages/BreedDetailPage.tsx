import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { fetchBreedImages } from '../api/dogApi'
import ErrorMessage from '../components/ErrorMessage'
import FavoriteButton from '../components/FavoriteButton'
import ImageGallery from '../components/ImageGallery'
import Loader from '../components/Loader'
import type { Breed } from '../types'

interface BreedDetailPageProps {
  breeds: Breed[]
  isFavorite: (breedId: string) => boolean
  onToggleFavorite: (breedId: string) => void
}

interface GalleryResult {
  breedId: string
  images: string[]
  error: string | null
}

function BreedDetailPage({ breeds, isFavorite, onToggleFavorite }: BreedDetailPageProps) {
  // id נקרא מהכתובת: בכתובת /breeds/hound הערך הוא "hound"
  const { id } = useParams()
  const breed = breeds.find((item) => item.id === id)
  const breedId = breed?.id

  // ה-state של התמונות שייך רק לעמוד הזה, ולכן הוא כאן ולא ב-App.
  // התוצאה זוכרת לאיזה גזע היא שייכת (breedId), כדי שלא נציג תמונות של גזע קודם.
  const [result, setResult] = useState<GalleryResult | null>(null)

  // רץ בכל פעם שהגזע משתנה. hooks חייבים לבוא לפני ה-return המוקדם למטה
  useEffect(() => {
    // AbortController מאפשר לבטל את הבקשה לשרת. בפונקציית הניקוי מבטלים אותה,
    // כך שאם עוברים לגזע אחר או יוצאים מהעמוד, התשובה הישנה לא תעדכן את המסך.
    const controller = new AbortController()

    if (breedId) {
      fetchBreedImages(breedId, 12, controller.signal)
        .then((urls) => {
          setResult({ breedId, images: urls, error: null })
        })
        .catch(() => {
          // בקשה שבוטלה בכוונה היא לא שגיאה שצריך להציג
          if (controller.signal.aborted) return
          setResult({
            breedId,
            images: [],
            error: 'Could not load the photos. Check your internet connection and refresh the page.',
          })
        })
    }

    return () => {
      controller.abort()
    }
  }, [breedId])

  // id בכתובת שלא מתאים לאף גזע, למשל /breeds/xyz
  if (!breed) {
    return (
      <div className="not-found">
        <h1>Breed not found</h1>
        <p>
          There is no breed called <code>{id}</code>.
        </p>
        <Link to="/">← Back to all breeds</Link>
      </div>
    )
  }

  // אין עדיין תוצאה לגזע הנוכחי = עדיין טוענים
  const isLoading = result === null || result.breedId !== breed.id

  let gallery
  if (isLoading) {
    gallery = <Loader text="Loading photos…" />
  } else if (result.error) {
    gallery = <ErrorMessage message={result.error} />
  } else {
    gallery = <ImageGallery images={result.images} breedName={breed.name} />
  }

  return (
    <>
      <Link to="/">← Back to all breeds</Link>
      <h1>{breed.name}</h1>
      <FavoriteButton isFavorite={isFavorite(breed.id)} onToggle={() => onToggleFavorite(breed.id)} />
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
      <h2>Photos</h2>
      {gallery}
    </>
  )
}

export default BreedDetailPage
