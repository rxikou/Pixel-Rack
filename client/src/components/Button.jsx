import PropTypes from 'prop-types'

const VARIANTS = {
  primary: 'bg-accent-blue text-bg-primary border-sky-700',
  secondary: 'bg-bg-container text-text-primary border-slate-950',
  accent: 'bg-accent-pink text-bg-primary border-pink-700',
  danger: 'bg-red-500 text-bg-primary border-red-800',
}

function Button({ variant = 'secondary', className, children, ...props }) {
  return (
    <button
      className={`cursor-pointer rounded-none border-2 border-b-4 px-4 py-2 font-mono text-sm font-medium active:translate-y-0.5 active:border-b-2 ${VARIANTS[variant]} ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  )
}

Button.propTypes = {
  variant: PropTypes.oneOf(Object.keys(VARIANTS)),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default Button
