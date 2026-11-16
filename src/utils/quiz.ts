// לוגיקה טהורה של החידון: בלי React ובלי fetch, כדי שאפשר יהיה לבדוק אותה.

// מחלץ את הגזע הראשי מכתובת תמונה של Dog CEO.
// "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg" → "hound"
// אם הכתובת לא בפורמט הצפוי, מחזיר null.
export function getBreedIdFromImageUrl(url: string): string | null {
  const match = url.match(/\/breeds\/([^/]+)\//)
  if (!match) return null

  const folder = match[1] // "hound-afghan"
  return folder.split('-')[0] // "hound"
}

// מחזיר עותק מעורבב של המערך (אלגוריתם Fisher–Yates). המערך המקורי לא משתנה.
// random מתקבל כפרמטר כדי שבבדיקות אפשר יהיה להעביר ערכים קבועים.
export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// בונה את התשובות לשאלה: התשובה הנכונה ועוד תשובות שגויות שונות, בסדר מעורבב.
export function buildAnswerOptions(
  correctId: string,
  allIds: string[],
  count = 4,
  random: () => number = Math.random,
): string[] {
  const wrongIds = shuffle(
    allIds.filter((id) => id !== correctId),
    random,
  ).slice(0, count - 1)

  return shuffle([correctId, ...wrongIds], random)
}
