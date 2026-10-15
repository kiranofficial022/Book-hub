import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import './Orders.css'

const statuses = [
  'Order Placed',
  'Confirmed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
]

function readOrders() {
  try {
    const saved = JSON.parse(
      localStorage.getItem('bookHubOrders') || '[]'
    )

    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function TrackOrder() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(() =>
    readOrders().find((item) => String(item.id) === id) || null
  )

  const [error, setError] = useState('')

  const currentStatusIndex = order
    ? statuses.indexOf(order.status)
    : -1

  const history = Array.isArray(order?.history)
    ? order.history
    : []

  const handleAdvanceStatus = () => {
    if (!order) return

    const currentIndex = statuses.indexOf(order.status)

    if (currentIndex < 0 || currentIndex >= statuses.length - 1) {
      return
    }

    const nextStatus = statuses[currentIndex + 1]
    const now = new Date().toISOString()

    const updatedOrder = {
      ...order,
      status: nextStatus,
      history: [
        ...history,
        { status: nextStatus, date: now },
      ],
    }

    const orders = readOrders()
    const updatedOrders = orders.map((item) =>
      String(item.id) === id ? updatedOrder : item
    )

    try {
      localStorage.setItem(
        'bookHubOrders',
        JSON.stringify(updatedOrders)
      )

      setOrder(updatedOrder)
      setError('')
    } catch {
      setError('Unable to update the demo tracking status.')
    }
  }

  if (!order) {
    return (
      <main className="orders-page">
        <Navbar />

        <section className="orders-container">
          <h1>Order not found</h1>
          <p>
            We couldn't find that order in this browser.
            Open My Orders and select one of your saved orders.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate('/my-orders')}
          >
            View My Orders
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="orders-page">
      <Navbar />

      <section className="orders-container">
        <p className="eyebrow">YOUR ORDER JOURNEY</p>
        <h1>Track Your Order</h1>
        <p>Follow the progress of your book order.</p>

        <article className="order-card">
          <div className="order-card-header">
            <div>
              <p>ORDER ID</p>
              <strong>{order.id}</strong>
            </div>

            <span className="order-status">
              {order.status}
            </span>
          </div>

          <p>
            Ordered on:{' '}
            {order.date
              ? new Date(order.date).toLocaleString('en-IN')
              : 'Date unavailable'}
          </p>

          <h2>Delivery progress</h2>

          <div className="tracking-timeline">
            {statuses.map((status, index) => {
              const completed = index <= currentStatusIndex

              const event = history.find(
                (item) => item.status === status
              )

              return (
                <div
                  className={`tracking-step ${
                    completed ? 'completed' : ''
                  }`}
                  key={status}
                >
                  <div className="tracking-marker">
                    {completed ? '✓' : index + 1}
                  </div>

                  <div className="tracking-step-content">
                    <strong>{status}</strong>

                    {event && (
                      <p>
                        {new Date(event.date).toLocaleString(
                          'en-IN'
                        )}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <h2>Items in your order</h2>

          {(Array.isArray(order.items) ? order.items : []).map(
            (book, index) => (
              <p key={book.id ?? index}>
                {book.title} — {book.price}
              </p>
            )
          )}

          <h3>
            Total: ₹
            {Number(order.total || 0).toLocaleString('en-IN')}
          </h3>

          {error && <p className="checkout-error">{error}</p>}

          {currentStatusIndex < statuses.length - 1 &&
            currentStatusIndex >= 0 && (
              <button
                className="primary-button"
                onClick={handleAdvanceStatus}
              >
                Advance Demo Status →
              </button>
            )}

          <p className="checkout-disclaimer">
            Demo tracking only. Advancing the status simulates
            delivery progress; no real courier is connected.
          </p>

          <button
            className="back-button"
            onClick={() => navigate('/my-orders')}
          >
            ← Back to My Orders
          </button>
        </article>
      </section>
    </main>
  )
}

export default TrackOrder
