import { Link, NavLink } from 'react-router'

// תפריט הניווט. NavLink מוסיף לבד את המחלקה active לקישור של העמוד הנוכחי.
interface NavBarProps {
  favoritesCount: number
}

function NavBar({ favoritesCount }: NavBarProps) {
  return (
    <nav className="nav-bar">
      <Link to="/" className="nav-brand">
        🐕 Dog Breeds Explorer
      </Link>
      <NavLink to="/" end>
        Breeds
      </NavLink>
      <NavLink to="/favorites">Favorites ({favoritesCount})</NavLink>
      <NavLink to="/quiz">Quiz</NavLink>
    </nav>
  )
}

export default NavBar
