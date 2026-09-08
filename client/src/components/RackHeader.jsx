import PropTypes from 'prop-types'
import PixelCarIcon from './PixelCarIcon'
import rackIcon from '../assets/icons/rack.png'

const SORTS = [
  { id: 'shelf', label: 'Shelf' },
  { id: 'name', label: 'Name (A-Z)' },
]

const selectClass =
  'cursor-pointer border-2 border-accent-blue/30 bg-bg-primary px-2 py-1 font-mono text-xs uppercase text-accent-blue outline-none hover:border-accent-blue focus:border-accent-blue'

function RackHeader({
  rackName,
  carCount,
  shelfCount,
  sort,
  onSortChange,
  seriesFilter,
  seriesOptions,
  onFilterChange,
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 pb-3">
      <div className="flex flex-col gap-2">
        <h2 className="pixel-text font-pixel text-lg uppercase leading-none tracking-wide text-white sm:text-xl">
          Primary Visual Rack: "{rackName}"
        </h2>

        {/* Stat readout styled like the reference's HUD counters: icon in a
            coloured chip, value beside it, all inside one inset panel. */}
        <div className="pixel-inset flex w-fit items-center gap-3 bg-slate-900/80 px-3 py-1.5">
          <span className="flex items-center gap-1.5">
            <PixelCarIcon color="#38bdf8" className="h-4 w-7" />
            <span className="pixel-text font-pixel text-lg leading-none text-white">
              {carCount}
            </span>
          </span>
          <span className="h-4 w-[2px] bg-black/60" />
          <span className="flex items-center gap-1.5">
            <img src={rackIcon} alt="" className="pixelated h-5 w-5" />
            <span className="pixel-text font-pixel text-lg leading-none text-white">
              {shelfCount}
            </span>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wide text-text-secondary">
        <label className="flex items-center gap-1.5">
          <span>
            Sort <span aria-hidden="true">&#8645;</span>
          </span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className={selectClass}
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <span className="text-accent-blue/40">|</span>

        <label className="flex items-center gap-1.5">
          <span>
            Filter <span aria-hidden="true">&#9660;</span>
          </span>
          <select
            value={seriesFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className={selectClass}
          >
            <option value="all">All</option>
            {seriesOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}

RackHeader.propTypes = {
  rackName: PropTypes.string.isRequired,
  carCount: PropTypes.number.isRequired,
  shelfCount: PropTypes.number.isRequired,
  sort: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  seriesFilter: PropTypes.string.isRequired,
  seriesOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilterChange: PropTypes.func.isRequired,
}

export default RackHeader
