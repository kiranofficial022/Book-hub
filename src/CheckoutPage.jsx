import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar.jsx'

function CheckoutPage() {
  const navigate = useNavigate()

  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryCity, setDeliveryCity] = useState('')
  const [deliveryPin, setDeliveryPin] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)

  const [cartItems, setCartItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bookHubCart')) || []
    } catch {
      return []
    }
  })

  const totalPrice = cartItems.reduce(
    (total, book) =>
      total + Number(String(book.price).replace(/[^\d.]/g, '')),
    0
  )

  const handlePlaceOrder = (event) => {
    event.preventDefault()

    if (cartItems.length === 0) {
      alert('Your cart is empty.')
      navigate('/cart')
      return
    }

    setOrderPlaced(true)
  }

  const finishOrder = () => {
    localStorage.setItem('bookHubCart', JSON.stringify([]))
    setCartItems([])
    navigate('/books')
  }

  if (orderPlaced) {
    return (
      <main className="checkout-page">
        <Navbar />
        <div className="order-success">
          <div className="success-icon">✓</div>
          <p className="eyebrow">ORDER CONFIRMED</p>
          <h1>Thank you, {customerName}!</h1>
          <p>Your demo order has been placed successfully.</p>
          <p>
            A confirmation would be sent to {customerEmail}
            {' '}in a real application.
          </p>

          <p className="success-total">
            Order total: ₹{totalPrice.toLocaleString('en-IN')}
          </p>

          <button className="primary-button" onClick={finishOrder}>
            Continue exploring →
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="checkout-page">
      <Navbar />
      <button
        className="back-button"
        onClick={() => navigate('/cart')}
      >
        ← Back to cart
      </button>

      <p className="eyebrow">ALMOST YOURS</p>
      <h1>Checkout</h1>
      <p className="checkout-subtitle">
        Complete your details to finish your order.
      </p>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <h2>Customer details</h2>

          <label htmlFor="customer-name">Full name</label>
          <input
            id="customer-name"
            type="text"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            autoComplete="name"
            required
            placeholder="Enter your full name"
          />

          <label htmlFor="customer-email">Email address</label>
          <input
            id="customer-email"
            type="email"
            value={customerEmail}
            onChange={(event) => setCustomerEmail(event.target.value)}
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
            onChange={(event) => setCustomerPhone(event.target.value)}
            autoComplete="tel"
            required
            placeholder="10-digit mobile number"
          />

          <h2 className="address-heading">Delivery address</h2>

          <label htmlFor="delivery-address">Address</label>
          <textarea
            id="delivery-address"
            value={deliveryAddress}
            onChange={(event) => setDeliveryAddress(event.target.value)}
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
            onChange={(event) => setDeliveryCity(event.target.value)}
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
            onChange={(event) => setDeliveryPin(event.target.value)}
            autoComplete="postal-code"
            required
            placeholder="6-digit PIN code"
          />

          <button className="cart-checkout-button" type="submit">
            Place Demo Order →
          </button>

          <p className="checkout-disclaimer">
            Demo only. No payment is collected and no real order
            or delivery is created.
          </p>
        </form>

        <aside className="cart-summary">
          <h2>Your order</h2>

          {cartItems.map((book) => (
            <div className="checkout-book" key={book.id}>
              <img src={book.image} alt={book.title} />
              <div>
                <strong>{book.title}</strong>
                <p>{book.author}</p>
                <span>{book.price}</span>
              </div>
            </div>
          ))}

          <div className="cart-summary-row">
            <span>Books ({cartItems.length})</span>
            <strong>₹{totalPrice.toLocaleString('en-IN')}</strong>
          </div>

          <div className="cart-summary-row">
            <span>Delivery</span>
            <strong>Free</strong>
          </div>

          <div className="cart-total">
            <span>Total</span>
            <strong>₹{totalPrice.toLocaleString('en-IN')}</strong>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default CheckoutPage
