import { useEffect, useState } from 'react'
import { books } from './books'
import './MyAccount.css'

function MyAccount({
  onBack,
  onBrowseBooks,
  onOpenCart,
  onLogout,
}) {
  const [profile, setProfile] = useState({
    name: 'Book Hub Reader',
    email: 'reader@bookhub.com',
  })

  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [message, setMessage] = useState('')

  const [orders, setOrders] = useState([])
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    try {
      const savedProfile = JSON.parse(
        localStorage.getItem('bookHubProfile') || 'null'
      )

      if (savedProfile) {
        setProfile({
          name: savedProfile.name || 'Book Hub Reader',
          email: savedProfile.email || 'reader@bookhub.com',
        })
      }

      const savedOrders = JSON.parse(
        localStorage.getItem('bookHubOrders') || '[]'
      )

      const savedFavorites = JSON.parse(
        localStorage.getItem('bookHubFavorites') || '[]'
      )

      setOrders(Array.isArray(savedOrders) ? savedOrders : [])
      setFavorites(Array.isArray(savedFavorites) ? savedFavorites : [])
    } catch (error) {
      console.error('Unable to load account data:', error)
      setMessage('Unable to load some account details.')
    }
  }, [])

  const favoriteBooks = books.filter((book) =>
    favorites.some(
      (favorite) =>
        String(favorite) === String(book.id) ||
        String(favorite?.id) === String(book.id)
    )
  )

  const startEditing = () => {
    setNameInput(profile.name)
    setEmailInput(profile.email)
    setMessage('')
    setEditing(true)
  }

  const saveProfile = (event) => {
    event.preventDefault()

    const trimmedName = nameInput.trim()
    const trimmedEmail = emailInput.trim()

    if (!trimmedName || !trimmedEmail) {
      setMessage('Please enter your name and email.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setMessage('Please enter a valid email address.')
      return
    }

    const updatedProfile = {
      name: trimmedName,
      email: trimmedEmail,
    }

    try {
      localStorage.setItem(
        'bookHubProfile',
        JSON.stringify(updatedProfile)
      )

      setProfile(updatedProfile)
      setEditing(false)
      setMessage('Profile updated successfully!')
    } catch (error) {
      console.error('Unable to save profile:', error)
      setMessage('Unable to save your profile. Please try again.')
    }
  }

  const logout = () => {
    if (typeof onLogout === 'function') {
      onLogout()
    } else {
      localStorage.removeItem('bookHubLoggedIn')
      window.location.href = '/'
    }
  }

  const browseBooks = () => {
    if (typeof onBrowseBooks === 'function') {
      onBrowseBooks()
    } else if (typeof onBack === 'function') {
      onBack()
    }
  }

  const openCart = () => {
    if (typeof onOpenCart === 'function') {
      onOpenCart()
    } else if (typeof onBack === 'function') {
      onBack()
    }
  }

  return (
    <main className="account-page">
      <section className="account-heading">
        <div>
          <span className="account-eyebrow">
            YOUR PERSONAL SPACE
          </span>

          <h1>My Account</h1>

          <p>
            Welcome back! Your reading journey lives here.
          </p>

          <button
            type="button"
            className="account-back-btn"
            onClick={onBack || browseBooks}
          >
            ← Back to Home
          </button>
        </div>

        <button
          type="button"
          className="account-browse-btn"
          onClick={browseBooks}
        >
          Browse Books <span>→</span>
        </button>
      </section>

      <section className="account-profile-card">
        <div className="account-avatar">
          {profile.name.charAt(0).toUpperCase()}
        </div>

        <div className="account-profile-info">
          <span className="account-member-label">
            BOOK HUB READER
          </span>

          <h2>{profile.name}</h2>
          <p>{profile.email}</p>
        </div>

        <button
          className="account-edit-btn"
          type="button"
          onClick={startEditing}
        >
          Edit Profile
        </button>
      </section>

      {message && (
        <p className="account-message" role="status">
          {message}
        </p>
      )}

      {editing && (
        <form
          className="account-edit-form"
          onSubmit={saveProfile}
        >
          <h2>Edit your details</h2>

          <label htmlFor="account-name">Full name</label>
          <input
            id="account-name"
            type="text"
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            required
          />

          <label htmlFor="account-email">Email address</label>
          <input
            id="account-email"
            type="email"
            value={emailInput}
            onChange={(event) => setEmailInput(event.target.value)}
            required
          />

          <div className="account-form-actions">
            <button type="submit" className="account-save-btn">
              Save Changes
            </button>

            <button
              type="button"
              className="account-cancel-btn"
              onClick={() => {
                setEditing(false)
                setMessage('')
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <section className="account-stats">
        <article className="account-stat-card">
          <span className="account-stat-icon">📚</span>
          <div>
            <p>My Orders</p>
            <h3>{orders.length}</h3>
          </div>
        </article>

        <article className="account-stat-card">
          <span className="account-stat-icon">♡</span>
          <div>
            <p>My Favourites</p>
            <h3>{favoriteBooks.length}</h3>
          </div>
        </article>

        <article className="account-stat-card">
          <span className="account-stat-icon">✦</span>
          <div>
            <p>Reader Status</p>
            <h3>Active</h3>
          </div>
        </article>
      </section>

      <section className="account-content-grid">
        <article className="account-panel">
          <div className="account-panel-heading">
            <div>
              <span className="account-panel-kicker">
                YOUR PURCHASES
              </span>
              <h2>Recent Orders</h2>
            </div>

            <button
              type="button"
              className="account-inline-button"
              onClick={() =>
                setMessage(
                  'Your order history will appear here after checkout is connected.'
                )
              }
            >
              View all →
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="account-empty-state">
              <span>📦</span>
              <h3>No orders yet</h3>
              <p>
                Your next favourite book could be one click away.
              </p>

              <button
                type="button"
                className="account-text-link"
                onClick={browseBooks}
              >
                Explore books
              </button>
            </div>
          ) : (
            <div className="account-order-list">
              {orders.slice(-3).reverse().map((order, index) => (
                <div
                  className="account-order-item"
                  key={order.id ?? order.orderId ?? index}
                >
                  <div className="account-order-icon">📖</div>

                  <div className="account-order-details">
                    <h3>
                      Order #{order.id ?? order.orderId ?? index + 1}
                    </h3>

                    <p>
                      {order.date
                        ? String(order.date)
                        : 'Purchase details'}
                    </p>

                    {order.total != null && (
                      <p>Total: ₹{order.total}</p>
                    )}
                  </div>

                  <span className="account-order-status">
                    {order.status || 'Placed'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="account-panel">
          <div className="account-panel-heading">
            <div>
              <span className="account-panel-kicker">
                SAVED FOR LATER
              </span>
              <h2>My Favourites</h2>
            </div>

            <button
              type="button"
              className="account-inline-button"
              onClick={browseBooks}
            >
              Explore →
            </button>
          </div>

          {favoriteBooks.length === 0 ? (
            <div className="account-empty-state">
              <span>♡</span>
              <h3>Your collection starts here</h3>
              <p>
                Save books you love and find them here anytime.
              </p>

              <button
                type="button"
                className="account-text-link"
                onClick={browseBooks}
              >
                Find your next read
              </button>
            </div>
          ) : (
            <div className="account-favorite-list">
              {favoriteBooks.slice(0, 3).map((book) => (
                <div
                  className="account-favorite-item"
                  key={book.id}
                >
                  <img
                    src={book.image}
                    alt={book.title}
                    onError={(event) => {
                      event.currentTarget.style.visibility = 'hidden'
                    }}
                  />

                  <div>
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                    <span>{book.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="account-quick-links">
        <button
          type="button"
          className="account-quick-link"
          onClick={browseBooks}
        >
          <span>📚</span>
          <div>
            <h3>Discover Books</h3>
            <p>Explore your next great read.</p>
          </div>
          <span className="account-link-arrow">→</span>
        </button>

        <button
          type="button"
          className="account-quick-link"
          onClick={openCart}
        >
          <span>🛍️</span>
          <div>
            <h3>Shopping Cart</h3>
            <p>Continue where you left off.</p>
          </div>
          <span className="account-link-arrow">→</span>
        </button>

        <button
          type="button"
          className="account-quick-link"
          onClick={logout}
        >
          <span>↗</span>
          <div>
            <h3>Sign Out</h3>
            <p>Log out of your Book Hub account.</p>
          </div>
          <span className="account-link-arrow">→</span>
        </button>
      </section>

      <footer className="account-footer">
        <p>Made for readers, one page at a time. ✦</p>
      </footer>
    </main>
  )
}

export default MyAccount
