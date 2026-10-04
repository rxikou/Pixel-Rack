import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/pixelrack-logo.png'
import houseIcon from '../assets/icons/house.png'
import rackIcon from '../assets/icons/rack.png'
import garageIcon from '../assets/icons/garage.png'
import konbiniIcon from '../assets/icons/konbini.png'
import uploadIcon from '../assets/icons/upload.png'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: houseIcon },
  { to: '/dashboard', label: 'My Rack', icon: rackIcon },
  { to: '/garage', label: 'Garage', icon: garageIcon },
  { to: '/konbini', label: 'Konbini', icon: konbiniIcon },
]

const navItemClass = (active) =>
  // Against the solid blue bar, grey-on-blue reads poorly; white with an
  // amber active state gives the high-contrast pop the reference UI uses.
  `pixel-text flex flex-col items-center gap-1 border-b-[3px] pb-1 ${
    active
      ? 'border-amber-400 text-amber-300'
      : 'border-transparent text-white/85 hover:text-amber-200'
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
    <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4 border-b-[3px] border-[#05070d] bg-sky-800 px-6 py-2 shadow-[0_4px_0_#05070d]">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <Link to="/">
          <img src={logo} alt="PixelRack" className="pixelated h-16" />
        </Link>
        <nav className="flex flex-wrap gap-3 font-mono text-xs font-medium uppercase tracking-wide sm:gap-5 md:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={navItemClass(pathname === link.to)}
            >
              <img src={link.icon} alt="" className="pixelated h-8 w-8" />
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={handleUploadClick}
            className={`cursor-pointer ${navItemClass(false)}`}
          >
            <img src={uploadIcon} alt="" className="pixelated h-8 w-8" />
            Upload
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-3 font-mono text-sm text-text-secondary">
        <span className="pixel-inset max-w-[16rem] truncate bg-slate-900/80 px-3 py-1.5 uppercase tracking-wide">
          <span className="text-text-secondary/70">Profile: </span>
          <span className="text-text-primary">
            {user ? (user.name ?? user.email) : 'Guest'}
          </span>
        </span>

        {user && (
          <button
            type="button"
            onClick={handleSignOut}
            className="pixel-btn pixel-text cursor-pointer bg-red-500 px-3 py-1.5 font-pixel text-base uppercase leading-none tracking-wide text-white hover:brightness-110"
          >
            Log Out
          </button>
        )}
      </div>
    </header>
  )
}

export default Navbar
