interface FavoriteButtonProps {
  isFavorite: boolean
  onToggle: () => void
}

// כפתור שמוסיף או מסיר גזע מהמועדפים. הטקסט משתנה לפי המצב.
function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  return (
    <button type="button" className="favorite-button" aria-pressed={isFavorite} onClick={onToggle}>
      {isFavorite ? '★ Remove from favorites' : '☆ Add to favorites'}
    </button>
  )
}

export default FavoriteButton
