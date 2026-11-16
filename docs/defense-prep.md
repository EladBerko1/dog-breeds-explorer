# הכנה להגנה — Dog Breeds Explorer

מסמך לימוד אישי לקראת ההגנה על הפרויקט. מתעדכן אחרי כל משימה.
**מצב נוכחי:** משימות 1–9 הושלמו (רשימה, ניתוב, API, בדיקות, גלריית תמונות, חיפוש וסינון, מועדפים, חידון, 404). עוד לא נבנו: עיצוב, README.

**מה ההגנה בודקת:** כ-7 דקות של שאלות על הקוד שלי, בלי סוכן ובלי חיפוש. המרצה עשוי לבקש לפתוח קובץ ולהראות איפה משהו קורה. הנקודות על הפרויקט ניתנות רק אם אני יודע להסביר אותו.

---

## 1. מה האפליקציה עושה, במשפט אחד
אפליקציית master-detail לגזעי כלבים: רשימה של כל הגזעים מה-API של Dog CEO, ולחיצה על גזע פותחת עמוד פרטים עם כתובת משלו (למשל `/breeds/hound`).

**הטכנולוגיות:** React + Vite + TypeScript, ניתוב עם React Router, בדיקות עם Vitest. בלי שרת ובלי בסיס נתונים.

---

## 2. מפת הקבצים

| קובץ | תפקיד |
|---|---|
| `index.html` | קובץ ה-HTML היחיד. יש בו `<div id="root">` ריק, ש-React ממלא |
| `src/main.tsx` | נקודת הכניסה: טוען את ה-CSS, עוטף ב-`BrowserRouter` ומצייר את `App` |
| `src/App.tsx` | מחזיק את ה-state של הגזעים, מושך מה-API, ומגדיר את הכתובות |
| `src/types.ts` | הטיפוסים: `Breed`, `BreedsApiResponse`, `BreedImagesApiResponse` |
| `src/api/dogApi.ts` | כל הפנייה ל-API: `fetchBreeds()`, `fetchBreedImages()`, `fetchRandomImage()` |
| `src/utils/breeds.ts` | לוגיקה טהורה: `toBreeds()`, `formatBreedName()`, `filterBreeds()` |
| `src/utils/favorites.ts` | לוגיקה טהורה של המועדפים: `toggleFavorite()`, `parseFavorites()` |
| `src/utils/quiz.ts` | לוגיקה טהורה של החידון: `getBreedIdFromImageUrl()`, `shuffle()`, `buildAnswerOptions()` |
| `src/hooks/useFavorites.ts` | custom hook: state של המועדפים + שמירה ב-`localStorage` |
| `src/components/` | רכיבים: `NavBar`, `BreedList`, `BreedCard`, `Loader`, `ErrorMessage`, `ImageGallery`, `SearchBar`, `FavoriteButton`, `QuizOptions` |
| `src/pages/` | עמודים: `BreedsPage`, `BreedDetailPage`, `FavoritesPage`, `QuizPage`, `NotFoundPage` |
| `src/index.css` | כל ה-CSS |
| `*.test.ts` | בדיקות Vitest |

**עמוד מול רכיב:** עמוד (`pages/`) הוא מה שמוצג בכתובת מסוימת. רכיב (`components/`) הוא חלק שאפשר לשים בתוך עמודים.

---

## 3. איך HTML, CSS ו-React מתחברים

- **HTML** נותן מקום ריק אחד: `<div id="root"></div>` ב-`index.html`.
- **React** מייצר את כל התוכן מתוך הקומפוננטות ומכניס אותו ל-`root`.
- **CSS** מעצב את ה-HTML ש-React יצר, לפי שמות המחלקות.

**החיבור בין React ל-CSS הוא `className`:**
```tsx
<li className="breed-card">   // ב-React (TSX)
<li class="breed-card">       // מה שמגיע לדפדפן
.breed-card { ... }           // ה-CSS שמעצב אותו
```
ב-React כותבים `className` ולא `class`, כי `class` היא מילה שמורה ב-JavaScript.

**SPA (Single Page Application):** יש דף HTML אחד בלבד. כשעוברים "עמוד", הדפדפן לא טוען קובץ חדש — React מחליף את התוכן בתוך `root`.

**דפדפן לא מבין TypeScript.** Vite ממיר את הקוד ל-JavaScript רגיל. `npm run build` מריץ קודם את `tsc` (בדיקת טיפוסים) ואז יוצר תיקיית `dist`.

---

## 4. עץ הרכיבים וזרימת המידע

```
App  (מחזיק: breeds, isLoading, error, ו-favorites דרך useFavorites)
├── NavBar(favoritesCount)
└── Routes
    ├── "/"           → BreedsPage(breeds)  (מחזיק: query, onlyWithSubBreeds)
    │                    ├── SearchBar(query, onQueryChange, ...)
    │                    └── BreedList(visibleBreeds) → BreedCard(breed) × עד 108
    ├── "/breeds/:id" → BreedDetailPage(breeds, isFavorite, onToggleFavorite)  (מחזיק: result של התמונות)
    │                    ├── FavoriteButton(isFavorite, onToggle)
    │                    └── Loader / ErrorMessage / ImageGallery(images, breedName)
    ├── "/favorites"  → FavoritesPage(breeds, favoriteIds, onRemove)
    │                    └── BreedList(favoriteBreeds, onRemove) → BreedCard(breed, onRemove)
    ├── "/quiz"       → QuizPage(breeds)  (מחזיק: round, result, selectedId, score)
    │                    └── QuizOptions(options, correctId, selectedId, onSelect)
    └── "*"           → NotFoundPage
```

