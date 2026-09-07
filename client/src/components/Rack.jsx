import PropTypes from 'prop-types'
import CarCard from './CarCard'
import EnvironmentScene from './EnvironmentScene'

const ENVIRONMENT_BACKGROUNDS = {
  rack: 'bg-gradient-to-b from-amber-950 to-amber-900',
  garage: 'bg-gradient-to-b from-slate-700 to-slate-800',
  konbini: 'bg-gradient-to-b from-emerald-900 to-sky-950',
}

function groupByShelf(cars) {
  const shelves = new Map()
  for (const car of cars) {
    const shelf = car.series || 'Uncategorized'
    if (!shelves.has(shelf)) shelves.set(shelf, [])
    shelves.get(shelf).push(car)
  }
  return shelves
}

function Rack({ cars, environmentId, onDelete }) {
  const shelves = groupByShelf(cars)

  return (
    <div
      className={`relative min-h-72 overflow-hidden border-2 border-bg-container p-6 ${ENVIRONMENT_BACKGROUNDS[environmentId]}`}
    >
      <EnvironmentScene environmentId={environmentId} />

      <div className="relative flex flex-col gap-6">
        {cars.length === 0 && (
          <p className="py-12 text-center font-mono text-text-secondary">
            No cars yet. Upload your first Hot Wheels to fill the rack.
          </p>
        )}
        {[...shelves.entries()].map(([shelf, shelfCars]) => (
          <div key={shelf} className="flex flex-col gap-2">
            <p className="font-mono text-xs uppercase tracking-wide text-text-secondary">
              Shelf: {shelf}
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {shelfCars.map((car) => (
                <CarCard key={car.id} car={car} onDelete={onDelete} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

Rack.propTypes = {
  cars: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      series: PropTypes.string,
      color: PropTypes.string.isRequired,
    }),
  ).isRequired,
  environmentId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default Rack
