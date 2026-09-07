import PropTypes from 'prop-types'

function BracketButton({ children, className, disabled, ...props }) {
  return (
    <button
      disabled={disabled}
      className={`border-2 font-mono text-xs uppercase tracking-wide transition-colors ${
        disabled
          ? 'cursor-not-allowed border-text-secondary/40 text-text-secondary/40'
          : 'cursor-pointer border-accent-blue/60 text-accent-blue hover:bg-accent-blue/10 hover:border-accent-blue'
      } bg-bg-primary px-3 py-1.5 ${className ?? ''}`}
      {...props}
    >
      [ {children} ]
    </button>
  )
}

BracketButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
}

export default BracketButton
