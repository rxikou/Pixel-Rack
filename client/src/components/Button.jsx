import PropTypes from 'prop-types'

// Saturated fills rather than one accent colour: the reference UI colour-codes
// its actions (orange, red, magenta, blue, green) instead of tinting
// everything the same hue.
const VARIANTS = {
  primary: 'bg-sky-500 text-white',
  secondary: 'bg-slate-600 text-white',
  accent: 'bg-fuchsia-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-orange-500 text-white',
  danger: 'bg-red-500 text-white',
}

function Button({ variant = 'secondary', className, children, disabled, ...props }) {
  return (
    <button
      disabled={disabled}
      className={`pixel-btn pixel-text cursor-pointer rounded-none px-4 py-2 font-pixel text-lg uppercase leading-none tracking-wide ${
        disabled ? 'cursor-not-allowed opacity-50' : 'hover:brightness-110'
      } ${VARIANTS[variant]} ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  variant: PropTypes.oneOf(Object.keys(VARIANTS)),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

export default Button
