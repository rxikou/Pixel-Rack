import PropTypes from 'prop-types'

const VARIANTS = {
  primary: {
    base: 'bg-accent-blue text-bg-primary border-sky-700',
    hover: 'hover:brightness-110 hover:shadow-[0_0_14px_rgba(56,189,248,0.55)]',
  },
  secondary: {
    base: 'bg-bg-container text-text-primary border-slate-950',
    hover: 'hover:border-accent-blue hover:brightness-125',
  },
  accent: {
    base: 'bg-accent-pink text-bg-primary border-pink-700',
    hover: 'hover:brightness-110 hover:shadow-[0_0_14px_rgba(244,114,182,0.55)]',
  },
  danger: {
    base: 'bg-red-500 text-bg-primary border-red-800',
    hover: 'hover:brightness-110 hover:shadow-[0_0_14px_rgba(239,68,68,0.55)]',
  },
}

function Button({ variant = 'secondary', className, children, disabled, ...props }) {
  const { base, hover } = VARIANTS[variant]

  return (
    <button
      disabled={disabled}
      className={`rounded-none border-2 border-b-4 px-4 py-2 font-mono text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-all duration-100 ${
        disabled
          ? 'cursor-not-allowed opacity-50 shadow-none'
          : `cursor-pointer active:translate-y-0.5 active:border-b-2 active:shadow-none ${hover}`
      } ${base} ${className ?? ''}`}
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
