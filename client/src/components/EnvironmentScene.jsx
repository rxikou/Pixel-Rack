import PropTypes from 'prop-types'
import garageBackground from '../assets/garage-background.webp'

function RackScene() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-40"
      style={{
        // Irregular stripe widths read as wood grain rather than a flat screen.
        backgroundImage: [
          'repeating-linear-gradient(90deg, rgba(0,0,0,0.30) 0px, rgba(0,0,0,0.30) 1px, transparent 1px, transparent 6px)',
          'repeating-linear-gradient(90deg, rgba(0,0,0,0.16) 0px, rgba(0,0,0,0.16) 2px, transparent 2px, transparent 17px)',
          'repeating-linear-gradient(90deg, rgba(255,240,200,0.09) 0px, rgba(255,240,200,0.09) 1px, transparent 1px, transparent 29px)',
        ].join(','),
      }}
    />
  )
}

function GarageScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <img
        src={garageBackground}
        alt=""
        className="h-full w-full object-cover"
      />
      {/* The artwork is busy; this scrim keeps the shelves and car sprites
          readable on top of it without washing the scene out. */}
      <div className="absolute inset-0 bg-bg-primary/35" />
    </div>
  )
}

function KonbiniScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
      <div className="absolute inset-x-0 top-0 flex h-6">
        <div className="flex-1 bg-orange-600" />
        <div className="flex-1 bg-red-600" />
        <div className="flex-1 bg-emerald-600" />
      </div>
      <div className="absolute right-4 top-8 h-2 w-2 animate-pulse bg-accent-pink" />
      <div className="absolute right-10 top-14 h-2 w-2 animate-pulse bg-accent-blue" />
    </div>
  )
}

const SCENES = {
  rack: RackScene,
  garage: GarageScene,
  konbini: KonbiniScene,
}

function EnvironmentScene({ environmentId }) {
  const Scene = SCENES[environmentId]
  return Scene ? <Scene /> : null
}

EnvironmentScene.propTypes = {
  environmentId: PropTypes.string.isRequired,
}

export default EnvironmentScene
