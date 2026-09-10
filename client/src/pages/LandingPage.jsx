import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Panel from '../components/Panel'
import Footer from '../components/Footer'
import EnvironmentThumb from '../components/EnvironmentThumb'
import { useAuth } from '../context/AuthContext'
import landingArt from '../assets/landing-art.webp'
import startingArt from '../assets/starting-art.webp'
import theme from '../assets/midnight_velocity.mp3'

const STAGES = ['Collect', 'Organize', 'Showcase']

const STEPS = [
  {
    step: '01',
    title: 'Photograph',
    body: 'Shoot your die-cast on any surface. A plain background helps, but the pipeline trims whatever is behind it.',
    badge: 'bg-sky-500',
    rule: 'bg-sky-400',
  },
  {
    step: '02',
    title: 'Pixelate',
    body: 'The car is redrawn as a sprite, then locked to a 96x72 canvas and a 16 colour cap so every car matches.',
    badge: 'bg-fuchsia-500',
    rule: 'bg-fuchsia-400',
  },
  {
    step: '03',
    title: 'Display',
    body: 'Your sprite lands on the rack, and you can move it into any environment you have unlocked.',
    badge: 'bg-green-500',
    rule: 'bg-green-400',
  },
]

const SCENES = [
  {
    id: 'rack',
    name: 'The Rack',
    capacity: 'All cars',
    blurb: 'Your whole collection on a wooden shelf.',
  },
  {
    id: 'garage',
    name: 'Virtual Garage',
    capacity: '2 slots',
    blurb: 'Two cars up on the lift, getting cleaned.',
  },
  {
    id: 'konbini',
    name: '7-11 Japan',
    capacity: '3 slots',
    blurb: 'Three cars parked under Mt Fuji at dusk.',
  },
]

// Softer and rounder than the chunky pixel-btn used inside the app, matching
// the hero treatment in the approved mockup. One text treatment for every
// variant: white with the black pixel outline, since the outline is what
// carries contrast and reads fine on yellow as well as blue.
function HeroButton({ to, icon, children, variant = 'secondary' }) {
  const SKINS = {
    primary: 'border-sky-300/60 bg-gradient-to-b from-sky-400 to-sky-600',
    yellow: 'border-amber-200/70 bg-gradient-to-b from-amber-300 to-amber-500',
    secondary: 'border-slate-500/70 bg-slate-900/80 hover:bg-slate-800/80',
  }

  return (
    <Link
      to={to}
      className={`flex min-w-[11rem] items-center justify-center gap-3 rounded-lg border-2 px-7 py-3.5 text-white shadow-[0_4px_0_rgba(5,7,13,0.55)] transition hover:brightness-110 ${SKINS[variant]}`}
    >
      {icon && <img src={icon} alt="" className="pixelated h-7 w-7" />}
      <span className="pixel-text font-pixel text-2xl uppercase leading-none tracking-wide">
        {children}
      </span>
    </Link>
  )
}
HeroButton.propTypes = {
  to: PropTypes.string.isRequired,
  icon: PropTypes.string,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'yellow', 'secondary']),
}

// Comfortable background level, not a blast: loud autoplaying audio is the
// single most common reason people bounce off a landing page immediately.
// Starts muted (browsers block unmuted autoplay anyway) and remembers the
// visitor's choice, so returning to the page does not surprise them either
// way.
const THEME_VOLUME = 0.25
const MUTE_KEY = 'pixelrack-theme-muted'

function MusicToggle() {
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(() => {
    try {
      const stored = localStorage.getItem(MUTE_KEY)
      return stored === null ? true : stored === 'true'
    } catch {
      return true
    }
  })

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = THEME_VOLUME
    if (muted) {
      audio.pause()
    } else {
      // Play can still reject if the browser has not registered a user
      // gesture yet; that just leaves the toggle showing "muted" to retry.
      audio.play().catch(() => setMuted(true))
    }
  }, [muted])

  function toggle() {
    setMuted((prev) => {
      const next = !prev
      try {
        localStorage.setItem(MUTE_KEY, String(next))
      } catch {
        // Private browsing or storage disabled: the toggle still works for
        // this visit, it just will not be remembered next time.
      }
      return next
    })
  }

  return (
    <>
      <audio ref={audioRef} src={theme} loop />
      <button
        type="button"
        onClick={toggle}
        aria-label={muted ? 'Play background music' : 'Mute background music'}
        aria-pressed={!muted}
        className="pixel-text absolute right-4 top-4 z-10 flex items-center gap-2 rounded-md border-2 border-slate-500/70 bg-slate-900/80 px-3 py-2 font-mono text-[11px] uppercase tracking-wide text-white transition hover:bg-slate-800/80"
      >
        <span aria-hidden="true">{muted ? '🔇' : '🔊'}</span>
        {muted ? 'Music Off' : 'Music On'}
      </button>
    </>
  )
}

