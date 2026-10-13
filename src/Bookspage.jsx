import { useNavigate, useLocation } from 'react-router-dom'
import { books } from './books.js'
import Navbar from './Navbar.jsx'

function BooksPage() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <main className="books-section">
      <Navbar />
      <div className="section-heading">
        <div>
          <p className="eyebrow">YOUR BOOK HUB</p>
          <h2>Explore All Books</h2>
          <p>
            Discover your next favourite read.
          </p>
        </div>
      </div>

      <p className="book-count">
        Current page: {location.pathname}
      </p>

      <div className="book-grid">
        {books.map((book) => (
          <article className="book-card" key={book.id}>
            <div className="book-image">
              <img src={book.image} alt={book.title} />
            </div>

            <div className="book-info">
              <h3>{book.title}</h3>
              <p>{book.author}</p>

              <div className="book-bottom">
                <strong>{book.price}</strong>

<article className="book-card" key={book.id}>
  <div
    className="book-image"
    onClick={() => navigate(`/books/${book.id}`)}
    role="link"
    tabIndex={0}
    onKeyDown={(event) => {
      if (event.key === 'Enter') {
        navigate(`/books/${book.id}`)
      }
    }}
    style={{ cursor: 'pointer' }}
  >
    <img src={book.image} alt={book.title} />
  </div>

  <div className="book-info">
    <h3
      onClick={() => navigate(`/books/${book.id}`)}
      style={{ cursor: 'pointer' }}
    >
      {book.title}
    </h3>

    <p>{book.author}</p>

    <div className="book-bottom">
      <strong>{book.price}</strong>

      <button
        onClick={() => navigate(`/books/${book.id}`)}
        aria-label={`View ${book.title}`}
      >
        View details →
      </button>
    </div>
  </div>
</article>


              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export default BooksPage
