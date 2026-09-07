import PropTypes from 'prop-types'
import ShelfCarSlot from './ShelfCarSlot'
import ShelfLabel from './ShelfLabel'
import EnvironmentScene from './EnvironmentScene'

const ROW_SIZE = 9

const ENVIRONMENT_STYLES = {
  rack: {
    background: 'bg-gradient-to-b from-amber-800 to-amber-950',
    ledge: 'bg-gradient-to-b from-amber-700 to-amber-900 border-amber-950',
  },
  garage: {
    background: 'bg-gradient-to-b from-slate-600 to-slate-800',
    ledge: 'bg-gradient-to-b from-slate-400 to-slate-600 border-slate-900',
  },
  konbini: {
    background: 'bg-gradient-to-b from-emerald-800 to-sky-950',
    ledge: 'bg-gradient-to-b from-zinc-200 to-zinc-400 border-red-800',
  },
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

function chunkRows(cars, size) {
  const rows = []
  for (let i = 0; i < cars.length; i += size) {
    rows.push(cars.slice(i, i + size))
  }
  return rows
}

const CORNER_CLASSES = [
  'left-0 top-0 border-b-2 border-r-2',
  'right-0 top-0 border-b-2 border-l-2',
  'bottom-0 left-0 border-t-2 border-r-2',
  'bottom-0 right-0 border-t-2 border-l-2',
]

function Rack({ cars, environmentId, onDelete }) {
  const shelves = groupByShelf(cars)
  const styles = ENVIRONMENT_STYLES[environmentId]

  return (
    <div
      className={`relative overflow-hidden border-4 border-black/50 p-3 shadow-inner ${styles.background}`}
    >
      {CORNER_CLASSES.map((cls) => (
        <div
          key={cls}
          className={`pointer-events-none absolute h-4 w-4 border-black/50 ${cls}`}
        />
      ))}

      <EnvironmentScene environmentId={environmentId} />

      <div className="relative flex flex-col">
        {cars.length === 0 && (
          <p className="py-12 text-center font-mono text-text-secondary">
            No cars yet. Upload your first Hot Wheels to fill the rack.
          </p>
        )}
        {[...shelves.entries()].map(([shelf, shelfCars], shelfIndex) => (
          <div key={shelf} className="flex flex-col items-center">
            {chunkRows(shelfCars, ROW_SIZE).map((row, rowIndex) => (
              <div key={rowIndex} className="flex w-full flex-col items-center">
                {rowIndex === 0 && (
                  <ShelfLabel index={shelfIndex + 1} name={shelf.toUpperCase()} />
                )}
                <div className="flex w-full items-end justify-center border-x-4 border-black/20 bg-black/10 px-3 pt-4">
                  {row.map((car) => (
                    <div
                      key={car.id}
                      style={{ width: `${100 / ROW_SIZE}%` }}
                      className="shrink-0 px-0.5"
                    >
                      <ShelfCarSlot car={car} onDelete={onDelete} />
                    </div>
                  ))}
                </div>
                <div
                  className={`h-3 w-full border-b-4 shadow-[inset_0_2px_0_rgba(255,255,255,0.2)] ${styles.ledge}`}
                />
              </div>
            ))}
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
