import { Link, NavLink } from 'react-router'

// תפריט הניווט. NavLink מוסיף לבד את המחלקה active לקישור של העמוד הנוכחי.
// קישורים למועדפים ולחידון יתווספו כשהעמודים האלה ייבנו.
function NavBar() {
  return (
    <nav className="nav-bar">
      <Link to="/" className="nav-brand">
        🐕 Dog Breeds Explorer
      </Link>
      <NavLink to="/" end>
        Breeds
      </NavLink>
    </nav>
  )
}

export default NavBar
