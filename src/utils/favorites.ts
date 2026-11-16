// לוגיקה טהורה של המועדפים: בלי React ובלי localStorage, כדי שאפשר יהיה לבדוק אותה.

// מוסיף גזע אם הוא לא ברשימה, ומסיר אותו אם הוא כבר שם. מחזיר מערך חדש.
export function toggleFavorite(favoriteIds: string[], breedId: string): string[] {
  if (favoriteIds.includes(breedId)) {
    return favoriteIds.filter((id) => id !== breedId)
  }
  return [...favoriteIds, breedId]
}

// הופך את הטקסט מ-localStorage חזרה למערך.
// אם אין כלום, או שהטקסט פגום, מחזיר מערך ריק במקום לקרוס.
export function parseFavorites(saved: string | null): string[] {
  if (saved === null) return []

  try {
    const value: unknown = JSON.parse(saved)
    if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
      return value
    }
    return []
  } catch {
    return []
  }
}
