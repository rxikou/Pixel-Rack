import PropTypes from 'prop-types'
import ShelfCarSlot from './ShelfCarSlot'
import ShelfLabel from './ShelfLabel'
import EnvironmentScene from './EnvironmentScene'

const ROW_SIZE = 9

const ENVIRONMENT_STYLES = {
  rack: {
    frame: 'bg-gradient-to-b from-amber-800 to-amber-950',
    cavity: 'bg-black/40',
    plankLip: 'bg-amber-500/80',
    plankFace: 'bg-gradient-to-b from-amber-700 to-amber-900',
    post: 'bg-gradient-to-r from-amber-950 via-amber-700 to-amber-950',
  },
  garage: {
    frame: 'bg-gradient-to-b from-slate-600 to-slate-800',
    cavity: 'bg-black/45',
    plankLip: 'bg-slate-200/80',
    plankFace: 'bg-gradient-to-b from-slate-400 to-slate-600',
    post: 'bg-gradient-to-r from-slate-900 via-slate-500 to-slate-900',
  },
  konbini: {
    frame: 'bg-gradient-to-b from-emerald-800 to-sky-950',
    cavity: 'bg-black/45',
    plankLip: 'bg-white/80',
    plankFace: 'bg-gradient-to-b from-zinc-200 to-zinc-400',
    post: 'bg-gradient-to-r from-red-900 via-red-600 to-red-900',
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

function Rack({ cars, environmentId, onDelete }) {
  const shelves = groupByShelf(cars)
  const styles = ENVIRONMENT_STYLES[environmentId]

  return (
    <div
      className={`relative overflow-hidden border-4 border-black/60 shadow-[0_6px_16px_rgba(0,0,0,0.5)] ${styles.frame}`}
    >
      <EnvironmentScene environmentId={environmentId} />

      {/* upright side posts */}
      <div className={`pointer-events-none absolute inset-y-0 left-0 w-3 ${styles.post}`} />
      <div className={`pointer-events-none absolute inset-y-0 right-0 w-3 ${styles.post}`} />

      <div className="relative flex flex-col gap-1 px-3 py-3">
        {cars.length === 0 && (
          <p className="py-12 text-center font-mono text-text-secondary">
            No cars yet. Upload your first Hot Wheels to fill the rack.
          </p>
        )}

        {[...shelves.entries()].map(([shelf, shelfCars], shelfIndex) =>
          chunkRows(shelfCars, ROW_SIZE).map((row, rowIndex) => (
            <div key={`${shelf}-${rowIndex}`} className="flex flex-col">
              {rowIndex === 0 && (
                <ShelfLabel index={shelfIndex + 1} name={shelf.toUpperCase()} />
              )}

              {/* recessed cavity the cars stand inside */}
              <div
                className={`flex items-end justify-start px-2 pt-7 shadow-[inset_0_14px_18px_-8px_rgba(0,0,0,0.95),inset_6px_0_10px_-8px_rgba(0,0,0,0.8),inset_-6px_0_10px_-8px_rgba(0,0,0,0.8)] ${styles.cavity}`}
              >
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

              {/* the plank itself: lit top lip, shadowed front face, drop shadow */}
              <div className="relative flex flex-col">
                <div className={`h-[3px] w-full ${styles.plankLip}`} />
                <div
                  className={`h-4 w-full shadow-[0_4px_7px_rgba(0,0,0,0.6)] ${styles.plankFace}`}
                />
                <div className="h-[2px] w-full bg-black/55" />
              </div>
            </div>
          )),
        )}
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
      color: PropTypes.string,
      pixelImageUrl: PropTypes.string,
    }),
  ).isRequired,
  environmentId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default Rack
