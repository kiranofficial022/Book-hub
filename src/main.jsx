import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom'

import './index.css'
import App from './App.jsx'
import BooksPage from './Bookspage.jsx'
import BookDetails from './BookDetails.jsx'
import CartPage from './CartPage.jsx'
import CheckoutPage from './CheckoutPage.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import NotFound from './NotFound.jsx'
import Login from './Login.jsx'
import MyOrders from './MyOrders.jsx'
import TrackOrder from './TrackOrder.jsx'

function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('bookHubLoggedIn') === 'true'
  })

  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = () => {
    localStorage.setItem('bookHubLoggedIn', 'true')
    setIsLoggedIn(true)

    const requestedPage = location.state?.from
    const destination = requestedPage
      ? `${requestedPage.pathname}${requestedPage.search || ''}${requestedPage.hash || ''}`
      : '/books'

    navigate(destination, { replace: true })
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login onLogin={handleLogin} />}
      />

      <Route
        path="/"
        element={
          <App
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
        }
      />

      <Route
        path="/books"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <BooksPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/books/:id"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <BookDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <CartPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-orders"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <MyOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/track-order/:id"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <TrackOrder />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function Root() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
