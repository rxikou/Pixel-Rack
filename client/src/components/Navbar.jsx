import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/pixelrack-logo.png'
import houseIcon from '../assets/icons/house.png'
import rackIcon from '../assets/icons/rack.png'
import garageIcon from '../assets/icons/garage.png'
import konbiniIcon from '../assets/icons/konbini.png'
import uploadIcon from '../assets/icons/upload.png'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { to: '/', label: 'HOME', icon: houseIcon },
  { to: '/dashboard', label: 'MY RACK', icon: rackIcon },
  { to: '/garage', label: 'GARAGE', icon: garageIcon },
  { to: '/konbini', label: 'KONBINI', icon: konbiniIcon },
]

const navItemClass = (active) =>
  // Clean, crisp typography without heavy multi-pixel text-shadow to prevent double-printed ghosting
  `flex flex-col items-center gap-1 border-b-[3px] pb-1 font-bold uppercase tracking-wider transition-colors ${
    active
      ? 'border-amber-400 text-amber-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.85)]'
      : 'border-transparent text-white/90 hover:text-amber-200'
  }`

function Navbar() {
  const { pathname } = useLocation()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  function handleUploadClick(e) {
    if (pathname === '/dashboard') {
      e.preventDefault()
      const el = document.getElementById('upload-panel')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        const input = el.querySelector('input[type="file"]')
        if (input) input.focus()
      } else {
        window.location.hash = 'upload-panel'
      }
    } else {
      e.preventDefault()
      navigate('/dashboard#upload-panel')
    }
  }

  return (
    <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-2.5 border-b-[3px] border-[#05070d] bg-sky-800 px-3 py-1.5 shadow-[0_4px_0_#05070d] sm:gap-4 sm:px-6 sm:py-2">
      <div className="flex flex-wrap items-center gap-3 sm:gap-6">
        <Link to="/" className="shrink-0">
          <img src={logo} alt="PixelRack" className="pixelated h-11 sm:h-14 md:h-16" />
        </Link>
        <nav className="flex items-center gap-2 overflow-x-auto font-mono text-[10px] font-medium uppercase tracking-wide sm:gap-5 sm:text-xs md:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={navItemClass(pathname === link.to)}
            >
              <img src={link.icon} alt="" className="pixelated h-6 w-6 sm:h-8 sm:w-8" />
              <span>{link.label}</span>
            </Link>
          ))}
          <button
            type="button"
            onClick={handleUploadClick}
            className={`cursor-pointer ${navItemClass(false)}`}
          >
            <img src={uploadIcon} alt="" className="pixelated h-6 w-6 sm:h-8 sm:w-8" />
            <span>UPLOAD</span>
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-2 font-mono text-xs text-text-secondary sm:gap-3 sm:text-sm">
        <span className="pixel-inset max-w-[8rem] truncate bg-slate-900/80 px-2 py-1 text-[11px] uppercase tracking-wide sm:max-w-[16rem] sm:px-3 sm:py-1.5 sm:text-sm">
          <span className="hidden text-text-secondary/70 sm:inline">Profile: </span>
          <span className="text-text-primary">
            {user ? (user.name ?? user.email) : 'Guest'}
          </span>
        </span>

        {user && (
          <button
            type="button"
            onClick={handleSignOut}
            className="pixel-btn pixel-text cursor-pointer bg-red-500 px-2 py-1 font-pixel text-xs uppercase leading-none tracking-wide text-white hover:brightness-110 sm:px-3 sm:py-1.5 sm:text-base"
          >
            Log Out
          </button>
        )}
      </div>
    </header>
  )
}

export default Navbar
