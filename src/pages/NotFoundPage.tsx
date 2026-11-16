import { Link, useLocation } from 'react-router'

// מוצג לכל כתובת שלא מוגדרת ב-Routes (path="*")
function NotFoundPage() {
  // useLocation נותן את הכתובת הנוכחית, כדי להראות למשתמש מה הוא ניסה לפתוח
  const location = useLocation()

  return (
    <div className="not-found">
      <h1>404 — Page not found</h1>
      <p>
        There is no page at <code>{location.pathname}</code>.
      </p>
      <Link to="/">← Back to all breeds</Link>
    </div>
  )
}

export default NotFoundPage
