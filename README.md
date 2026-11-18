# Dog Breeds Explorer 🐕

אפליקציית ווב לחקירת גזעי כלבים: רשימה של כל 108 הגזעים עם חיפוש וסינון, עמוד לכל גזע עם תתי-גזעים וגלריית תמונות, רשימת מועדפים אישית, ומשחק "נחש את הגזע".

פרויקט גמר בקורס 2883 · פיתוח ויישום פרונט-אנד.

## מה אפשר לעשות באפליקציה

| עמוד | כתובת | מה עושים בו |
|---|---|---|
| רשימת גזעים | `/` | רואים את כל הגזעים, מחפשים לפי שם, ומסננים רק גזעים שיש להם תתי-גזעים |
| פרטי גזע | `/breeds/:id` (למשל `/breeds/hound`) | רואים את תתי-הגזעים ועד 12 תמונות, ומוסיפים או מסירים מהמועדפים |
| מועדפים | `/favorites` | רואים את הגזעים שסימנתם ומסירים אותם. נשמר ב-`localStorage`, גם אחרי רענון |
| נחש את הגזע | `/quiz` | תמונה של כלב אקראי, 4 תשובות וניקוד |
| 404 | כל כתובת אחרת | הודעה וקישור חזרה לרשימה |

בכל טעינה של מידע מוצגים שלושה מצבים: טוען, שגיאה (למשל בלי אינטרנט), או המידע עצמו.

## טכנולוגיות

- **React 19 + TypeScript**, עם **Vite** לפיתוח ולבנייה
- **React Router** לניתוב
- **Vitest** ו-**Vitest UI** לבדיקות יחידה
- CSS משלי, בלי ספריות UI
- front-end בלבד: אין שרת ואין בסיס נתונים

## ה-API

המידע מגיע מ-**[Dog CEO API](https://dog.ceo/dog-api/)**: ציבורי, חינמי, ובלי מפתח.

| מה | כתובת |
|---|---|
| כל הגזעים ותתי-הגזעים | `https://dog.ceo/api/breeds/list/all` |
| התמונות של גזע | `https://dog.ceo/api/breed/{breed}/images` |
| תמונה אקראית (לחידון) | `https://dog.ceo/api/breeds/image/random` |

ה-API מחזיר את הגזעים כאובייקט (`{ "hound": ["afghan", ...] }`) ולא כמערך, ואין בו `id`. האפליקציה ממירה אותו למערך, ושם הגזע משמש כ-`id`.

## הרצה

צריך [Node.js](https://nodejs.org/) בגרסה 22.22 ומעלה. הגרסה הזאת נדרשת על ידי React Router ו-Vitest, והפרויקט פותח ונבדק על Node 24.

```bash
git clone https://github.com/EladBerko1/dog-breeds-explorer.git
cd dog-breeds-explorer
npm install
npm run dev
```

ואז לפתוח את הכתובת שמופיעה בטרמינל (בדרך כלל http://localhost:5173).

| פקודה | מה היא עושה |
|---|---|
| `npm run dev` | מריצה את האפליקציה בזמן פיתוח |
| `npm run build` | בודקת טיפוסים (`tsc`) ובונה גרסה מוכנה לתיקייה `dist` |
| `npm run preview` | מציגה את הגרסה הבנויה |
| `npm run lint` | בודקת את הקוד עם oxlint |

## בדיקות

```bash
npm test          # מריץ את כל הבדיקות פעם אחת בטרמינל
npm run test:ui   # מציג את הבדיקות בדפדפן (Vitest UI)
```

27 בדיקות יחידה על הלוגיקה של האפליקציה:

| קובץ | מה נבדק |
|---|---|
| `src/utils/breeds.test.ts` | המרת התשובה מה-API למערך, פורמט שם הגזע, חיפוש וסינון |
| `src/utils/favorites.test.ts` | הוספה והסרה ממועדפים, קריאה בטוחה מ-`localStorage` |
| `src/utils/quiz.test.ts` | חילוץ הגזע מכתובת תמונה, ערבוב, בניית 4 תשובות |
| `src/api/dogApi.test.ts` | הפניות ל-API עם `fetch` מזויף: הצלחה, שגיאת שרת, הגבלה ל-12 תמונות |

## מבנה הפרויקט

```
src/
  main.tsx          נקודת הכניסה: BrowserRouter ו-App
  App.tsx           טעינת הגזעים, המועדפים, וכל הכתובות (Routes)
  types.ts          הטיפוסים של המידע ושל תשובות ה-API
  api/              כל הפניות ל-Dog CEO (fetch)
  utils/            לוגיקה טהורה + הבדיקות שלה
  hooks/            useFavorites: מועדפים + localStorage
  components/       NavBar, BreedList, BreedCard, SearchBar, ImageGallery,
                    FavoriteButton, QuizOptions, Loader, ErrorMessage
  pages/            BreedsPage, BreedDetailPage, FavoritesPage, QuizPage, NotFoundPage
  index.css         כל העיצוב
```

## מסמכים

- [PRD.md](PRD.md): מה בונים ולמה, העמודים ושורות הקבלה
- [tasks.md](tasks.md): תוכנית העבודה, משימה אחרי משימה
- [docs/architecture.md](docs/architecture.md): מבנה הרכיבים וזרימת המידע
- [docs/project-instructions.md](docs/project-instructions.md): הנחיות הפרויקט של המרצה
- [docs/defense-prep.md](docs/defense-prep.md): סיכום אישי לקראת ההגנה
- [PROMPTS.md](PROMPTS.md): יומן כל הפרומפטים לסוכן, נרשם אוטומטית