**המידע זורם מלמעלה למטה דרך props.** `App` מעביר את `breeds` לעמודים, `BreedsPage` מעביר ל-`BreedList`, ו-`BreedList` נותן לכל `BreedCard` גזע אחד.

**props:** מידע שרכיב מקבל מההורה שלו. הרכיב לא משנה אותו.
**state:** מידע שהרכיב מחזיק בעצמו ויכול לשנות. כשהוא משתנה, React מצייר מחדש.

---

## 5. TypeScript

**מה הופך קוד ל-TypeScript:** סיומת `.ts` או `.tsx`, ותוספות של טיפוסים.

```ts
export interface Breed {
  id: string
  name: string
  subBreeds: string[]
}
```

**props עם טיפוס:**
```tsx
interface BreedCardProps {
  breed: Breed
}
function BreedCard({ breed }: BreedCardProps) { ... }
```

**מה זה נותן:** טעויות מתגלות לפני שמריצים. `breed.nme` (שגיאת כתיב) → שגיאה בעורך, ו-`npm run build` נכשל. בלי TypeScript זה היה מציג ריק בשקט.

**`interface` לעומת `class` ב-Java:**
- `interface` רק **מתאר צורה** של אובייקט. הוא לא יוצר אובייקטים, אין בנאי ואין `new`.
- הוא **נמחק** אחרי הקומפילציה ולא קיים בזמן ריצה.
- התאמה נקבעת **לפי הצורה** (structural typing): כל אובייקט עם השדות הנכונים נחשב `Breed`.
- שדה עם `?` הוא רשות (`origin?: string`). בלי `?` הוא חובה.

**משפט להגנה:** "`interface` מתאר את הצורה של אובייקט. הוא לא יוצר אובייקטים, ונמחק אחרי הקומפילציה."

**`Record<string, string[]>`:** אובייקט שהמפתחות שלו הם טקסט והערכים הם מערכים של טקסט. זו בדיוק הצורה של `message` מה-API.

**למה אסור `any`:** `any` אומר ל-TypeScript "אל תבדוק כלום", ואז חוזרים למצב של JavaScript. בהנחיות זה מוריד ציון.

**חשוב:** TypeScript לא יודע מה ה-API באמת מחזיר. `BreedsApiResponse` הוא **הצהרה** שלנו על הצורה הצפויה. בזמן ריצה הטיפוס לא בודק כלום — לכן ב-`fetchBreeds` בודקים בעצמנו את `status`.

---

## 6. ניתוב עם React Router

| חלק | איפה | מה הוא עושה |
|---|---|---|
| `BrowserRouter` | `main.tsx` | עוטף את כל האפליקציה ועוקב אחרי הכתובת |
| `Routes` + `Route` | `App.tsx` | "אם הכתובת היא X — תציג את רכיב Y" |
| `:id` | `/breeds/:id` | מקום שמתמלא: `/breeds/hound`, `/breeds/poodle`... שורה אחת לכל הגזעים |
| `Link` | `BreedCard.tsx` | מעבר בין עמודים בלי טעינה מחדש של האתר |
| `NavLink` | `NavBar.tsx` | כמו `Link`, ומוסיף מחלקה `active` לקישור של העמוד הנוכחי |
| `useParams` | `BreedDetailPage.tsx` | קורא את החלק המשתנה מהכתובת |

**`Link` לעומת `<a>`:** `<a>` טוען את כל האתר מחדש, וכל ה-state נמחק (כולל הגזעים שכבר נמשכו). `Link` רק מחליף את התוכן.

**למה `NavBar` נשאר בכל עמוד:** הוא נמצא ב-`App` **מחוץ** ל-`Routes`.

**מה `end` עושה ב-`<NavLink to="/" end>`:** בלי `end`, קישור מסומן כפעיל גם בכתובות שמתחתיו. למשל `<NavLink to="/favorites">` היה פעיל גם ב-`/favorites/123`. עם `end` הוא פעיל רק בכתובת המדויקת. בקישור `/` זה לא משנה בפועל, כי React Router כבר מטפל בו כך, אבל `end` מבהיר את הכוונה.

### עמוד 404 וגזע שלא קיים

**שני מקרים שונים:**

| כתובת | מה קורה | איפה בקוד |
|---|---|---|
| `/abc` | אף `Route` לא מתאים → `path="*"` תופס → `NotFoundPage` | `App.tsx` |
| `/breeds/xyz` | **מתאים** ל-`/breeds/:id`, אבל `find` לא מוצא גזע → "Breed not found" | `BreedDetailPage.tsx` |

- `path="*"` = "כל כתובת". React Router בוחר את ה-`Route` **הכי ספציפי** שמתאים, ולכן `*` נבחר רק כשאף כתובת אחרת לא מתאימה.
- `/breeds/xyz` לא מגיע ל-404, כי מבחינת הניתוב הוא תקין — `:id` מקבל כל ערך. רק העמוד יודע שאין גזע כזה.
- `useLocation()` מחזיר את הכתובת הנוכחית. `location.pathname` = `"/abc"`, ומציגים אותו למשתמש.
- **למה זה עובד גם ברענון:** שרת הפיתוח של Vite מחזיר את `index.html` לכל כתובת, ו-React Router מחליט מה להציג.

