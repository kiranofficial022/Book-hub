import { Routes, Route, Navigate } from 'react-router-dom'
import BooksPage from './Bookspage.jsx'
import { useState, useEffect } from 'react'
import './App.css'
import { books } from './books.js'
import Login from './Login'
import MyAccount from './MyAccount';

function App({isLoggedIn, setIsLoggedIn}) {
  // Navigation states
  const [showCart, setShowCart] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showAccount, setShowAccount] = useState(false)

  // Checkout form states
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryCity, setDeliveryCity] = useState('')
  const [deliveryPin, setDeliveryPin] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)

  // Book selection and favourites
  const [selectedBook, setSelectedBook] = useState(null)

  const [favoriteBooks, setFavoriteBooks] = useState(() => {
    try {
      const savedFavorites = localStorage.getItem('bookHubFavorites')
      return savedFavorites ? JSON.parse(savedFavorites) : []
    } catch {
      return []
    }
  })

  // Persistent shopping cart
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('bookHubCart')
      return savedCart ? JSON.parse(savedCart) : []
    } catch {
      return []
    }
  })

  // Login and search states
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Save favourites
  useEffect(() => {
    localStorage.setItem(
      'bookHubFavorites',
      JSON.stringify(favoriteBooks)
    )
  }, [favoriteBooks])

  // Save cart
  useEffect(() => {
    localStorage.setItem(
      'bookHubCart',
      JSON.stringify(cartItems)
    )
  }, [cartItems])

  // Toggle favourites
  const toggleFavourite = (bookId) => {
    setFavoriteBooks((currentFavoriteBooks) =>
      currentFavoriteBooks.includes(bookId)
        ? currentFavoriteBooks.filter((id) => id !== bookId)
        : [...currentFavoriteBooks, bookId]
    )
  }

  // Add book to cart
  const addToCart = (book) => {
    setCartItems((currentItems) => {
      const alreadyAdded = currentItems.some(
        (item) => item.id === book.id
      )

      if (alreadyAdded) {
        alert('This book is already in your cart!')
        return currentItems
      }

      alert(`${book.title} added to your cart!`)
      return [...currentItems, book]
    })
  }

  // Login page
  if (!isLoggedIn) {
  return (
    <Login
      onLogin={() => {
        localStorage.setItem('bookHubLoggedIn', 'true')
        setIsLoggedIn(true)
      }}
    />
  )
}

  // Book categories
  const categories = [
    'All',
    ...new Set(books.map((book) => book.category)),
    'Favourites',
  ]

  // Search and category filtering
  const filteredBooks = books.filter((book) => {
    const query = searchTerm.toLowerCase().trim()

    const matchesSearch =
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)

    const matchesCategory =
      selectedCategory === 'All' ||
      (selectedCategory === 'Favourites'
        ? favoriteBooks.includes(book.id)
        : book.category === selectedCategory)

    return matchesSearch && matchesCategory
  })

  // Calculate cart total
  const totalPrice = cartItems.reduce(
    (total, book) =>
      total + Number(String(book.price).replace(/[^\d.]/g, '')),
    0
  )

  // Handle demo order submission
  const handlePlaceOrder = (event) => {
    event.preventDefault()

    if (cartItems.length === 0) {
      alert('Your cart is empty.')
      setShowCheckout(false)
      setShowCart(true)
      return
    }

    setOrderPlaced(true)
  }

  // ==========================================
  // CHECKOUT PAGE — MUST COME BEFORE CART PAGE
  // ==========================================
  // MY ACCOUNT PAGE
  
