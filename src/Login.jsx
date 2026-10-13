import { useState } from 'react'
import './Login.css'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    setError('')
   
    const normalizedEmail = email.trim().toLowerCase()

if (normalizedEmail !== 'reader@bookhub.com') {
  setError('Please check your email address.')
  return
}

if (password !== 'BookHub@123') {
  setError('Incorrect password. Please try again.')
  return
}

onLogin()
    
  }

  return (
    <div className="login-page">
      <div className="login-container">

        {/* LEFT SIDE: BOOK HUB ILLUSTRATION */}
        <div className="login-visual">
          <div className="login-artwork">
            <img
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800"
              alt="Books in a library"
            />
          </div>

          <p className="login-eyebrow">
            YOUR NEXT CHAPTER STARTS HERE
          </p>

          <h1>Every book opens a new world.</h1>

          <p className="login-message">
            Discover extraordinary stories, explore fresh ideas,
            and find your next favourite read.
          </p>

          <div className="login-decoration">
            ✦ Read. Discover. Grow.
          </div>
        </div>

        {/* RIGHT SIDE: LOGIN FORM */}
        <div className="login-form-container">
          <a href="#home" className="login-logo">
            Book<span>Hub.</span>
          </a>

          <p className="login-label">WELCOME BACK</p>

          <h2>Sign in to explore.</h2>

          <p className="login-subtitle">
            Your personal reading journey awaits.
          </p>

          <form onSubmit={handleLogin}>
            <label htmlFor="login-email">Email address</label>

            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setError('')
              }}
              required
            />

            <label htmlFor="login-password">Password</label>

            <div className="password-input-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setError('')
                }}
                required
              />

              <button
                type="button"
                className="toggle-password"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
                aria-label={
                  showPassword ? 'Hide password' : 'Show password'
                }
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default Login
