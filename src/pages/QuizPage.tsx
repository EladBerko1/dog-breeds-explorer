import { useEffect, useState } from 'react'
import { fetchRandomImage } from '../api/dogApi'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import QuizOptions from '../components/QuizOptions'
import type { Breed } from '../types'
import { formatBreedName } from '../utils/breeds'
import { buildAnswerOptions, getBreedIdFromImageUrl } from '../utils/quiz'

interface QuizPageProps {
  breeds: Breed[]
}

interface Question {
  imageUrl: string
  correctId: string
  options: string[]
}

// התוצאה של סיבוב: זוכרת לאיזה סיבוב היא שייכת (כמו בגלריה), כדי לדעת מתי עדיין טוענים
interface RoundResult {
  round: number
  question: Question | null
  error: string | null
}

function QuizPage({ breeds }: QuizPageProps) {
  // מספר הסיבוב. "Next question" מגדיל אותו, וזה מה שמפעיל את ה-useEffect מחדש
  const [round, setRound] = useState(0)
  const [result, setResult] = useState<RoundResult | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [score, setScore] = useState({ correct: 0, answered: 0 })

  useEffect(() => {
    const controller = new AbortController()

    fetchRandomImage(controller.signal)
      .then((imageUrl) => {
        const correctId = getBreedIdFromImageUrl(imageUrl)
        if (!correctId) throw new Error('Unexpected image url')

        const allIds = breeds.map((breed) => breed.id)
        setResult({
          round,
          question: { imageUrl, correctId, options: buildAnswerOptions(correctId, allIds) },
          error: null,
        })
      })
      .catch(() => {
        if (controller.signal.aborted) return
        setResult({ round, question: null, error: 'Could not load a new dog. Check your internet connection.' })
      })

    return () => {
      controller.abort()
    }
  }, [round, breeds])

  function handleSelect(breedId: string) {
    if (selectedId !== null || !result?.question) return

    const isCorrect = breedId === result.question.correctId
    setSelectedId(breedId)
    setScore((current) => ({
      correct: current.correct + (isCorrect ? 1 : 0),
      answered: current.answered + 1,
    }))
  }

  function handleNext() {
    setSelectedId(null)
    setRound((current) => current + 1)
  }

  const isLoading = result === null || result.round !== round

  let content
  if (isLoading) {
    content = <Loader text="Fetching a dog…" />
  } else if (result.error || !result.question) {
    content = (
      <>
        <ErrorMessage message={result.error ?? 'Something went wrong.'} />
        <button type="button" className="quiz-next" onClick={handleNext}>
          Try again
        </button>
      </>
    )
  } else {
    const { imageUrl, correctId, options } = result.question
    content = (
      <>
        <img className="quiz-image" src={imageUrl} alt="A dog of a mystery breed" />
        <QuizOptions options={options} correctId={correctId} selectedId={selectedId} onSelect={handleSelect} />
        {selectedId !== null && (
          <>
            <p className="quiz-feedback">
              {selectedId === correctId ? '🎉 Correct!' : `❌ Not quite — it's a ${formatBreedName(correctId)}.`}
            </p>
            <button type="button" className="quiz-next" onClick={handleNext}>
              Next question →
            </button>
          </>
        )}
      </>
    )
  }

  return (
    <>
      <h1>Guess the Breed</h1>
      <p className="results-count">
        Score: {score.correct} / {score.answered}
      </p>
      {content}
    </>
  )
}

export default QuizPage
