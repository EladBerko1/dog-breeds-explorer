# ארכיטקטורה — Dog Breeds Explorer

איך האפליקציה בנויה: השכבות, עץ הרכיבים, איפה כל state נמצא ואיך המידע זורם.
חזרה ל-[PRD.md](../PRD.md).

## השכבות

```
index.html          <div id="root"> ריק
   └── main.tsx     BrowserRouter → App
        └── App.tsx            state משותף + Routes
             ├── pages/         עמוד לכל כתובת
             │    └── components/   חלקי תצוגה שחוזרים על עצמם
             ├── hooks/         useFavorites
             ├── api/           fetch ל-Dog CEO
             └── utils/         לוגיקה טהורה (נבדקת ב-Vitest)
```

| שכבה | תפקיד | תלויה ב- |
|---|---|---|
| `api/dogApi.ts` | הפנייה היחידה לרשת. מחזירה מידע מוכן או זורקת שגיאה | `utils`, `types` |
| `utils/` | פונקציות טהורות, בלי React ובלי רשת | `types` |
| `hooks/useFavorites.ts` | state של המועדפים + `localStorage` | `utils` |
| `components/` | תצוגה בלבד. מקבלים מידע ופונקציות ב-props | `types`, `utils` |
| `pages/` | עמוד לכל כתובת. מחזיקים state של העמוד ומושכים מידע לעמוד | כולם |
| `App.tsx` | state משותף לכמה עמודים, והגדרת הכתובות | כולם |

## עץ הרכיבים

```
App  ── state: breeds, isLoading, error · favorites (useFavorites)
├── NavBar(favoritesCount)
└── Routes
    ├── "/"            BreedsPage(breeds) ── state: query, onlyWithSubBreeds
    │                  ├── SearchBar(query, onQueryChange, onlyWithSubBreeds, onOnlyWithSubBreedsChange)
    │                  └── BreedList(visibleBreeds) → BreedCard(breed)
    ├── "/breeds/:id"  BreedDetailPage(breeds, isFavorite, onToggleFavorite) ── state: result (תמונות)
    │                  ├── FavoriteButton(isFavorite, onToggle)
    │                  └── Loader | ErrorMessage | ImageGallery(images, breedName)
    ├── "/favorites"   FavoritesPage(breeds, favoriteIds, onRemove)
    │                  └── BreedList(favoriteBreeds, onRemove) → BreedCard(breed, onRemove)
    ├── "/quiz"        QuizPage(breeds) ── state: round, result, selectedId, score
    │                  └── QuizOptions(options, correctId, selectedId, onSelect)
    └── "*"            NotFoundPage
```

`NavBar` נמצא מחוץ ל-`Routes`, ולכן הוא מופיע בכל עמוד. בזמן הטעינה הראשונה, או אם היא נכשלה, `App` מציג `Loader` או `ErrorMessage` במקום `Routes`.

## איפה כל state, ולמה

| state | איפה | למה שם |
|---|---|---|
| `breeds`, `isLoading`, `error` | `App` | כל העמודים צריכים את רשימת הגזעים. כך היא נמשכת פעם אחת |
| `favoriteIds` | `App` (דרך `useFavorites`) | שלושה חלקים צריכים אותו: עמוד הפרטים, עמוד המועדפים והתפריט |
| `query`, `onlyWithSubBreeds` | `BreedsPage` | רק עמוד הרשימה משתמש בהם |
| `result` (תמונות) | `BreedDetailPage` | שייך לגזע שבעמוד בלבד |
| `round`, `result`, `selectedId`, `score` | `QuizPage` | שייכים לחידון בלבד |

**כלל אצבע:** state נמצא ברכיב הכי נמוך שכל מי שצריך אותו נמצא מתחתיו. מה שאפשר לחשב לא נשמר ב-state: `visibleBreeds`, ‏`favoriteBreeds` ו-`isLoading` של התמונות והחידון.

## זרימת המידע

**מלמעלה למטה, ב-props:** `App` → עמוד → רכיב. רכיב-ילד לא משנה מידע של ההורה ישירות.

**מלמטה למעלה, בפונקציות:** ההורה מעביר פונקציה (`onQueryChange`, ‏`onToggle`, ‏`onRemove`, ‏`onSelect`), והילד קורא לה כשמשהו קורה.

### טעינת הגזעים, מרגע הפתיחה
1. `App` עולה עם `isLoading = true`, ולכן מוצג `Loader`.
2. `useEffect(..., [])` קורא ל-`fetchBreeds()`.
3. `fetchBreeds` שולח `fetch`, בודק את `response.ok`, ממיר מ-JSON וקורא ל-`toBreeds()`.
4. `.then` מעדכן את `breeds`, ו-`.finally` מעדכן את `isLoading = false`. כשל עובר ל-`.catch`, שמעדכן את `error`.
5. React מצייר מחדש, ומופיעים ה-`Routes` עם המידע.

### לחיצה על גזע
1. `BreedCard` הוא `Link` לכתובת `/breeds/hound`, והכתובת משתנה בלי טעינה מחדש.
2. `Routes` מתאים את הכתובת ל-`/breeds/:id` ומציג את `BreedDetailPage`.
3. `useParams()` מחזיר `{ id: 'hound' }`, ו-`breeds.find(...)` מוצא את הגזע.
4. `useEffect(..., [breedId])` קורא ל-`fetchBreedImages`. לבקשה מוצמד `AbortController`, שמבטל אותה ביציאה מהעמוד.
5. עד שמגיעה תוצאה לגזע הזה מוצג `Loader`, ואחר כך `ImageGallery`.

### הוספה למועדפים
1. לחיצה על `FavoriteButton` קוראת ל-`onToggle`, כלומר ל-`favorites.toggle('hound')` ב-`App`.
2. `toggleFavorite` מחזיר מערך חדש, ו-`setFavoriteIds` מעדכן את ה-state.
3. `useEffect(..., [favoriteIds])` שומר את הרשימה ב-`localStorage` עם `JSON.stringify`.
4. React מצייר מחדש: הכפתור הופך צהוב, ו-`NavBar` מציג "Favorites (1)".

## בדיקות

הלוגיקה מופרדת לפונקציות טהורות ב-`utils/` וב-`api/`, ולכן אפשר לבדוק אותה בלי דפדפן ובלי רשת. ב-`api/dogApi.test.ts` מחליפים את `fetch` בפונקציה מזויפת (`vi.stubGlobal`).
