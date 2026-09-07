import PropTypes from 'prop-types'
import Panel from './Panel'
import EnvironmentThumb from './EnvironmentThumb'

function EnvironmentGallery({ environments, activeId, onSelect }) {
  return (
    <Panel title="Virtual Settings & Unlockables">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {environments.map((env) => {
          const isActive = env.id === activeId
          const locked = Boolean(env.isPremium)

          return (
            <button
              key={env.id}
              type="button"
              disabled={locked}
              aria-pressed={isActive}
              onClick={() => onSelect(env.id)}
              title={
                locked ? 'Premium environments are not available yet' : undefined
              }
              className={`flex flex-col overflow-hidden border-2 text-left transition-colors ${
                locked
                  ? 'cursor-not-allowed border-bg-container opacity-60'
                  : 'cursor-pointer'
              } ${
                isActive
                  ? 'border-accent-blue shadow-[0_0_12px_rgba(56,189,248,0.35)]'
                  : !locked && 'border-bg-container hover:border-accent-blue/60'
              }`}
            >
              <EnvironmentThumb environmentId={env.id} />
              <div className="flex w-full items-center justify-between gap-2 bg-bg-container/80 px-3 py-2">
                <span className="truncate font-mono text-xs uppercase tracking-wide text-text-primary">
                  {env.name}
                </span>
                <span
                  className={`shrink-0 font-mono text-[10px] uppercase tracking-wide ${
                    locked
                      ? 'text-text-secondary/60'
                      : isActive
                        ? 'text-accent-blue'
                        : 'text-text-secondary'
                  }`}
                >
                  {locked ? 'Unlock' : isActive ? 'Selected' : 'Select'}
                </span>
              </div>
            </button>
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
    }),
  ).isRequired,
  activeId: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
}

export default EnvironmentGallery
