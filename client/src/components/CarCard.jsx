import PropTypes from 'prop-types'
import PixelCarIcon from './PixelCarIcon'

function CarCard({ car, onDelete }) {
  return (
    <div className="group flex flex-col items-center gap-2 border-2 border-bg-container bg-bg-container/60 p-3 transition-colors hover:border-accent-blue">
      <PixelCarIcon color={car.color} className="h-16 w-full" />
      <div className="w-full text-center">
        <p className="truncate font-mono text-sm text-text-primary">{car.name}</p>
        <p className="truncate font-mono text-xs text-text-secondary">{car.series}</p>
      </div>
      <button
        type="button"
        onClick={() => onDelete(car.id)}
        className="cursor-pointer font-mono text-xs text-text-secondary opacity-0 transition-opacity hover:text-accent-pink group-hover:opacity-100"
      >
        Remove
      </button>
    </div>
  )
}

CarCard.propTypes = {
  car: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    series: PropTypes.string,
    color: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default CarCard