function Hero({ user }) {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden border-b-[3px] border-[#05070d]">
      <img
        src={landingArt}
        alt="A pixel art PixelRack storefront at sunset, with a truck parked on the coast road"
        className="pixelated absolute inset-0 h-full w-full object-cover"
      />

      {/* The art is dark enough to carry white text on its own, so this only
          lifts contrast where the copy sits. */}
      <div className="absolute inset-0 bg-bg-primary/75" />

      <MusicToggle />

      <div className="relative w-full px-6 py-14">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <img
            src={startingArt}
            alt="A collector photographing a Hot Wheels car, surrounded by pixel art cars, under the PixelRack banner"
            className="pixelated w-[min(86vw,60vh,36rem)] drop-shadow-[0_6px_0_rgba(5,7,13,0.45)]"
          />

          <div className="mt-6 flex items-center gap-3 font-pixel text-xl uppercase tracking-[0.15em] text-white sm:text-2xl">
            {STAGES.map((stage, i) => (
              <span key={stage} className="flex items-center gap-3">
                {i > 0 && <span className="text-accent-blue">&gt;</span>}
                <span className="pixel-text">{stage}</span>
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {user ? (
              <HeroButton to="/dashboard" variant="primary">
                Enter My Rack
              </HeroButton>
            ) : (
              <>
                <HeroButton to="/login" variant="primary">
                  Login
                </HeroButton>
                <HeroButton to="/register" variant="yellow">
                  Sign Up
                </HeroButton>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
Hero.propTypes = { user: PropTypes.object }

function LandingPage() {
  const { user } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <Hero user={user} />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-6 py-8">
        <Panel title="How It Works">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {STEPS.map(({ step, title, body, badge, rule }, i) => (
              <div key={step} className="relative flex">
                <div className="pixel-inset flex w-full flex-col bg-bg-primary/60">
                  {/* colour coded cap, so the three stages read as a sequence */}
                  <div className={`h-1.5 w-full ${rule}`} />

                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`pixel-text flex h-9 w-9 shrink-0 items-center justify-center border-2 border-[#05070d] font-pixel text-xl leading-none text-white ${badge}`}
                      >
                        {step}
                      </span>
                      <h3 className="pixel-text font-pixel text-xl uppercase leading-none tracking-wide text-white">
                        {title}
                      </h3>
                    </div>

                    <p className="mt-3 font-mono text-xs leading-relaxed text-text-secondary">
                      {body}
                    </p>
                  </div>
                </div>

                {/* connector between stages, desktop only */}
                {i < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="pixel-text absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 font-pixel text-2xl text-accent-blue sm:block"
                  >
                    &gt;
                  </span>
                )}
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Where Your Cars Live">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {SCENES.map(({ id, name, capacity, blurb }) => (
              <div
                key={id}
                className="pixel-panel group flex flex-col overflow-hidden bg-bg-primary/40"
              >
                <div className="relative">
                  <EnvironmentThumb
                    environmentId={id}
                    className="h-32 transition duration-200 group-hover:brightness-110"
                  />

                  {/* scrim so the name stays legible over any artwork */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#05070d] via-[#05070d]/70 to-transparent" />

                  <span className="pixel-text absolute bottom-2 left-2 right-2 font-pixel text-lg uppercase leading-none tracking-wide text-white">
                    {name}
                  </span>

                  <span className="absolute right-2 top-2 border-2 border-[#05070d] bg-sky-600 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-white">
                    {capacity}
                  </span>
                </div>

                <p className="flex-1 px-3 py-2 font-mono text-[11px] leading-relaxed text-text-secondary">
                  {blurb}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </main>

      <Footer />
    </div>
  )
}

export default LandingPage
