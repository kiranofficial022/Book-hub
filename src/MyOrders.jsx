
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import './Orders.css'

function MyOrders() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem('bookHubOrders') || '[]'
      )

      setOrders(Array.isArray(saved) ? saved : [])
    } catch {
      setOrders([])
    }
  }, [])

  return (
    <main className="orders-page">
      <Navbar />

      <section className="orders-container">
        <p className="eyebrow">YOUR READING JOURNEY</p>
        <h1>My Orders</h1>
        <p>View your orders and track your book deliveries.</p>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h2>No orders yet</h2>
            <p>
              Your orders will appear here after you place
              a demo order.
            </p>

            <button
              className="primary-button"
              onClick={() => navigate('/books')}
            >
              Explore Books →
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-card" key={order.id}>
                <div className="order-card-header">
                  <div>
                    <p>ORDER ID</p>
                    <strong>{order.id}</strong>
                  </div>

                  <span className="order-status">
                    {order.status || 'Order Placed'}
                  </span>
                </div>

                <p>
                  Ordered on:{' '}
                  {order.date
                    ? new Date(order.date).toLocaleDateString(
                        'en-IN'
                      )
                    : 'Date unavailable'}
                </p>

                <div className="order-items">
                  {(Array.isArray(order.items)
                    ? order.items
                    : []
                  ).map((book, index) => (
                    <p key={book.id ?? index}>
                      {book.title || 'Book'} — {book.price}
                    </p>
                  ))}
                </div>

                <h3>
                  Total: ₹
                  {Number(order.total || 0).toLocaleString(
                    'en-IN'
                  )}
                </h3>

                <button
                  className="primary-button"
                  onClick={() =>
                    navigate(`/track-order/${order.id}`)
                  }
                >
                  Track This Order →
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default MyOrders