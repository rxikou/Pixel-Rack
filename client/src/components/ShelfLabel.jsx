import PropTypes from 'prop-types'

function ShelfLabel({ index, name }) {
  return (
    <div className="z-10 -mb-3 self-center rounded-sm border-2 border-yellow-600/80 bg-black/70 px-3 py-1 shadow-md">
      <p className="whitespace-nowrap font-mono text-xs font-bold uppercase tracking-wide text-yellow-300 sm:text-sm">
        Shelf {index}: {name}
      </p>
    </div>
  )
}

ShelfLabel.propTypes = {
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
}

export default ShelfLabel
