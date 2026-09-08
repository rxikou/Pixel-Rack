import PropTypes from 'prop-types'

function BracketButton({ children, className, disabled, ...props }) {
  return (
    <button
      disabled={disabled}
      className={`pixel-btn pixel-text rounded-none px-3 py-2 font-pixel text-lg uppercase leading-none tracking-wide text-white ${
        disabled
          ? 'cursor-not-allowed bg-slate-600 opacity-50'
          : 'cursor-pointer bg-green-500 hover:brightness-110'
      } ${className ?? ''}`}
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
