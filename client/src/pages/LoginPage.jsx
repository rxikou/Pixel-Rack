import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/pixelrack-logo.png'

function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await signIn(email, password)
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
        <h1 className="font-pixel text-base text-accent-blue">Log In</h1>

        {error && <p className="font-mono text-xs text-accent-pink">{error}</p>}

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
          className="border-2 border-bg-primary bg-bg-primary px-3 py-2 font-mono text-sm text-text-primary outline-none focus:border-accent-blue"
        />

        <Button type="submit" variant="primary" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Logging in...' : 'Log In'}
        </Button>

        <p className="text-center font-mono text-xs text-text-secondary">
          No account?{' '}
          <Link to="/register" className="text-accent-blue hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage
