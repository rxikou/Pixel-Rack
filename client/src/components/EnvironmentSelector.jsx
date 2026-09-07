import PropTypes from 'prop-types'

function EnvironmentSelector({ environments, activeId, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {environments.map((env) => (
        <button
          key={env.id}
          type="button"
          onClick={() => onSelect(env.id)}
          className={`cursor-pointer rounded-none border-2 px-3 py-1.5 font-mono text-xs transition-colors ${
            env.id === activeId
              ? 'border-accent-blue bg-accent-blue/10 text-accent-blue'
              : 'border-bg-container text-text-secondary hover:border-text-secondary'
          }`}
        >
          {env.name}
          {env.isPremium && <span className="ml-1 text-accent-pink">*</span>}
        </button>
      ))}
    </div>
  )
}

EnvironmentSelector.propTypes = {
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

export default EnvironmentSelector
