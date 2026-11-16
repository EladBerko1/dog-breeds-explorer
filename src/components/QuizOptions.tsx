import { formatBreedName } from '../utils/breeds'

interface QuizOptionsProps {
  options: string[]
  correctId: string
  selectedId: string | null
  onSelect: (breedId: string) => void
}

// כפתורי התשובות. אחרי בחירה: הנכונה בירוק, הבחירה השגויה באדום, וכל הכפתורים ננעלים.
function QuizOptions({ options, correctId, selectedId, onSelect }: QuizOptionsProps) {
  const hasAnswered = selectedId !== null

  return (
    <div className="quiz-options">
      {options.map((id) => {
        let className = 'quiz-option'
        if (hasAnswered && id === correctId) className += ' correct'
        else if (hasAnswered && id === selectedId) className += ' wrong'

        return (
          <button key={id} type="button" className={className} disabled={hasAnswered} onClick={() => onSelect(id)}>
            {formatBreedName(id)}
          </button>
        )
      })}
    </div>
  )
}

export default QuizOptions
