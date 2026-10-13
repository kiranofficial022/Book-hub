
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="not-found-page">
      <p className="eyebrow">OOPS! WRONG PAGE</p>

      <h1>404</h1>

      <h2>This page has turned a blank page.</h2>

      <p>
        We couldn't find the page you're looking for.
        Let's get you back to your next great read.
      </p>

      <Link className="primary-button" to="/">
        Back to Home →
      </Link>
    </main>
  )
}

export default NotFound