### שאלה צפויה: מה קורה מהלחיצה על פריט ועד שהפרטים מופיעים?
1. לוחצים על הכרטיס של Hound. הכרטיס הוא `Link` עם `to={`/breeds/${breed.id}`}`.
2. הכתובת משתנה ל-`/breeds/hound`, בלי טעינה מחדש.
3. `Routes` רואה שהכתובת מתאימה ל-`/breeds/:id` ומציג את `BreedDetailPage`.
4. `useParams()` מחזיר `{ id: 'hound' }`.
5. `breeds.find((item) => item.id === id)` מוצא את הגזע ברשימה שקיבלנו ב-props.
6. העמוד מציג את השם ותתי-הגזעים. אם לא נמצא גזע — "Breed not found".

**למה המידע נלקח מהכתובת ולא מועבר בלחיצה?** כדי שגם כניסה ישירה לקישור, או רענון, יעבדו — גם בלי ללחוץ על שום כרטיס.

---

## 7. רשימות ו-`key`

```tsx
{breeds.map((breed) => (
  <BreedCard key={breed.id} breed={breed} />
))}
```

- `map` הופך מערך של נתונים למערך של רכיבים.
- `key` עוזר ל-React לזהות כל פריט בין ציור לציור.
- **למה `breed.id` ולא האינדקס:** ה-`id` ייחודי ויציב. כשהרשימה תסונן בחיפוש, האינדקסים ישתנו, ו-React עלול לבלבל בין פריטים.

---

## 8. ה-API

