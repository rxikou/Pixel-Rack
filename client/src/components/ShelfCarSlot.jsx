import PropTypes from 'prop-types'
import CarSprite from './CarSprite'

function ShelfCarSlot({ car, onDelete }) {
  return (
    <div className="group relative flex h-16 w-full items-end justify-center sm:h-20">
      <button
        type="button"
        onClick={() => onDelete(car.id)}
        className="absolute -top-1 right-1 z-20 hidden h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-red-500 text-[10px] leading-none text-bg-primary group-hover:flex"
        aria-label={`Remove ${car.name}`}
      >
        &times;
      </button>

      <div className="pointer-events-none absolute -top-7 left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap border-2 border-bg-container bg-bg-primary px-2 py-1 font-mono text-xs text-text-primary group-hover:block">
        {car.name}
        {car.series ? (
          <span className="text-text-secondary"> &middot; {car.series}</span>
        ) : null}
      </div>

      {/* contact shadow, so the car reads as sitting on the plank */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-2 w-[82%] -translate-x-1/2 rounded-[50%] bg-black/55 blur-[2px]" />

      <CarSprite
        car={car}
        alt={car.name}
        className="relative z-10 h-12 w-full drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] sm:h-16"
      />
    </div>
  )
}

ShelfCarSlot.propTypes = {
  car: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    series: PropTypes.string,
    color: PropTypes.string,
    pixelImageUrl: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default ShelfCarSlot
