# הכנה להגנה — Dog Breeds Explorer

מסמך לימוד אישי לקראת ההגנה על הפרויקט. מתעדכן אחרי כל משימה.
**מצב נוכחי:** משימות 1–4 הושלמו (רשימה, ניתוב, API, בדיקות). עוד לא נבנו: גלריה, חיפוש, מועדפים, חידון, 404, עיצוב.

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
| `src/types.ts` | הטיפוסים: `Breed` ו-`BreedsApiResponse` |
| `src/api/dogApi.ts` | `fetchBreeds()` — כל הפנייה ל-API |
| `src/utils/breeds.ts` | לוגיקה טהורה: `toBreeds()` ו-`formatBreedName()` |
| `src/components/` | רכיבים: `NavBar`, `BreedList`, `BreedCard`, `Loader`, `ErrorMessage` |
| `src/pages/` | עמודים: `BreedsPage`, `BreedDetailPage` |
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
App  (מחזיק: breeds, isLoading, error)
├── NavBar
└── Routes
    ├── "/"           → BreedsPage(breeds) → BreedList(breeds) → BreedCard(breed) × 108
    └── "/breeds/:id" → BreedDetailPage(breeds)
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

## 11. בדיקות עם Vitest

**הפקודות:**
- `npm test` → `vitest run` — מריץ פעם אחת ויוצא.
- `npm run test:ui` → `vitest --ui` — מציג את הבדיקות בדפדפן.

**7 בדיקות, בשני קבצים:**

`src/utils/breeds.test.ts` (5):
1. `formatBreedName('hound')` → `'Hound'`
2. `formatBreedName('')` → `''`
3. `toBreeds` הופך `{ beagle: [], bulldog: [...] }` למערך עם `id`, `name`, `subBreeds`
4. ה-`id` נשאר `'hound'` (בלי פירמוט), וה-`name` הוא `'Hound'`
5. `toBreeds({})` → `[]`

`src/api/dogApi.test.ts` (2):
6. כשה-API מצליח — `fetchBreeds` מחזיר מערך גזעים
7. כשהשרת מחזיר 500 — `fetchBreeds` זורק `'Server error: 500'`

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

---

## 14. תרגילים בלי סוכן
לעשות לבד, ואחר כך להחזיר את הקוד כמו שהיה (`git checkout -- <קובץ>`).

- לשנות `breed.name` ל-`breed.nme` ב-`BreedCard.tsx` → לראות את השגיאה בעורך וב-`npm run build`.
- לשנות את הטקסט "Loading breeds…" ולראות אותו בדפדפן.
- להוסיף ל-`NavBar` קישור `<NavLink to="/breeds/hound">Hound</NavLink>` → לראות שהוא מודגש רק בעמוד של Hound.
- לשנות `toUpperCase()` ל-`toLowerCase()` → לראות בדיקות אדומות ב-`npm run test:ui`.
- להוסיף ל-`BreedCard` שורה שמציגה את ה-`id` של הגזע.
