import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/pixelrack-logo.png'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'My Rack' },
]

function Navbar() {
  const { pathname } = useLocation()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4 border-b-2 border-accent-blue/50 bg-bg-container/90 px-6 py-3 shadow-[0_2px_20px_rgba(56,189,248,0.15)] backdrop-blur">
      <div className="flex items-center gap-6">
        <Link to="/">
          <img src={logo} alt="PixelRack" className="pixelated h-16" />
        </Link>
        <nav className="flex gap-6 font-mono text-sm font-medium uppercase tracking-wide">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={
                pathname === link.to
                  ? 'border-b-2 border-accent-blue pb-1 text-accent-blue'
                  : 'border-b-2 border-transparent pb-1 text-text-secondary hover:text-accent-blue'
              }
            >
              {link.label}
            </Link>
          ))}
          <a
            href="#upload-panel"
            className="border-b-2 border-transparent pb-1 text-text-secondary hover:text-accent-blue"
          >
            Upload
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-3 font-mono text-sm text-text-secondary">
        <span className="max-w-[16rem] truncate border-2 border-accent-blue/40 bg-bg-primary px-3 py-1.5 uppercase tracking-wide">
          <span className="text-text-secondary/70">Profile: </span>
          <span className="text-text-primary">
            {user ? (user.name ?? user.email) : 'Guest'}
          </span>
        </span>

        <span className="relative" title="Notifications">
          <span aria-hidden="true" className="text-lg">
            &#128276;
          </span>
          <span className="absolute -right-1.5 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-pink text-[10px] text-bg-primary">
            2
          </span>
        </span>

        {user && (
          <button
            type="button"
            onClick={handleSignOut}
            className="cursor-pointer border-2 border-bg-primary bg-bg-primary px-3 py-1.5 uppercase tracking-wide hover:border-accent-pink hover:text-accent-pink"
          >
            Log Out
          </button>
        )}
      </div>
    </header>
  )
}

export default Navbar
