import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CartPage.css'

function getPrice(price) {
  return Number(String(price ?? 0).replace(/[^\d.]/g, '')) || 0
}

function CartPage() {
  const navigate = useNavigate()

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('bookHubCart') || '[]'
      )
      return Array.isArray(saved) ? saved : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('bookHubCart', JSON.stringify(cartItems))
  }, [cartItems])

  const totalPrice = cartItems.reduce(
    (total, book) => total + getPrice(book.price),
    0
  )

  const removeBook = (bookId) => {
    setCartItems((items) =>
      items.filter((book) => book.id !== bookId)
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const formatPrice = (price) =>
    `₹${price.toLocaleString('en-IN')}`

  return (
    <main className="cart-page">
      <button
        type="button"
        className="cart-back-button"
        onClick={() => navigate('/books')}
      >
        <span aria-hidden="true">←</span> Continue shopping
      </button>

      <header className="cart-heading">
        <span className="cart-eyebrow">YOUR COLLECTION</span>
        <h1>Shopping Cart</h1>
        <p>
          Your next great read is just a step away.
        </p>
      </header>

      {cartItems.length === 0 ? (
        <section className="cart-empty-state">
          <div className="cart-empty-icon" aria-hidden="true">
            📚
          </div>
          <span className="cart-eyebrow">A WORLD OF STORIES AWAITS</span>
          <h2>Your cart is waiting for a story</h2>
          <p>
            Explore our collection and find a book worth keeping.
          </p>

          <button
            type="button"
            className="cart-primary-button"
            onClick={() => navigate('/books')}
          >
            Discover Books <span aria-hidden="true">→</span>
          </button>
        </section>
      ) : (
        <>
          <div className="cart-items-heading">
            <h2>Your selection</h2>
            <span>
              {cartItems.length} {cartItems.length === 1 ? 'book' : 'books'}
            </span>

            <button
              type="button"
              className="cart-clear-button"
              onClick={clearCart}
            >
              Clear cart
            </button>
          </div>

          <div className="cart-layout">
            <section className="cart-list" aria-label="Cart items">
              {cartItems.map((book, index) => (
                <article
                  className="cart-item"
                  key={`${book.id}-${index}`}
                >
                  <div className="cart-book-cover">
                    <img
                      src={book.image}
                      alt={book.title}
                      onError={(event) => {
                        event.currentTarget.style.visibility = 'hidden'
                      }}
                    />
                  </div>

                  <div className="cart-item-info">
                    <span className="cart-book-label">BOOK HUB EDITION</span>
                    <h3>{book.title}</h3>
                    <p>By {book.author || 'Unknown author'}</p>

                    <strong className="cart-book-price">
                      {formatPrice(getPrice(book.price))}
                    </strong>

                    <button
                      type="button"
                      className="cart-remove-button"
                      onClick={() => removeBook(book.id)}
                      aria-label={`Remove ${book.title} from cart`}
                    >
                      <span aria-hidden="true">×</span> Remove
                    </button>
                  </div>
                </article>
              ))}
            </section>

            <aside className="cart-summary">
              <span className="cart-eyebrow">YOUR ORDER</span>
              <h2>Order Summary</h2>

              <div className="cart-summary-row">
                <span>
                  Books ({cartItems.length})
                </span>
                <strong>{formatPrice(totalPrice)}</strong>
              </div>

              <div className="cart-summary-row">
                <span>Delivery</span>
                <strong className="cart-free-delivery">FREE</strong>
              </div>

              <div className="cart-summary-total">
                <div>
                  <span>Total amount</span>
                  <small>Inclusive of listed prices</small>
                </div>
                <strong>{formatPrice(totalPrice)}</strong>
              </div>

              <button
                type="button"
                className="cart-checkout-button"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout <span aria-hidden="true">→</span>
              </button>

              <div className="cart-trust-note">
                <span aria-hidden="true">✦</span>
                <p>
                  Great stories, carefully selected for you.
                </p>
              </div>
            </aside>
          </div>
        </>
      )}

      <footer className="cart-footer">
        Made for readers, one page at a time. ✦
      </footer>
    </main>
  )
}

export default CartPage
