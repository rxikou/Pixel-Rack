import PropTypes from 'prop-types'
import CarSprite from './CarSprite'

function ShelfCarSlot({ car, onDelete }) {
  return (
    <div className="group relative flex h-20 w-full items-end justify-center sm:h-24 md:h-28">
      <button
        type="button"
        onClick={() => onDelete(car.id)}
        className="absolute -top-1.5 right-1 z-20 hidden h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-500 text-[11px] font-bold leading-none text-bg-primary shadow group-hover:flex"
        aria-label={`Remove ${car.name}`}
      >
        &times;
      </button>

      <div className="pointer-events-none absolute -top-8 left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap border-2 border-bg-container bg-bg-primary px-2.5 py-1 font-mono text-xs font-semibold text-text-primary shadow-lg group-hover:block">
        {car.name}
        {car.series ? (
          <span className="text-text-secondary"> &middot; {car.series}</span>
        ) : null}
      </div>

      {/* contact shadow, so the car reads as sitting on the plank */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-2.5 w-[84%] -translate-x-1/2 rounded-[50%] bg-black/65 blur-[2.5px]" />

      <CarSprite
        car={car}
        alt={car.name}
        className="relative z-10 h-16 w-full drop-shadow-[0_3px_5px_rgba(0,0,0,0.7)] sm:h-20 md:h-24"
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
