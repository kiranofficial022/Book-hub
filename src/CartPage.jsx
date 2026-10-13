import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CartPage() {
  const navigate = useNavigate()

  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bookHubCart')) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('bookHubCart', JSON.stringify(cartItems))
  }, [cartItems])

  const totalPrice = cartItems.reduce(
    (total, book) =>
      total + Number(String(book.price).replace(/[^\d.]/g, '')),
    0
  )

  const removeBook = (bookId) => {
    setCartItems((items) =>
      items.filter((book) => book.id !== bookId)
    )
  }

  return (
    <main className="cart-page">
      <button
        className="back-button"
        onClick={() => navigate('/books')}
      >
        ← Continue shopping
      </button>

      <p className="eyebrow">YOUR COLLECTION</p>
      <h1>Shopping Cart</h1>
      <p className="cart-subtitle">
        Your next great read is just a step away.
      </p>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <span>🛒</span>
          <h2>Your cart is empty</h2>
          <p>Discover a book that inspires you.</p>

          <button
            className="primary-button"
            onClick={() => navigate('/books')}
          >
            Explore Books →
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cartItems.map((book) => (
              <article className="cart-item" key={book.id}>
                <img src={book.image} alt={book.title} />

                <div className="cart-item-info">
                  <h3>{book.title}</h3>
                  <p>By {book.author}</p>
                  <strong>{book.price}</strong>

                  <button
                    className="remove-cart-button"
                    onClick={() => removeBook(book.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="cart-summary-row">
              <span>Books ({cartItems.length})</span>
              <strong>
                ₹{totalPrice.toLocaleString('en-IN')}
              </strong>
            </div>

            <div className="cart-summary-row">
              <span>Delivery</span>
              <strong>Free</strong>
            </div>

            <div className="cart-total">
              <span>Total</span>
              <strong>
                ₹{totalPrice.toLocaleString('en-IN')}
              </strong>
            </div>
           <button
  className="cart-checkout-button"
  onClick={() => navigate('/checkout')}
>
  Proceed to Checkout →
</button>
            
            
          </aside>
        </div>
      )}
    </main>
  )
}

export default CartPage
