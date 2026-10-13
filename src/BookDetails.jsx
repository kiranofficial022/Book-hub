import { useParams, useNavigate } from 'react-router-dom'
import { books } from './books.js'
import Navbar from './Navbar.jsx'

function BookDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const book = books.find(
    (item) => String(item.id) === id
  )

  if (!book) {
    return (
      <div className="details-page">
        <h1>Book not found</h1>
        <button
          className="primary-button"
          onClick={() => navigate('/books')}
        >
          Back to Books
        </button>
      </div>
    )
  }

  return (
    <main className="details-page">
        <Navbar />
      <button
        className="back-button"
        onClick={() => navigate('/books')}
      >
        ← Back to Books
      </button>

      <div className="details-card">
        <div className="details-image">
          <img src={book.image} alt={book.title} />
        </div>

        <div className="details-content">
          <span className="details-category">
            {book.category}
          </span>

          <h1>{book.title}</h1>
          <p className="details-author">By {book.author}</p>

          <p className="details-description">
            {book.description ||
              'Explore this book and discover new ideas.'}
          </p>

          <p className="details-price">{book.price}</p>

          <button
            className="primary-button"
            onClick={() => navigate('/books')}
          >
            Explore More Books →
          </button>
        </div>
      </div>
    </main>
  )
}

export default BookDetails
