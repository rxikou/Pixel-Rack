import PropTypes from 'prop-types'
import CarSprite from './CarSprite'

function ShelfCarSlot({ car, onDelete }) {
  return (
    <div
      tabIndex={0}
      className="group relative flex h-20 w-full cursor-pointer items-end justify-center focus:outline-none sm:h-24 md:h-28"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(car.id)
        }}
        className="absolute -top-1.5 right-1 z-20 hidden h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-500 text-[11px] font-bold leading-none text-bg-primary shadow group-hover:flex group-focus-within:flex"
        aria-label={`Remove ${car.name}`}
      >
        &times;
      </button>

      <div className="pointer-events-none absolute -top-8 left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap border-2 border-bg-container bg-bg-primary px-2 py-0.5 font-mono text-[10px] font-semibold text-text-primary shadow-lg group-hover:block group-focus-within:block sm:px-2.5 sm:py-1 sm:text-xs">
        {car.name}
        {car.series ? (
          <span className="text-text-secondary"> &middot; {car.series}</span>
        ) : null}
      </div>

      {/* contact shadow on the plank: tight & dark when sitting, softens & scales down when hovered */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-2.5 w-[84%] -translate-x-1/2 rounded-[50%] bg-black/75 blur-[1.5px] transition-all duration-300 ease-out group-hover:scale-x-70 group-hover:opacity-30 group-hover:blur-[3.5px] group-hover:translate-y-0.5 group-focus-within:scale-x-70 group-focus-within:opacity-30 group-focus-within:blur-[3.5px] group-focus-within:translate-y-0.5" />

      {/* car sprite: sits flush on the shelf top at rest, floats smoothly into the air on hover or tap */}
      <div className="relative z-10 flex w-full justify-center transition-transform duration-300 ease-out group-hover:-translate-y-3 sm:group-hover:-translate-y-4 group-focus-within:-translate-y-3 sm:group-focus-within:-translate-y-4">
        <CarSprite
          car={car}
          alt={car.name}
          className="h-16 w-full object-bottom drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] transition-all duration-300 group-hover:drop-shadow-[0_8px_12px_rgba(0,0,0,0.55)] group-focus-within:drop-shadow-[0_8px_12px_rgba(0,0,0,0.55)] sm:h-20 md:h-24 translate-y-[1px]"
        />
      </div>
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
