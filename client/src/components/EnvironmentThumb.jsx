import PropTypes from 'prop-types'

function RackThumb() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-amber-700 to-amber-950">
      {[28, 56, 84].map((top) => (
        <div
          key={top}
          className="absolute inset-x-2 h-1.5 bg-amber-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
          style={{ top: `${top}%` }}
        />
      ))}
      <div className="absolute inset-y-0 left-0 w-1.5 bg-amber-900" />
      <div className="absolute inset-y-0 right-0 w-1.5 bg-amber-900" />
    </div>
  )
}

function GarageThumb() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-slate-500 to-slate-800">
      {/* pegboard back wall */}
      <div
        className="absolute inset-x-0 top-0 h-10 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(rgba(15,23,42,0.9) 1px, transparent 1px)',
          backgroundSize: '6px 6px',
        }}
      />
      {/* hanging tools on a rail */}
      <div className="absolute left-2 top-2 h-0.5 w-14 bg-slate-300" />
      <div className="absolute left-3 top-2 h-5 w-1.5 bg-slate-200" />
      <div className="absolute left-7 top-2 h-4 w-1.5 bg-slate-300" />
      <div className="absolute left-11 top-2 h-6 w-1.5 bg-slate-200" />
      {/* workbench */}
      <div className="absolute inset-x-2 bottom-5 h-1 bg-slate-400" />
      {/* red toolbox */}
      <div className="absolute bottom-1.5 left-2 h-4 w-9 border border-red-900 bg-red-600" />
      <div className="absolute bottom-3 left-3 h-0.5 w-7 bg-red-900" />
      {/* tire */}
      <div className="absolute bottom-1.5 right-3 h-6 w-6 rounded-full border-[3px] border-slate-900 bg-slate-600" />
      {/* floor */}
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-slate-900" />
    </div>
  )
}

function KonbiniThumb() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-sky-950">
      {/* 7-Eleven stripe awning */}
      <div className="absolute inset-x-0 top-0 flex h-3">
        <div className="flex-1 bg-orange-500" />
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-emerald-500" />
      </div>
      {/* neon signage */}
      <div className="absolute left-2 top-5 h-8 w-2 bg-accent-pink/80" />
      <div className="absolute left-5 top-6 h-6 w-2 bg-accent-blue/80" />
      <div className="absolute right-3 top-5 h-7 w-2 bg-yellow-300/80" />
      {/* lit storefront */}
      <div className="absolute inset-x-2 bottom-1 h-4 bg-sky-200/25" />
    </div>
  )
}

const THUMBS = {
  rack: RackThumb,
  garage: GarageThumb,
  konbini: KonbiniThumb,
}

function EnvironmentThumb({ environmentId }) {
  const Thumb = THUMBS[environmentId]
  return (
    <div className="relative h-20 w-full overflow-hidden">
      {Thumb ? <Thumb /> : <div className="absolute inset-0 bg-bg-container" />}
    </div>
  )
}

EnvironmentThumb.propTypes = {
  environmentId: PropTypes.string.isRequired,
}

export default EnvironmentThumb
