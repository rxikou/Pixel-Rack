import PropTypes from 'prop-types'

function ShelfLabel({ index, name }) {
  return (
    <div className="z-10 -mb-1 ml-1 self-start border-2 border-yellow-600/70 bg-black/80 px-2 py-0.5 shadow-md">
      <p className="whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-wide text-yellow-300">
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
