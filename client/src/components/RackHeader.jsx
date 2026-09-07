import PropTypes from 'prop-types'

const SORTS = [
  { id: 'shelf', label: 'Shelf' },
  { id: 'name', label: 'Name (A-Z)' },
]

function RackHeader({ rackName, carCount, sort, onSortChange, seriesFilter, seriesOptions, onFilterChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-bg-container pb-3">
      <div>
        <h2 className="font-pixel text-base text-text-primary sm:text-lg">
          Primary Visual Rack: "{rackName}"
        </h2>
        <p className="font-mono text-xs text-text-secondary">
          {carCount} {carCount === 1 ? 'car' : 'cars'} displayed
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-text-secondary">
        <label className="flex items-center gap-1.5">
          Sort
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="border-2 border-bg-container bg-bg-primary px-2 py-1 text-sm text-text-primary outline-none focus:border-accent-blue"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1.5">
          Filter
          <select
            value={seriesFilter}
            onChange={(e) => onFilterChange(e.target.value)}
            className="border-2 border-bg-container bg-bg-primary px-2 py-1 text-sm text-text-primary outline-none focus:border-accent-blue"
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
  sort: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  seriesFilter: PropTypes.string.isRequired,
  seriesOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFilterChange: PropTypes.func.isRequired,
}

export default RackHeader