if (showAccount) {
  return (
    <MyAccount
      onBack={() => setShowAccount(false)}
      onBrowseBooks={() => setShowAccount(false)}
      onOpenCart={() => {
        setShowAccount(false)
        setShowCart(true)
      }}
      onLogout={() => {
        localStorage.removeItem('bookHubLoggedIn')
        setIsLoggedIn(false)
        setShowAccount(false)
        setShowCart(false)
        setShowCheckout(false)
        setSelectedBook(null)
      }}
    />
  )
}
if (showCheckout) {
    return (
      <div className="app">
        <header className="navbar">
          <a
            className="logo"
            href="#home"
            onClick={(event) => {
              event.preventDefault()
              setShowCheckout(false)
              setShowCart(false)
              setSelectedBook(null)
            }}
          >
            Book<span>Hub.</span>
          </a>

          {!orderPlaced && (
            <button
              className="nav-button"
              onClick={() => {
                setShowCheckout(false)
                setShowCart(true)
              }}
            >
              ← Back to cart
            </button>
          )}
        </header>

        <main className="checkout-page">
          {orderPlaced ? (
            <div className="order-success">
              <div className="success-icon">✓</div>

              <p className="eyebrow">ORDER CONFIRMED</p>

              <h1>Thank you, {customerName}!</h1>

              <p>
                Your demo order has been placed successfully.
              </p>

              <p>
                A confirmation would be sent to {customerEmail}
                {' '}in a real application.
              </p>

              <p className="success-total">
                Order total: ₹{totalPrice.toLocaleString('en-IN')}
              </p>

              <button
                className="primary-button"
                onClick={() => {
                  setCartItems([])
                  setShowCheckout(false)
                  setShowCart(false)
                  setOrderPlaced(false)
                  setSelectedBook(null)
                  setSearchTerm('')
                  setSelectedCategory('All')
                }}
              >
                Continue exploring →
              </button>
            </div>
          ) : (
            <>
              <p className="eyebrow">ALMOST YOURS</p>

              <h1>Checkout</h1>

              <p className="checkout-subtitle">
                Complete your details to finish your order.
              </p>

              <div className="checkout-layout">
                <form
                  className="checkout-form"
                  onSubmit={handlePlaceOrder}
                >
                  <h2>Customer details</h2>

                  <label htmlFor="customer-name">
                    Full name
                  </label>

                  <input
                    id="customer-name"
                    type="text"
                    value={customerName}
                    onChange={(event) =>
                      setCustomerName(event.target.value)
                    }
                    required
                    autoComplete="name"
                    placeholder="Enter your full name"
                  />

                  <label htmlFor="customer-email">
                    Email address
                  </label>

                  <input
                    id="customer-email"
                    type="email"
                    value={customerEmail}
                    onChange={(event) =>
                      setCustomerEmail(event.target.value)
                    }
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                  />

                  <label htmlFor="customer-phone">
                    Phone number
                  </label>

                  <input
                    id="customer-phone"
                    type="tel"
                    inputMode="numeric"
                    value={customerPhone}
                    onChange={(event) =>
                      setCustomerPhone(event.target.value)
                    }
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    autoComplete="tel"
                    placeholder="10-digit mobile number"
                  />

                  <h2 className="address-heading">
                    Delivery address
                  </h2>

                  <label htmlFor="delivery-address">
                    Address
                  </label>

                  <textarea
                    id="delivery-address"
                    value={deliveryAddress}
                    onChange={(event) =>
                      setDeliveryAddress(event.target.value)
                    }
                    required
                    autoComplete="street-address"
                    placeholder="House number, street, area"
                    rows={3}
                  />

                  <label htmlFor="delivery-city">
                    City
                  </label>

                  <input
                    id="delivery-city"
                    type="text"
                    value={deliveryCity}
                    onChange={(event) =>
                      setDeliveryCity(event.target.value)
                    }
                    required
                    autoComplete="address-level2"
                    placeholder="Enter your city"
                  />

                  <label htmlFor="delivery-pin">
                    PIN code
                  </label>

                  <input
                    id="delivery-pin"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={deliveryPin}
                    onChange={(event) =>
                      setDeliveryPin(event.target.value)
                    }
                    required
                    autoComplete="postal-code"
                    placeholder="6-digit PIN code"
                  />

                  <button
                    className="cart-checkout-button"
                    type="submit"
                  >
                    Place Demo Order →
                  </button>

                  <p className="checkout-disclaimer">
                    Demo only. No payment is collected and no real
                    order or delivery is created.
                  </p>
                </form>

                <aside className="cart-summary">
                  <h2>Your order</h2>

                  {cartItems.map((book) => (
                    <div
                      className="checkout-book"
                      key={book.id}
                    >
                      <img
                        src={book.image}
                        alt={book.title}
                      />

                      <div>
                        <strong>{book.title}</strong>
                        <p>{book.author}</p>
                        <span>{book.price}</span>
                      </div>
                    </div>
                  ))}

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
                </aside>
              </div>
            </>
          )}
        </main>

        <footer>
          <a className="logo" href="#home">
            Book<span>Hub.</span>
          </a>
          <p>Made for curious minds. © 2026 Book Hub.</p>
        </footer>
      </div>
    )
  }

  // ==========================================
  // SHOPPING CART PAGE
  // ==========================================

  if (showCart) {
    return (
      <div className="app">
        <header className="navbar">
          <a
            className="logo"
            href="#home"
            onClick={(event) => {
              event.preventDefault()
              setShowCart(false)
              setSelectedBook(null)
            }}
          >
            Book<span>Hub.</span>
          </a>

          <button
            className="nav-button"
            onClick={() => setShowCart(false)}
          >
            ← Continue shopping
          </button>
        </header>

        <main className="cart-page">
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
                onClick={() => setShowCart(false)}
              >
                Explore books →
              </button>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-list">
                {cartItems.map((book) => (
                  <article
                    className="cart-item"
                    key={book.id}
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                    />

                    <div className="cart-item-info">
                      <h3>{book.title}</h3>
                      <p>By {book.author}</p>
                      <strong>{book.price}</strong>

                      <button
                        className="remove-cart-button"
                        onClick={() =>
                          setCartItems((items) =>
                            items.filter(
                              (item) => item.id !== book.id
                            )
                          )
                        }
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
                  type="button"
                  onClick={() => {
                    if (cartItems.length > 0) {
                      setShowCart(false)
                      setShowCheckout(true)
                    }
                  }}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout →
                </button>
              </aside>
            </div>
          )}
        </main>

        <footer>
          <a
            className="logo"
            href="#home"
            onClick={(event) => {
              event.preventDefault()
              setShowCart(false)
            }}
          >
            Book<span>Hub.</span>
          </a>

          <p>Made for curious minds. © 2026 Book Hub.</p>
        </footer>
      </div>
    )
  }

  // ==========================================
  // BOOK DETAILS PAGE
  // ==========================================

  if (selectedBook) {
    return (
      <div className="app">
        <header className="navbar">
          <a
            className="logo"
            href="#"
            onClick={(event) => {
              event.preventDefault()
              setSelectedBook(null)
            }}
          >
            Book<span>Hub.</span>
          </a>

          <div className="nav-actions">
            <button
              className="cart-nav-button"
              onClick={() => setShowCart(true)}
            >
              <span className="cart-icon">🛒</span>
              <span>Cart</span>
              <span className="cart-count">
                {cartItems.length}
              </span>
            </button>

            <button
              className="nav-button"
              onClick={() => setSelectedBook(null)}
            >
              ← Back to books
            </button>
          </div>
        </header>

        <main className="details-page">
          <button
            className="back-button"
            onClick={() => setSelectedBook(null)}
          >
            ← Back to collection
          </button>

          <div className="details-card">
            <div className="details-image">
              <img
                src={selectedBook.image}
                alt={selectedBook.title}
              />
            </div>

            <div className="details-content">
              <span className="details-category">
                {selectedBook.category}
              </span>

              <h1>{selectedBook.title}</h1>

              <p className="details-author">
                By {selectedBook.author}
              </p>

              <div className="details-rating">
                <span>★★★★★</span>
                <small>Discover your next great read</small>
              </div>

              <div className="details-availability">
                <span className="availability-dot"></span>
                Available in Book Hub
              </div>

              <p className="details-description">
                {selectedBook.description ||
                  'Discover this book and explore its ideas, insights, and lessons.'}
              </p>

              <p className="details-price">
                {selectedBook.price}
              </p>

              <div className="details-actions">
                <button
                  className="primary-button"
                  onClick={() => setSelectedBook(null)}
                >
                  Continue exploring →
                </button>

                <button
                  className="cart-button"
                  onClick={() => addToCart(selectedBook)}
                >
                  🛒 Add to Cart
                </button>

                <button
                  className="details-favourite-button"
                  onClick={() =>
                    toggleFavourite(selectedBook.id)
                  }
                >
                  {favoriteBooks.includes(selectedBook.id)
                    ? '♥ Remove Favourite'
                    : '♡ Add to Favourites'}
                </button>
              </div>
            </div>
          </div>
        </main>

        <footer>
          <a
            className="logo"
            href="#"
            onClick={(event) => {
              event.preventDefault()
              setSelectedBook(null)
            }}
          >
            Book<span>Hub.</span>
          </a>

          <p>Made for curious minds. © 2026 Book Hub.</p>
        </footer>
      </div>
    )
  }

  // ==========================================
  // MAIN BOOK HUB HOMEPAGE
  // ==========================================

  return (
    <div className="app">
      <header className="navbar">
        <a className="logo" href="#home">
          Book<span>Hub.</span>
        </a>

        <nav>
          <a href="#home">Home</a>
          <a href="#books">Explore Books</a>
          <a href="#about">About</a>
          
        </nav>

        <div className="nav-actions">
          <button
            className="cart-nav-button"
            onClick={() => setShowCart(true)}
          >
            <span className="cart-icon">🛒</span>
            <span>Cart</span>
            <span className="cart-count">
              {cartItems.length}
            </span>
          </button>

          <a className="nav-button" href="#books">
            Browse Library ↗
          </a>

<button
  className="nav-button"
  onClick={() => setShowAccount(true)}
>
  My Account
</button>


          <button
            className="logout-button"
            onClick={() => {
              setIsLoggedIn(false)
              setSelectedBook(null)
              setShowCart(false)
              setShowCheckout(false)
            }}
          >
            Log out
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="eyebrow">
              YOUR NEXT CHAPTER STARTS HERE
            </p>

            <h1>
              Discover stories.
              <br />
              <span>Expand your world.</span>
            </h1>

            <p className="hero-description">
              Find your next favourite book, explore new ideas,
              and make every page count.
            </p>

            <a className="primary-button" href="#books">
              Explore the collection →
            </a>

            <div className="hero-stats">
              <div>
                <strong>{books.length}+</strong>
                <small>Books to explore</small>
              </div>

              <div>
                <strong>
                  {new Set(books.map((book) => book.category)).size}+
                </strong>
                <small>Categories</small>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-circle"></div>

            <img
              src="https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg"
              alt="Atomic Habits book cover"
            />

            <div className="floating-card">
              <span>✦ Reader's pick</span>
              <strong>Small habits, big changes.</strong>
            </div>
          </div>
        </section>

        <section className="books-section" id="books">
          <div className="section-heading">
            <div>
              <p className="eyebrow">HANDPICKED FOR YOU</p>
              <h2>Popular this week</h2>
            </div>

            <span className="book-count">
              {filteredBooks.length} books found ↗
            </span>
          </div>

          <div className="book-tools">
            <input
              type="text"
              className="book-search"
              placeholder="Search books by title or author..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  selectedCategory === category
                    ? 'category-button active'
                    : 'category-button'
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="book-grid">
            {filteredBooks.map((book) => (
              <article
                className="book-card"
                key={book.id}
              >
                <div className="book-image">
                  <img
                    src={book.image}
                    alt={book.title}
                  />

                  <span className="book-category">
                    {book.category}
                  </span>

                  <button
                    className="favourite-button"
                    onClick={() => toggleFavourite(book.id)}
                    aria-label={
                      favoriteBooks.includes(book.id)
                        ? 'Remove from favourites'
                        : 'Add to favourites'
                    }
                  >
                    {favoriteBooks.includes(book.id) ? '♥' : '♡'}
                  </button>
                </div>

                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>

                  <div className="book-bottom">
                    <strong>{book.price}</strong>

                    <button
                      aria-label={`View ${book.title}`}
                      onClick={() => setSelectedBook(book)}
                    >
                      ↗
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {filteredBooks.length === 0 && (
              <p className="no-results">
                No books found. Try another search or category.
              </p>
            )}
          </div>
        </section>

        <section className="about-section" id="about">
          <p className="eyebrow">MORE THAN JUST BOOKS</p>

          <h2>A little reading goes a long way.</h2>

          <p>
            Book Hub brings great reads and curious minds together.
            Your next favourite story is waiting for you.
          </p>

          <a href="#home" className="primary-button">
            Back to top ↑
          </a>
        </section>
      </main>

      <footer>
        <a className="logo" href="#home">
          Book<span>Hub.</span>
        </a>

        <p>Made for curious minds. © 2026 Book Hub.</p>
      </footer>
    </div>
  )
}

export default App
