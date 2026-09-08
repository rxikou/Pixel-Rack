import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Panel from './Panel'
import EnvironmentThumb from './EnvironmentThumb'

// Each environment is now its own page rather than a backdrop for the rack,
// so these cards navigate instead of reskinning the shelf in place.
const ROUTES = {
  rack: '/dashboard',
  garage: '/garage',
  konbini: '/konbini',
}

function EnvironmentGallery({ environments }) {
  return (
    <Panel title="Virtual Settings & Unlockables">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {environments.map((env) => {
          const to = ROUTES[env.id]
          const locked = Boolean(env.isPremium) || !to

          const card = (
            <>
              <EnvironmentThumb environmentId={env.id} />
              <div className="flex w-full items-center justify-between gap-2 bg-slate-800 px-3 py-2">
                <span className="pixel-text truncate font-pixel text-base uppercase tracking-wide text-white">
                  {env.name}
                </span>
                <span
                  className={`shrink-0 font-mono text-[10px] uppercase tracking-wide ${
                    locked ? 'text-text-secondary/60' : 'text-accent-blue'
                  }`}
                >
                  {locked ? 'Locked' : env.slots > 0 ? `${env.slots} slots` : 'Visit'}
                </span>
              </div>
            </>
          )

          if (locked) {
            return (
              <div
                key={env.id}
                title="Not available yet"
                className="pixel-panel flex cursor-not-allowed flex-col overflow-hidden opacity-60"
              >
                {card}
              </div>
            )
          }

          return (
            <Link
              key={env.id}
              to={to}
              className="pixel-panel flex flex-col overflow-hidden hover:brightness-110"
            >
              {card}
            </Link>
          )
        })}
      </div>
    </Panel>
  )
}

EnvironmentGallery.propTypes = {
  environments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      isPremium: PropTypes.bool,
      slots: PropTypes.number,
    }),
  ).isRequired,
}

export default EnvironmentGallery
