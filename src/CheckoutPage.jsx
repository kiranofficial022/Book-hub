import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import './CheckoutPage.css'

const getPrice = (price) =>
  Number(String(price ?? 0).replace(/[^\d.]/g, '')) || 0

const formatPrice = (price) =>
  `₹${price.toLocaleString('en-IN')}`

function CheckoutPage() {
  const navigate = useNavigate()

  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryCity, setDeliveryCity] = useState('')
  const [deliveryPin, setDeliveryPin] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [confirmedTotal, setConfirmedTotal] = useState(0)
  const [error, setError] = useState('')

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

  const totalPrice = cartItems.reduce(
    (total, book) => total + getPrice(book.price),
    0
  )

  const handlePlaceOrder = (event) => {
    event.preventDefault()
    setError('')

    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add a book first.')
      return
    }

    const id = `BH${Date.now()}`
    const now = new Date().toISOString()

    const order = {
      id,
      orderId: id,
      items: [...cartItems],
      total: totalPrice,
      customer: {
        name: customerName.trim(),
        email: customerEmail.trim(),
        phone: customerPhone,
        address: deliveryAddress.trim(),
        city: deliveryCity.trim(),
        pin: deliveryPin,
      },
      status: 'Order Placed',
      date: now,
      history: [
        {
          status: 'Order Placed',
          date: now,
        },
      ],
    }

    try {
      const savedOrders = JSON.parse(
        localStorage.getItem('bookHubOrders') || '[]'
      )

      const orders = Array.isArray(savedOrders)
        ? savedOrders
        : []

      localStorage.setItem(
        'bookHubOrders',
        JSON.stringify([order, ...orders])
      )

      localStorage.setItem('bookHubCart', JSON.stringify([]))

      setOrderId(id)
      setConfirmedTotal(totalPrice)
      setOrderPlaced(true)
      setCartItems([])
    } catch (saveError) {
      console.error('Unable to save order:', saveError)
      setError('Unable to save your order. Please try again.')
    }
  }

  if (orderPlaced) {
    return (
      <main className="checkout-page">
        <Navbar />

        <section className="checkout-success">
          <div className="checkout-success-icon">✓</div>

          <span className="checkout-eyebrow">
            YOUR NEXT CHAPTER BEGINS
          </span>

          <h1>Thank you, {customerName}!</h1>

          <p className="checkout-success-description">
            Your demo order has been saved successfully.
            Your reading journey is ready to continue.
          </p>

          <div className="checkout-confirmation-card">
            <span>ORDER REFERENCE</span>
            <strong>{orderId}</strong>

            <div className="checkout-confirmation-divider" />

            <span>CONFIRMATION EMAIL</span>
            <p>{customerEmail}</p>

            <div className="checkout-confirmation-divider" />

            <span>ORDER TOTAL</span>
            <strong className="checkout-confirmed-total">
              {formatPrice(confirmedTotal)}
            </strong>

            <span className="checkout-demo-badge">
              Demo order · No payment collected
            </span>
          </div>

          <div className="checkout-success-actions">
            <button
              type="button"
              className="checkout-primary-button"
              onClick={() => navigate(`/track-order/${orderId}`)}
            >
              Track Your Order →
            </button>

            <button
              type="button"
              className="checkout-secondary-button"
              onClick={() => navigate('/my-orders')}
            >
              View My Orders
            </button>

            <button
              type="button"
              className="checkout-text-button"
              onClick={() => navigate('/books')}
            >
              Continue Shopping
            </button>
          </div>
        </section>
      </main>
    )
  }

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <Navbar />

        <section className="checkout-empty">
          <div className="checkout-empty-icon">📚</div>
          <span className="checkout-eyebrow">
            YOUR NEXT CHAPTER AWAITS
          </span>
          <h1>Your cart is empty</h1>
          <p>Add a book to your cart before checking out.</p>

          <button
            type="button"
            className="checkout-primary-button"
            onClick={() => navigate('/books')}
          >
            Explore Books →
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="checkout-page">
      <Navbar />

      <div className="checkout-container">
        <button
          type="button"
          className="checkout-back-button"
          onClick={() => navigate('/cart')}
        >
          ← Back to cart
        </button>

        <header className="checkout-heading">
          <span className="checkout-eyebrow">ALMOST YOURS</span>
          <h1>Complete your order</h1>
          <p>
            Just a few details stand between you and your next great read.
          </p>
        </header>

        <div className="checkout-layout">
          <form
            className="checkout-form"
            onSubmit={handlePlaceOrder}
          >
            <section className="checkout-form-section">
              <div className="checkout-section-heading">
                <span>01</span>
                <div>
                  <h2>Customer details</h2>
                  <p>How can we reach you?</p>
                </div>
              </div>

              <label htmlFor="customer-name">Full name</label>
              <input
                id="customer-name"
                type="text"
                value={customerName}
                onChange={(event) =>
                  setCustomerName(event.target.value)
                }
                autoComplete="name"
                required
                placeholder="Enter your full name"
              />

              <label htmlFor="customer-email">Email address</label>
              <input
                id="customer-email"
                type="email"
                value={customerEmail}
                onChange={(event) =>
                  setCustomerEmail(event.target.value)
                }
                autoComplete="email"
                required
                placeholder="you@example.com"
              />

              <label htmlFor="customer-phone">Phone number</label>
              <input
                id="customer-phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                value={customerPhone}
                onChange={(event) =>
                  setCustomerPhone(
                    event.target.value.replace(/\D/g, '')
                  )
                }
                autoComplete="tel"
                required
                placeholder="10-digit mobile number"
              />
            </section>

            <section className="checkout-form-section">
              <div className="checkout-section-heading">
                <span>02</span>
                <div>
                  <h2>Delivery address</h2>
                  <p>Where should your books go?</p>
                </div>
              </div>

              <label htmlFor="delivery-address">Street address</label>
              <textarea
                id="delivery-address"
                value={deliveryAddress}
                onChange={(event) =>
                  setDeliveryAddress(event.target.value)
                }
                autoComplete="street-address"
                required
                rows={3}
                placeholder="House number, street, area"
              />

              <label htmlFor="delivery-city">City</label>
              <input
                id="delivery-city"
                type="text"
                value={deliveryCity}
                onChange={(event) =>
                  setDeliveryCity(event.target.value)
                }
                autoComplete="address-level2"
                required
                placeholder="Enter your city"
              />

              <label htmlFor="delivery-pin">PIN code</label>
              <input
                id="delivery-pin"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={deliveryPin}
                onChange={(event) =>
                  setDeliveryPin(
                    event.target.value.replace(/\D/g, '')
                  )
                }
                autoComplete="postal-code"
                required
                placeholder="6-digit PIN code"
              />
            </section>

            {error && (
              <p className="checkout-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="checkout-primary-button checkout-place-order"
              type="submit"
            >
              Place Demo Order · {formatPrice(totalPrice)}
            </button>

            <p className="checkout-disclaimer">
              Demo checkout only. No payment is collected and no
              real delivery is created.
            </p>
          </form>

          <aside className="checkout-order-summary">
            <span className="checkout-eyebrow">YOUR SELECTION</span>
            <h2>Order Summary</h2>

            <div className="checkout-book-list">
              {cartItems.map((book, index) => (
                <article
                  className="checkout-book"
                  key={`${book.id}-${index}`}
                >
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      onError={(event) => {
                        event.currentTarget.style.visibility = 'hidden'
                      }}
                    />
                  ) : (
                    <div className="checkout-book-placeholder">
                      📖
                    </div>
                  )}

                  <div className="checkout-book-info">
                    <strong>{book.title}</strong>
                    <p>{book.author || 'Unknown author'}</p>
                    <span>{formatPrice(getPrice(book.price))}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="checkout-summary-row">
              <span>Books ({cartItems.length})</span>
              <strong>{formatPrice(totalPrice)}</strong>
            </div>

            <div className="checkout-summary-row">
              <span>Delivery</span>
              <strong className="checkout-free">FREE</strong>
            </div>

            <div className="checkout-summary-total">
              <span>Total</span>
              <strong>{formatPrice(totalPrice)}</strong>
            </div>

            <p className="checkout-summary-note">
              ✦ A good book is always worth the journey.
            </p>
          </aside>
        </div>
      </div>

      <footer className="checkout-footer">
        Made for readers, one page at a time. ✦
      </footer>
    </main>
  )
}

export default CheckoutPage
