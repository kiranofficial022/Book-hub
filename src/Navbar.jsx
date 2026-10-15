import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    localStorage.removeItem('bookHubLoggedIn')
    closeMenu()
    navigate('/', { replace: true })
    window.location.reload()
  }

  return (
    <header className="navbar">
      <Link className="logo" to="/" onClick={closeMenu}>
        Book<span>Hub.</span>
      </Link>

      <button
        className="mobile-menu-button"
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      <nav className={menuOpen ? 'navbar-links open' : 'navbar-links'}>
        <NavLink to="/" end onClick={closeMenu}>
          Home
        </NavLink>

        <NavLink to="/books" onClick={closeMenu}>
          Explore Books
        </NavLink>

        <NavLink to="/cart" onClick={closeMenu}>
          🛒 Cart
        </NavLink>

        <NavLink to="/my-orders" onClick={closeMenu}>
          My Orders
        </NavLink>

        <button
          type="button"
          className="nav-button"
          onClick={() => {
            closeMenu()
            navigate('/checkout')
          }}
        >
          Checkout →
        </button>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          Log out
        </button>
      </nav>
    </header>
  )
}

export default Navbar
