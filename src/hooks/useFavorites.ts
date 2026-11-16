import { useEffect, useState } from 'react'
import { parseFavorites, toggleFavorite } from '../utils/favorites'

const STORAGE_KEY = 'dog-breeds-favorites'

// Custom hook: מחזיק את רשימת המועדפים (מזהי גזעים) ושומר אותה ב-localStorage,
// כדי שהיא תישאר גם אחרי רענון הדף.
export function useFavorites() {
  // הפונקציה שמועברת ל-useState רצה רק בציור הראשון: קוראים מ-localStorage פעם אחת
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      return parseFavorites(localStorage.getItem(STORAGE_KEY))
    } catch {
      return []
    }
  })

  // בכל פעם שהרשימה משתנה — שומרים אותה (localStorage שומר רק טקסט, לכן JSON.stringify)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds))
    } catch {
      // אם הדפדפן חוסם שמירה (למשל בגלישה פרטית), המועדפים פשוט לא יישמרו
    }
  }, [favoriteIds])

  function isFavorite(breedId: string): boolean {
    return favoriteIds.includes(breedId)
  }

  function toggle(breedId: string): void {
    setFavoriteIds((current) => toggleFavorite(current, breedId))
  }

  return { favoriteIds, isFavorite, toggle }
}
