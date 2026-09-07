import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import logo from '../assets/pixelrack-logo.png'

function Navbar({ onUploadClick }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-bg-container px-6 py-3">
      <div className="flex items-center gap-6">
        <Link to="/">
          <img src={logo} alt="PixelRack" className="pixelated h-16" />
        </Link>
        <nav className="flex gap-4 font-mono text-xs text-text-secondary">
          <Link to="/" className="hover:text-accent-blue">
            Home
          </Link>
          <Link to="/dashboard" className="hover:text-accent-blue">
            My Rack
          </Link>
          <button
            type="button"
            onClick={onUploadClick}
            className="cursor-pointer hover:text-accent-blue"
          >
            Upload
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-3 font-mono text-xs text-text-secondary">
        <span className="relative">
          <span aria-hidden="true">&#9679;</span>
          <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent-pink text-[9px] text-bg-primary">
            2
          </span>
        </span>
        <span>Guest</span>
      </div>
    </header>
  )
}

Navbar.propTypes = {
  onUploadClick: PropTypes.func,
}

export default Navbar
