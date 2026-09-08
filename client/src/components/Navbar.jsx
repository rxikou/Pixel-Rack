import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/pixelrack-logo.png'
import houseIcon from '../assets/icons/house.png'
import rackIcon from '../assets/icons/rack.png'
import uploadIcon from '../assets/icons/upload.png'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: houseIcon },
  { to: '/dashboard', label: 'My Rack', icon: rackIcon },
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

  return (
    <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4 border-b-[3px] border-[#05070d] bg-sky-800 px-6 py-2 shadow-[0_4px_0_#05070d]">
      <div className="flex items-center gap-6">
        <Link to="/">
          <img src={logo} alt="PixelRack" className="pixelated h-16" />
        </Link>
        <nav className="flex gap-6 font-mono text-xs font-medium uppercase tracking-wide">
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
          <a href="#upload-panel" className={navItemClass(false)}>
            <img src={uploadIcon} alt="" className="pixelated h-8 w-8" />
            Upload
          </a>
        </nav>
      </div>

      <div className="flex items-center gap-3 font-mono text-sm text-text-secondary">
        <span className="pixel-inset max-w-[16rem] truncate bg-slate-900/80 px-3 py-1.5 uppercase tracking-wide">
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