**Dog CEO** — `https://dog.ceo/api`. ציבורי, חינמי, בלי מפתח. מופיע ברשימת ה-APIs בהנחיות (רעיון מס' 7).

**התשובה מ-`/breeds/list/all`:**
```json
{ "message": { "beagle": [], "hound": ["afghan", "basset"] }, "status": "success" }
```
- היא **אובייקט**, לא מערך, ואין בה שדה `id`.
- לכן `toBreeds()` הופכת אותה למערך `Breed[]`, ו**שם הגזע משמש כ-`id`** (ייחודי, ומתאים לכתובת).
- `Object.entries()` הופך אובייקט למערך של זוגות `[מפתח, ערך]`, ועליו עושים `map`.

**כמה גזעים:** 108.

---

## 9. `fetch`, Promise, `async` ו-`await`

**סינכרוני:** כל שורה מחכה שהקודמת תסתיים.
**אסינכרוני:** מתחילים פעולה ארוכה, ממשיכים לעבוד, וחוזרים כשהתוצאה מוכנה.

**למה זה חשוב:** ב-JavaScript יש thread אחד, שאחראי גם על הלחיצות והציור של המסך. אם הבקשה לשרת הייתה סינכרונית, כל האתר היה קופא.

**`fetch`:** פונקציה שה**דפדפן** מספק (לא חלק משפת JavaScript עצמה). היא שולחת בקשה ומחזירה **Promise**.

**Promise:** "הבטחה" שהתשובה תגיע בהמשך — כמו זמזם בדוכן אוכל.

**שני שלבים — `fetch` לא מחזיר JSON ישירות:**
```ts
const response = await fetch(url)                 // 1. ה"חבילה": Response עם סטטוס
if (!response.ok) throw new Error(...)            //    בודקים אם השרת החזיר הצלחה
const data: BreedsApiResponse = await response.json()  // 2. "פותחים": אובייקט JS
```

**`await`:** "הפונקציה הזאת מחכה כאן עד שהתשובה מגיעה". רק הפונקציה מחכה — שאר האתר ממשיך לעבוד.

**למה `await` רק בתוך `async`:** פונקציה שעוצרת באמצע לא יכולה להחזיר תשובה מיד. `async` מסמן שהפונקציה **תמיד מחזירה Promise**. לכן הטיפוס של `fetchBreeds` הוא `Promise<Breed[]>` ולא `Breed[]`.

**למה צריך לבדוק `response.ok`:** `fetch` נכשל רק כשאין חיבור לרשת בכלל. תשובה כמו 404 או 500 נחשבת אצלו "הצלחה", כי התקבלה תשובה. לכן בודקים בעצמנו.

---

## 10. `useEffect` ושלושת המצבים (ב-`App.tsx`)

**שלושה ערכי state:**
```ts
const [breeds, setBreeds] = useState<Breed[]>([])
const [isLoading, setIsLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
```

**`useEffect(() => { ... }, [])`:** קוד שרץ **אחרי** שהרכיב מופיע על המסך. המערך הריק `[]` = בלי תלויות = רץ פעם אחת.

**שלושה מצבים על המסך:**
- `isLoading` → `<Loader />` ("Loading breeds…")
- `error` → `<ErrorMessage />`
- אחרת → `<Routes>` עם המידע

**למה ה-state ב-`App` ולא בעמוד?** גם עמוד הרשימה וגם עמוד הפרטים צריכים את הגזעים. ב-`App` המשיכה מה-API קורה פעם אחת, ושני העמודים מקבלים אותה ב-props.

**למה `.then()` ולא `await` בתוך `useEffect`?** פונקציה `async` תמיד מחזירה Promise. React מצפה שהפונקציה של `useEffect` תחזיר פונקציית ניקוי או כלום. לכן אי אפשר `useEffect(async () => ...)`.

**`ignore` ופונקציית הניקוי:**
```ts
let ignore = false
fetchBreeds().then((data) => { if (!ignore) setBreeds(data) })
return () => { ignore = true }
```
אם הרכיב יורד מהמסך לפני שהתשובה הגיעה, לא מעדכנים state של רכיב שכבר לא קיים. ב-`StrictMode` (בפיתוח בלבד) React מריץ את ה-effect פעמיים בכוונה — והבדיקה הזאת מונעת עדכון כפול.

**הסיפור המלא מרגע הפתיחה:**
1. `App` עולה. `isLoading` הוא `true` → רואים "Loading…".
2. `useEffect` קורא ל-`fetchBreeds()` ומקבל Promise.
3. בזמן ההמתנה האתר חי: התפריט עובד וההודעה מוצגת.
4. התשובה מגיעה → `toBreeds()` ממיר → `.then` מעדכן `breeds` → `.finally` מעדכן `isLoading` ל-`false`.
5. React מצייר מחדש → מופיעה הרשימה.
6. אם נכשל → `.catch` מעדכן `error` → מופיעה הודעת שגיאה.

**איך מראים את זה:** F12 ← Network ← רענון → בקשה בשם `all`. מצב Offline → הודעת השגיאה.

---

## 10א. גלריית התמונות בעמוד הפרטים (`BreedDetailPage.tsx`)

**מה קורה:** העמוד מוצא את הגזע מהכתובת, ואז מושך עד 12 תמונות מ-`/breed/{breed}/images` ומציג אותן ב-`ImageGallery`.

**למה ה-state של התמונות בעמוד ולא ב-`App`:** רק העמוד הזה צריך אותן. state שמשמש רק רכיב אחד נשאר אצלו. (הגזעים ב-`App`, כי שני עמודים צריכים אותם.)

**`useEffect` עם תלות:** `[breedId]` = ה-effect רץ מחדש בכל פעם שהגזע משתנה. בהשוואה ל-`[]` ב-`App`, שרץ פעם אחת בלבד.

**ה-hooks לפני ה-`return` המוקדם:** `useState` ו-`useEffect` חייבים להיקרא בכל ציור, באותו סדר. לכן הם נמצאים **לפני** `if (!breed) return <p>Breed not found.</p>`. זה כלל של React ("Rules of Hooks").

**התוצאה זוכרת לאיזה גזע היא שייכת:**
```ts
interface GalleryResult { breedId: string; images: string[]; error: string | null }
const isLoading = result === null || result.breedId !== breed.id
```
אין `isLoading` נפרד ב-state — הוא **מחושב**: אם התוצאה לא שייכת לגזע הנוכחי, עדיין טוענים. כך לא מוצגות לרגע תמונות של הגזע הקודם, ולא צריך לקרוא ל-`setState` בתוך ה-effect (React ממליץ להימנע מזה).

**`AbortController` — ביטול בקשה:**
```ts
const controller = new AbortController()
fetchBreedImages(breedId, 12, controller.signal)
return () => { controller.abort() }
```
- `controller.signal` מועבר ל-`fetch`, ו-`controller.abort()` מבטל את הבקשה באמצע.
- בפונקציית הניקוי מבטלים — כך תשובה ישנה לא תעדכן את המסך אחרי שעברנו גזע או יצאנו מהעמוד.
- בקשה שבוטלה נכשלת, אבל זו לא שגיאה אמיתית, ולכן ב-`catch` בודקים `controller.signal.aborted` ולא מציגים הודעה.
- **בפיתוח (`npm run dev`) רואים ב-Network בקשת תמונות אחת מבוטלת (canceled) בכל כניסה לעמוד.** זה תקין: `StrictMode` מריץ את ה-effect פעמיים בכוונה, והניקוי מבטל את הראשונה. ב-`npm run build` זה לא קורה.

**`ignore` (ב-`App`) לעומת `AbortController` (בעמוד הפרטים):**

| | `ignore` | `AbortController` |
|---|---|---|
| מה קורה לבקשה | ממשיכה עד הסוף | **מבוטלת** באמת |
| מה קורה לתשובה | מתעלמים ממנה | לא מגיעה בכלל |
| מתי מתאים | בקשה שרצה פעם אחת | בקשה שמתחלפת (גזע אחר) |

שתי הדרכים פותרות את אותה בעיה. בעמוד הפרטים בחרתי ב-`AbortController`, כי שם הבקשה מתחלפת כשעוברים בין גזעים (וגם כי ה-linter הזהיר על `ignore` בקובץ הזה).

**`ImageGallery`:**
- `key={url}` — כתובת כל תמונה ייחודית.
- `alt` — טקסט חלופי לנגישות ולמקרה שהתמונה לא נטענת.
- `loading="lazy"` — הדפדפן טוען תמונה רק כשהיא מתקרבת למסך.
- אם אין תמונות → "No photos for this breed yet."

**`slice(0, limit)`:** לגזע יכולות להיות מאות תמונות. `slice` מחזיר עותק עם `limit` הראשונות (ברירת מחדל 12), בלי לשנות את המערך המקורי.

---

## 10ב. חיפוש וסינון (`BreedsPage.tsx`, `SearchBar.tsx`, `filterBreeds`)

**מה המשתמש עושה:** מקליד בשדה חיפוש, ויכול לסמן "Only breeds with sub-breeds". מתחת מופיע "Showing X of 108 breeds".

**איפה ה-state:** ב-`BreedsPage` — `query` ו-`onlyWithSubBreeds`. רק עמוד הרשימה צריך אותם.

**הרשימה המסוננת לא נשמרת ב-state:**
```ts
const visibleBreeds = filterBreeds(breeds, query, onlyWithSubBreeds)
```
היא **מחושבת** בכל ציור מתוך `breeds` והחיפוש. אם הייתי שומר אותה ב-state, היו שני מקורות לאותו מידע, והם עלולים לצאת מסנכרון. כלל אצבע: מה שאפשר לחשב — לא שומרים ב-state.

**`SearchBar` הוא controlled component:**
- הוא **לא מחזיק state**. הערך מגיע מההורה: `value={query}`.
- כל הקלדה מדווחת להורה: `onChange={(event) => onQueryChange(event.target.value)}`.
- ההורה מעדכן את ה-state → React מצייר מחדש → השדה מציג את הערך החדש והרשימה מתעדכנת.
- כך **מעבירים פונקציה ב-props** — זו הדרך של רכיב-ילד "לדבר" עם ההורה.
- בצ'קבוקס: `checked` ו-`event.target.checked` (במקום `value`).

**הזרימה בהקלדה של "bull":**
1. המשתמש מקליד → `onChange` ב-`SearchBar`.
2. `onQueryChange('bull')` = `setQuery('bull')` ב-`BreedsPage`.
3. `BreedsPage` מצויר מחדש → `filterBreeds` מחזיר 3 גזעים.
4. `BreedList` מקבל את 3 הגזעים → מציג 3 כרטיסים.

**`filterBreeds` — פונקציה טהורה:**
```ts
const search = query.trim().toLowerCase()
return breeds.filter((breed) => {
  const matchesSearch = breed.id.includes(search)
  const matchesSubBreeds = !onlyWithSubBreeds || breed.subBreeds.length > 0
  return matchesSearch && matchesSubBreeds
})
```
- `trim()` מסיר רווחים בהתחלה ובסוף, `toLowerCase()` — לא רגיש לאותיות גדולות.
- מחפשים ב-`breed.id` כי הוא תמיד באותיות קטנות (כמו ב-API).
- `!onlyWithSubBreeds || ...` = "אם הצ'קבוקס כבוי — כל גזע עובר; אם דלוק — רק עם תתי-גזעים".
- `filter` מחזיר מערך **חדש** ולא משנה את המקורי.
- **למה בקובץ נפרד (`utils`) ולא בתוך הרכיב:** כך אפשר לבדוק אותה ב-Vitest בלי React.

**ה-`key` עובד כאן:** כשהרשימה מסוננת, הכרטיסים משנים מקום. בגלל `key={breed.id}` React יודע איזה כרטיס הוא איזה.

**התנהגות שכדאי להכיר:** חיפוש → כניסה לגזע → חזרה = החיפוש מתאפס. כי `BreedsPage` יורד מהמסך כשעוברים עמוד, וה-state שלו נמחק. **אם ישאלו "איך היית שומר את החיפוש?"** — להעביר את ה-state ל-`App`, או לשמור אותו בכתובת (`/?q=bull`) עם `useSearchParams` של React Router.

**נתונים:** 42 מתוך 108 גזעים יש להם תתי-גזעים.

---

## 10ג. מועדפים ו-`localStorage` (העמוד הנוסף הראשון)

**מה המשתמש עושה:** בעמוד גזע לוחץ "☆ Add to favorites" (הכפתור הופך ל-"★ Remove from favorites"). בתפריט מופיע "Favorites (2)". בעמוד `/favorites` רואה את הגזעים שסימן, נכנס אליהם, או לוחץ "Remove". הכול נשאר גם אחרי רענון.

**איפה ה-state ולמה ב-`App`:** שלושה חלקים צריכים את המועדפים — עמוד הפרטים (הכפתור), עמוד המועדפים (הרשימה) והתפריט (המספר). כשכמה רכיבים צריכים אותו מידע, מעלים אותו להורה המשותף הקרוב ("lifting state up"). ההורה המשותף של שלושתם הוא `App`.

**מה נשמר:** רק **מזהים** — `["beagle", "hound"]`. לא שומרים את הגזעים המלאים, כי הם כבר מגיעים מה-API. `FavoritesPage` מוצא את הגזעים לפי המזהים:
```ts
const favoriteBreeds = breeds.filter((breed) => favoriteIds.includes(breed.id))
```

**`localStorage`:**
- אחסון של הדפדפן, שנשאר גם אחרי רענון וסגירה. כל אתר מקבל אחסון משלו.
- שומר **רק טקסט**. לכן `JSON.stringify(favoriteIds)` בשמירה, ו-`JSON.parse` בקריאה.
- איך רואים: F12 ← Application ← Local Storage ← `http://localhost:5173` ← המפתח `dog-breeds-favorites`.

**Custom hook (`useFavorites`):**
- פונקציה שהשם שלה מתחיל ב-`use` ומשתמשת ב-hooks אחרים (`useState`, `useEffect`).
- היא אורזת את כל הלוגיקה של המועדפים במקום אחד, ומחזירה `{ favoriteIds, isFavorite, toggle }`.
- `App` רק קורא `const favorites = useFavorites()`, בלי לדעת איך זה נשמר.

**קריאה פעם אחת — lazy initial state:**
```ts
const [favoriteIds, setFavoriteIds] = useState<string[]>(() => parseFavorites(localStorage.getItem(STORAGE_KEY)))
```
כשמעבירים ל-`useState` **פונקציה**, React מריץ אותה רק בציור הראשון. כך לא קוראים מ-`localStorage` בכל ציור.

**שמירה בכל שינוי:**
```ts
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds))
}, [favoriteIds])
```
`useEffect` מתאים כאן כי זה **סנכרון עם מערכת חיצונית** (האחסון של הדפדפן) — בדיוק מה ש-effect נועד לו.

**`setFavoriteIds((current) => toggleFavorite(current, breedId))`:** מעבירים ל-set **פונקציה** שמקבלת את הערך העדכני. כך גם שתי לחיצות מהירות מחושבות נכון.

**`toggleFavorite` מחזיר מערך חדש ולא משנה את הישן:** `[...favoriteIds, breedId]` (הוספה) ו-`filter` (הסרה). React מזהה שינוי לפי **הפניה חדשה**. אם הייתי עושה `push` על המערך הקיים, React לא היה רואה שינוי ולא היה מצייר מחדש.

**`parseFavorites` — הגנה מטקסט פגום:** ב-`localStorage` יכול להיות כל דבר (המשתמש יכול לערוך אותו ב-DevTools). אם `JSON.parse` נכשל או שהתוצאה לא מערך של מחרוזות — מחזירים `[]` במקום לקרוס. `unknown` (ולא `any`) מכריח לבדוק את הסוג לפני שמשתמשים בערך.

**`try/catch` סביב `localStorage`:** בגלישה פרטית או כשהאחסון חסום, הגישה יכולה לזרוק שגיאה. אז האפליקציה ממשיכה לעבוד, רק בלי שמירה.

**prop אופציונלי `onRemove?`:** ב-`BreedList` וב-`BreedCard`. בעמוד הרשימה לא מעבירים אותו — אין כפתור. בעמוד המועדפים מעבירים — מופיע "Remove". `{onRemove && (<button ...>)}` = "הצג רק אם יש פונקציה". כך **אותו רכיב** משמש בשני עמודים.

**`aria-pressed`:** אומר לקורא מסך שהכפתור במצב "לחוץ" (מועדף). אותו מאפיין משמש גם ב-CSS לצבע הצהוב.

---

## 10ד. החידון "Guess the Breed" (העמוד הנוסף השני)

**מה המשתמש עושה:** רואה תמונה של כלב אקראי, בוחר מבין 4 גזעים. אחרי הבחירה: התשובה הנכונה בירוק, בחירה שגויה באדום, הודעה "Correct!" או "Not quite — it's a X", והניקוד מתעדכן ("Score: 2 / 3"). "Next question →" מביא כלב חדש.

**מאיפה התמונה:** `/breeds/image/random` מחזיר כתובת אחת, למשל:
`https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg`

**איך יודעים מה התשובה הנכונה:** שם הגזע **נמצא בתוך הכתובת**. `getBreedIdFromImageUrl`:
```ts
const match = url.match(//breeds/([^/]+)//)   // תופס את מה שבין /breeds/ ל-/ הבא → "hound-afghan"
return match[1].split('-')[0]                      // החלק שלפני המקף → "hound"
```
- **regex** (ביטוי רגולרי): `([^/]+)` = "תפוס כמה שיותר תווים שאינם /". הסוגריים שומרים את מה שנתפס ב-`match[1]`.
- לוקחים את **הגזע הראשי** (לפני המקף), כי הוא ה-`id` ברשימת הגזעים שלנו.
- אם הכתובת לא בפורמט — מחזירים `null`, וב-`QuizPage` זה הופך לשגיאה.
- בדקתי על 20 תמונות אקראיות: כל הגזעים שחולצו קיימים ברשימה.

**איך בונים את 4 התשובות (`buildAnswerOptions`):**
1. מכל הגזעים, מוציאים את התשובה הנכונה.
2. מערבבים ולוקחים 3 → תשובות שגויות **שונות**.
3. מוסיפים את הנכונה ומערבבים שוב → הנכונה לא תמיד במקום הראשון.

**`shuffle` — אלגוריתם Fisher–Yates:** עוברים מהסוף להתחלה, ומחליפים כל פריט עם פריט אקראי שלפניו (או איתו). זה ערבוב הוגן — לכל סדר אותו סיכוי. מחזירים **עותק** (`[...items]`) ולא משנים את המקור.

**`random` כפרמטר:** ברירת המחדל היא `Math.random`, אבל אפשר להעביר פונקציה אחרת. זה מאפשר בבדיקות לקבל תוצאה קבועה. (הבדיקות שלנו בודקות תכונות שתמיד נכונות — 4 תשובות, שונות, כולל הנכונה — ולכן לא צריכות את זה.)

**Generic `<T>`:** `shuffle<T>(items: T[]): T[]` עובד על מערך מכל סוג — מחרוזות, מספרים, גזעים — ומחזיר מערך מאותו סוג.

**ה-state ב-`QuizPage`:**
| state | מה הוא |
|---|---|
| `round` | מספר הסיבוב. "Next question" מגדיל אותו |
| `result` | השאלה של הסיבוב (תמונה, תשובה נכונה, אפשרויות) או שגיאה, **עם מספר הסיבוב שלה** |
| `selectedId` | מה המשתמש בחר (`null` = עוד לא ענה) |
| `score` | `{ correct, answered }` |

**`round` כ"טריגר":** ה-`useEffect` תלוי ב-`[round, breeds]`. כשלוחצים "Next question" → `setRound(current => current + 1)` → ה-effect רץ שוב → כלב חדש. זו דרך לבקש מ-effect לרוץ שוב בתגובה לפעולה של המשתמש.

**טעינה מחושבת, כמו בגלריה:** `isLoading = result === null || result.round !== round`. אחרי "Next", `round` כבר גדל אבל `result` עדיין של הסיבוב הקודם → טוען.

**`throw` בתוך `.then`:** אם הכתובת לא בפורמט, `throw new Error(...)` בתוך `.then` מעביר ישר ל-`.catch`. כך כל סוגי הכשלים מטופלים במקום אחד.

**`QuizOptions` — רכיב בלי state:** מקבל `options`, `correctId`, `selectedId` ו-`onSelect`, ומחליט על הצבע של כל כפתור:
- עוד לא ענו → כל הכפתורים רגילים ולחיצים.
- ענו → הנכונה `correct` (ירוק), הבחירה השגויה `wrong` (אדום), כולם `disabled`.

**`handleSelect` מגן מלחיצה כפולה:** `if (selectedId !== null ...) return` — אי אפשר לענות פעמיים על אותה שאלה ולקבל ניקוד כפול.

**הניקוד מתאפס כשעוזבים את העמוד:** הוא state של `QuizPage`, שיורד מהמסך. (אם ישאלו איך לשמור — להעלות ל-`App` או ל-`localStorage`, כמו המועדפים.)

---

## 11. בדיקות עם Vitest

**הפקודות:**
- `npm test` → `vitest run` — מריץ פעם אחת ויוצא.
- `npm run test:ui` → `vitest --ui` — מציג את הבדיקות בדפדפן.

**27 בדיקות, בארבעה קבצים:**

`src/utils/breeds.test.ts` (10):
1. `formatBreedName('hound')` → `'Hound'`
2. `formatBreedName('')` → `''`
3. `toBreeds` הופך `{ beagle: [], bulldog: [...] }` למערך עם `id`, `name`, `subBreeds`
4. ה-`id` נשאר `'hound'` (בלי פירמוט), וה-`name` הוא `'Hound'`
5. `toBreeds({})` → `[]`
- `filterBreeds`: חיפוש ריק → הכול · "bull" → bulldog, bullterrier, pitbull · "  BEA " → beagle (רווחים ואותיות גדולות) · "bull" + צ'קבוקס → בלי pitbull · "cat" → `[]`

`src/utils/favorites.test.ts` (6):
- `toggleFavorite`: מוסיף גזע חדש · מסיר גזע קיים · לא משנה את המערך המקורי
- `parseFavorites`: קורא רשימה שמורה · `null` → `[]` · טקסט פגום (לא JSON, או אובייקט) → `[]`

`src/utils/quiz.test.ts` (7):
- `getBreedIdFromImageUrl`: "labrador" מכתובת רגילה · "hound" מכתובת עם תת-גזע (`hound-afghan`) · `null` לכתובת לא קשורה
- `shuffle`: אותם פריטים, והמקור לא משתנה
- `buildAnswerOptions`: 4 תשובות שונות כולל הנכונה · רק גזעים מהרשימה · פחות תשובות כשאין מספיק גזעים

`src/api/dogApi.test.ts` (4):
6. כשה-API מצליח — `fetchBreeds` מחזיר מערך גזעים
7. כשהשרת מחזיר 500 — `fetchBreeds` זורק `'Server error: 500'`
8. `fetchBreedImages` מחזיר לכל היותר 12 תמונות, גם כשה-API מחזיר 20
9. כשהגזע לא קיים (404) — `fetchBreedImages` זורק `'Server error: 404'`

**מבנה בדיקה:**
```ts
describe('formatBreedName', () => {        // קבוצה
  it('capitalizes the first letter', () => {  // בדיקה אחת
    expect(formatBreedName('hound')).toBe('Hound')  // מה מצפים
  })
})
```
- `toBe` — השוואה פשוטה (טקסט, מספר).
- `toEqual` — השוואה של תוכן אובייקטים ומערכים.
- `rejects.toThrow` — מצפים שה-Promise ייכשל עם שגיאה.

**למה מזייפים את `fetch` (`vi.stubGlobal`):** בדיקה שתלויה באינטרנט יכולה להיכשל בגלל הרשת ולא בגלל הקוד. מחליפים את `fetch` בפונקציה שמחזירה תשובה קבועה, ו-`vi.unstubAllGlobals()` מחזיר את המקורי אחרי כל בדיקה.

**למה דווקא את זה בודקים:** אלה הלוגיקה **שלנו** — ההמרה מה-API ועיבוד המידע. לא בודקים את React או את ה-API עצמו. המרצה כתב שבדיקות טריוויאליות לא נחשבות.

**איך מוכיחים שהבדיקה באמת בודקת משהו:** משנים זמנית `toUpperCase()` ל-`toLowerCase()` ב-`breeds.ts` → בדיקות נהיות אדומות → מחזירים.

---

## 12. תהליך העבודה

| קובץ | מה הוא |
|---|---|
| `docs/project-instructions.md` | הנחיות המרצה, מילה במילה. **מקור האמת** |
| `PRD.md` | מה בונים ולמה: עמודים ושורות "When I…, I see…" |
| `tasks.md` | המשימות בסדר בנייה, לכל אחת "Done when:" |
| `PROMPTS.md` | כל הפרומפטים, נרשמים אוטומטית על ידי hook. אחרי כל משימה — שורה שלי: מה בדקתי |
| `AGENTS.md` | כללי עבודה לסוכן: משימה אחת בכל פעם, לבדוק מול ההנחיות |

**הסבב בכל משימה:** הסוכן כותב → אני בודק בדפדפן ו-`npm test` → שורה ביומן → commit → push.

**למה commit אחרי כל משימה:** ההיסטוריה מספרת סיפור, ואם משהו נשבר יש לאן לחזור. commit אחד ענק = אין נקודות.

---

## 13. שאלות תרגול
לענות בקול, בלי להסתכל, ואז לבדוק מול הסעיפים למעלה.

1. איפה נשמר ה-state של הגזעים, ולמה דווקא שם?
2. מה קורה מהלחיצה על כרטיס ועד שהפרטים מופיעים?
3. איך מוגדרות הכתובות באפליקציה? הראה בקובץ.
4. מה ההבדל בין `Link` ל-`<a>`?
5. מה עושה `useParams`, ומה הוא מחזיר בכתובת `/breeds/poodle`?
6. למה ה-`key` הוא `breed.id` ולא האינדקס?
7. מה ההבדל בין props ל-state?
8. למה צריך את `toBreeds`? מה ה-API מחזיר ומה האפליקציה צריכה?
9. מה ההבדל בין `response` ל-`data` ב-`fetchBreeds`?
10. למה צריך לבדוק `response.ok`?
11. מה עושה `await`, ולמה אפשר להשתמש בו רק בתוך `async`?
12. למה המערך הריק `[]` בסוף ה-`useEffect`? מה יקרה בלעדיו?
13. מה התפקיד של `ignore`?
14. מה ההבדל בין `interface` ב-TypeScript ל-`class` ב-Java?
15. מה בודקת הבדיקה `'uses the API breed name as the id'`?
16. למה מזייפים את `fetch` בבדיקות?
17. מה היית משנה כדי להוסיף שדה חדש לגזע (למשל ארץ מוצא)?
18. ה-API נופל — מה המשתמש רואה, ואיפה זה קורה בקוד?
19. למה ה-state של התמונות נמצא ב-`BreedDetailPage` ולא ב-`App`?
20. מה ההבדל בין `useEffect(..., [])` ל-`useEffect(..., [breedId])`?
21. למה ה-`useState` וה-`useEffect` נמצאים לפני ה-`return` של "Breed not found"?
22. מה עושה `AbortController`, ומה ההבדל בינו לבין `ignore`?
23. איך העמוד יודע שהוא עדיין טוען תמונות, בלי `isLoading` ב-state?
24. איפה נשמר טקסט החיפוש, ולמה שם?
25. למה `visibleBreeds` לא נשמר ב-state?
26. מה זה controlled component? איך `SearchBar` מדווח ל-`BreedsPage` על הקלדה?
27. מה קורה מההקלדה של אות ועד שהרשימה מתעדכנת?
28. למה `filterBreeds` בקובץ נפרד ולא בתוך הרכיב?
29. למה החיפוש מתאפס כשחוזרים מעמוד גזע, ואיך היית משנה את זה?
30. איפה נשמרים המועדפים בזמן ריצה, ואיפה בין רענונים?
31. למה ה-state של המועדפים ב-`App` ולא בעמוד המועדפים?
32. מה זה custom hook? מה `useFavorites` מחזיר?
33. למה מעבירים ל-`useState` פונקציה (`() => ...`) ולא ערך?
34. למה צריך `JSON.stringify` ו-`JSON.parse`?
35. למה `toggleFavorite` מחזיר מערך חדש ולא עושה `push`?
36. מה קורה אם ב-`localStorage` יש טקסט פגום?
37. איך אותו `BreedCard` מציג כפתור "Remove" רק בעמוד המועדפים?
38. איך החידון יודע מה התשובה הנכונה?
39. מה ה-regex ב-`getBreedIdFromImageUrl` תופס, ולמה לוקחים רק את החלק שלפני המקף?
40. איך מוודאים שהתשובה הנכונה לא תמיד במקום הראשון, ושאין תשובות כפולות?
41. מה קורה בקוד מהלחיצה על "Next question" ועד שמופיע כלב חדש?
42. למה אי אפשר לקבל ניקוד כפול על אותה שאלה?
43. מה זה `<T>` ב-`shuffle<T>`?
44. מה ההבדל בין `/abc` ל-`/breeds/xyz`? למה אחד מגיע ל-404 והשני לא?
45. מה עושה `path="*"`? מה היה קורה אם הוא היה ראשון ברשימת ה-Routes?

---

## 14. תרגילים בלי סוכן
לעשות לבד, ואחר כך להחזיר את הקוד כמו שהיה (`git checkout -- <קובץ>`).

- לשנות `breed.name` ל-`breed.nme` ב-`BreedCard.tsx` → לראות את השגיאה בעורך וב-`npm run build`.
- לשנות את הטקסט "Loading breeds…" ולראות אותו בדפדפן.
- להוסיף ל-`NavBar` קישור `<NavLink to="/breeds/hound">Hound</NavLink>` → לראות שהוא מודגש רק בעמוד של Hound.
- לשנות `toUpperCase()` ל-`toLowerCase()` → לראות בדיקות אדומות ב-`npm run test:ui`.
- להוסיף ל-`BreedCard` שורה שמציגה את ה-`id` של הגזע.
- לשנות ב-`BreedDetailPage` את המספר `12` ל-`4` → לראות 4 תמונות בגלריה.
- להוסיף ב-`NotFoundPage` קישור נוסף ל-`/quiz` → לראות אותו ב-`/abc`.
- לשנות ב-`QuizPage` את `buildAnswerOptions(correctId, allIds)` ל-`buildAnswerOptions(correctId, allIds, 6)` → 6 תשובות.
- ב-F12 ← Application ← Local Storage למחוק את `dog-breeds-favorites` ולרענן → המועדפים ריקים.
- לשנות שם את הערך ל-`abc` ולרענן → האפליקציה לא קורסת (בזכות `parseFavorites`).
- להוסיף ל-`filterBreeds` חיפוש גם בתתי-הגזעים (`breed.subBreeds.some(...)`) → "french" ימצא את bulldog.
- ב-F12 ← Network לבחור Slow 4G, להיכנס ל-Hound ומיד לחזור → לראות בקשה מבוטלת (canceled).
