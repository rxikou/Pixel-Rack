import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../api/apiClient'
import logo from '../assets/pixelrack-logo.png'

function RegisterPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await signUp(email, password, username)
      await apiFetch('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify({ username }),
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <Link to="/">
        <img src={logo} alt="PixelRack" className="pixelated w-full max-w-xs" />
      </Link>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-3 border-2 border-bg-container bg-bg-container/40 p-6"
      >
        <h1 className="font-pixel text-base text-accent-blue">Register</h1>

        {error && <p className="font-mono text-xs text-accent-pink">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="border-2 border-bg-primary bg-bg-primary px-3 py-2 font-mono text-sm text-text-primary outline-none focus:border-accent-blue"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-2 border-bg-primary bg-bg-primary px-3 py-2 font-mono text-sm text-text-primary outline-none focus:border-accent-blue"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="border-2 border-bg-primary bg-bg-primary px-3 py-2 font-mono text-sm text-text-primary outline-none focus:border-accent-blue"
        />

        <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating account...' : 'Register'}
        </Button>

        <p className="text-center font-mono text-xs text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-blue hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterPage
