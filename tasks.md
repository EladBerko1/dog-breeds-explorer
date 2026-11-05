# Tasks — Dog Breeds Explorer

משימה אחת בכל פעם, לפי הסדר. אחרי כל משימה: `npm test` (מרגע שיש בדיקות), בדיקה בדפדפן, commit.

- [x] Task 0: הקמת פרויקט Vite + React + TypeScript, ‏`PRD.md` ו-`tasks.md`.
  Done when: `npm run dev` מציג את עמוד הפתיחה של Vite ו-`npm run build` עובר בלי שגיאות.

- [ ] Task 1: רשימת גזעים מקובץ JSON מקומי (`src/data/breeds.json`) עם טיפוס `Breed` ב-`src/types.ts`, ורכיבים `BreedCard` ו-`BreedList` (רשימה עם `map` ו-`key`).
  Done when: אני פותח את האפליקציה ורואה 6 גזעים לדוגמה, כל אחד עם שם ומספר תתי-הגזעים שלו.

- [ ] Task 2: ניתוב עם React Router — עמוד רשימה ב-`/`, עמוד פרטים ב-`/breeds/:id` (קורא את ה-`id` עם `useParams`), ורכיב `NavBar` עם `NavLink`.
  Done when: לחיצה על "hound" משנה את הכתובת ל-`/breeds/hound` ומציגה את השם ותתי-הגזעים שלו; כפתור "Back" בדפדפן מחזיר לרשימה.

- [ ] Task 3: החלפת הקובץ המקומי ב-`fetch` אמיתי בתוך `useEffect` מ-`/breeds/list/all`, עם פונקציה שממירה את האובייקט מה-API למערך `Breed[]`.
  Done when: אני רואה את כל הגזעים מה-API (יותר מ-100), והקובץ המקומי נמחק.

- [ ] Task 4: מצבי טעינה ושגיאה — רכיבים `Loader` ו-`ErrorMessage`.
  Done when: בטעינה אני רואה "Loading…"; כשאני מנתק את האינטרנט ב-DevTools (Offline) ומרענן, אני רואה הודעת שגיאה.

- [ ] Task 5: גלריית תמונות בעמוד הפרטים (רכיב `ImageGallery`), כולל מצבי טעינה ושגיאה.
  Done when: בעמוד `/breeds/hound` אני רואה עד 12 תמונות של hound.

- [ ] Task 6: Vitest + Vitest UI — סקריפטים `test` ו-`test:ui`, ובדיקות לפונקציית ההמרה ולפורמט שם הגזע.
  Done when: `npm test` עובר עם לפחות 3 בדיקות, ו-`npm run test:ui` מציג אותן בדפדפן.

- [ ] Task 7: חיפוש וסינון — רכיב `SearchBar`, פונקציית `filterBreeds` נפרדת, וצ'קבוקס "רק עם תתי-גזעים". בדיקות לסינון.
  Done when: אני מקליד "bull" ורואה רק bulldog ו-bullterrier; `npm test` עובר עם לפחות 5 בדיקות.

- [ ] Task 8: עמוד מועדפים ב-`/favorites` — כפתור `FavoriteButton` בעמוד הפרטים, שמירה ב-`localStorage`.
  Done when: אני מוסיף 2 גזעים למועדפים, מרענן, ורואה את שניהם בעמוד המועדפים; לחיצה על "הסר" מוחקת גזע.

- [ ] Task 9: עמוד חידון ב-`/quiz` — תמונה אקראית, 4 תשובות, ניקוד. בדיקות ללוגיקה (חילוץ שם הגזע מכתובת התמונה, בניית התשובות).
  Done when: אני רואה תמונה ו-4 כפתורים; אחרי בחירה אני רואה אם צדקתי, הניקוד מתעדכן, ו"שאלה הבאה" מביא תמונה חדשה.

- [ ] Task 10: עמוד 404 לכל כתובת שלא קיימת, וטיפול בגזע שלא קיים (`/breeds/xyz`).
  Done when: `/abc` מציג עמוד 404 עם קישור לרשימה; `/breeds/xyz` מציג הודעה "הגזע לא נמצא".

- [ ] Task 11: עיצוב — CSS משלי, רשת כרטיסים, תצוגה רספונסיבית.
  Done when: האפליקציה נראית מסודרת במסך רחב וגם ברוחב 375px (DevTools → מצב מובייל), בלי גלילה הצידה.

- [ ] Task 12: גימור — `README.md` חדש, `docs/architecture.md`, ובדיקה סופית.
  Done when: `npm run build` ו-`npm test` עוברים, אין שגיאות בקונסול באף עמוד, וה-repo נפתח בחלון גלישה בסתר.
