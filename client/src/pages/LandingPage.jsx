import { Link } from 'react-router-dom'
import Button from '../components/Button'
import logo from '../assets/pixelrack-logo.png'

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg-primary px-4 text-center">
      <img src={logo} alt="PixelRack" className="pixelated w-full max-w-lg" />

      <p className="max-w-md font-mono text-text-secondary">
        Digitize your Hot Wheels collection into a pixel art display.
      </p>

      <div className="flex gap-3">
        <Link to="/dashboard">
          <Button variant="secondary">Log In</Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="primary">Register</Button>
        </Link>
      </div>
    </div>
  )
}

export default LandingPage
