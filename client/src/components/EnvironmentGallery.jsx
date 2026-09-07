import PropTypes from 'prop-types'

const PREVIEW_STYLES = {
  rack: 'bg-gradient-to-b from-amber-700 to-amber-950',
  garage: 'bg-gradient-to-b from-slate-500 to-slate-800',
  konbini: 'bg-gradient-to-b from-emerald-700 to-sky-950',
}

function EnvironmentGallery({ environments, activeId, onSelect }) {
  return (
    <div>
      <p className="mb-2 font-pixel text-sm text-text-secondary">
        Virtual Settings &amp; Unlockables
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {environments.map((env) => {
          const isActive = env.id === activeId
          return (
            <div
              key={env.id}
              className={`flex flex-col border-2 ${isActive ? 'border-accent-blue' : 'border-bg-container'}`}
            >
              <div className={`h-16 w-full ${PREVIEW_STYLES[env.id]}`} />
              <div className="flex items-center justify-between gap-2 bg-bg-container/60 px-3 py-2">
                <span className="truncate font-mono text-xs text-text-primary">
                  {env.name}
                </span>
                {env.isPremium ? (
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed border border-text-secondary px-2 py-1 font-mono text-[10px] uppercase text-text-secondary opacity-60"
                    title="Premium environments are not available yet"
                  >
                    Unlock
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelect(env.id)}
                    className={`cursor-pointer border px-2 py-1 font-mono text-[10px] uppercase ${
                      isActive
                        ? 'border-accent-blue text-accent-blue'
                        : 'border-text-secondary text-text-secondary hover:border-accent-blue hover:text-accent-blue'
                    }`}
                  >
                    {isActive ? 'Selected' : 'Select'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

EnvironmentGallery.propTypes = {
  environments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      isPremium: PropTypes.bool,
    }),
  ).isRequired,
  activeId: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
}

export default EnvironmentGallery
