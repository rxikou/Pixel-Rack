import PropTypes from 'prop-types'
import PixelCarIcon from './PixelCarIcon'
import garageArt from '../assets/garage-background.webp'
import konbiniArt from '../assets/konbini-background.webp'

// The rack has no artwork of its own, so it stays drawn in CSS. The other two
// use the same images their scene pages do, so the gallery previews match
// what you actually get when you open them.
// Matches the amber wood and plank lip of the real Rack component, and uses
// the same car glyph the rack itself falls back to, so the preview reads as a
// smaller version of the page it links to.
const SHELF_CARS = [
  { top: '6%', cars: ['#f87171', '#38bdf8', '#fbbf24', '#4ade80'] },
  { top: '36%', cars: ['#f472b6', '#fb923c', '#a78bfa', '#22d3ee'] },
  { top: '66%', cars: ['#facc15', '#60a5fa', '#f87171', '#34d399'] },
]

function RackThumb() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-amber-800 to-amber-950">
      {SHELF_CARS.map(({ top, cars }) => (
        <div key={top} className="absolute inset-x-2" style={{ top }}>
          <div className="flex items-end justify-center gap-2 px-1 pb-0.5">
            {cars.map((color) => (
              <PixelCarIcon key={color} color={color} className="h-3 w-6" />
            ))}
          </div>
          {/* plank face and lip, same order the real shelf uses */}
          <div className="h-1 bg-gradient-to-b from-amber-700 to-amber-900" />
          <div className="h-[3px] bg-amber-500/80" />
          <div className="h-1 bg-black/35" />
        </div>
      ))}

      {/* side posts */}
      <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-amber-950 via-amber-700 to-amber-950" />
      <div className="absolute inset-y-0 right-0 w-2 bg-gradient-to-r from-amber-950 via-amber-700 to-amber-950" />
    </div>
  )
}

function ArtThumb({ src }) {
  return (
    <img
      src={src}
      alt=""
      className="pixelated absolute inset-0 h-full w-full object-cover"
    />
  )
}
ArtThumb.propTypes = { src: PropTypes.string.isRequired }

function GarageThumb() {
  return <ArtThumb src={garageArt} />
}

function KonbiniThumb() {
  return <ArtThumb src={konbiniArt} />
}

const THUMBS = {
  rack: RackThumb,
  garage: GarageThumb,
  konbini: KonbiniThumb,
}

function EnvironmentThumb({ environmentId, className }) {
  const Thumb = THUMBS[environmentId]
  return (
    <div className={`relative w-full overflow-hidden ${className ?? 'h-20'}`}>
      {Thumb ? <Thumb /> : <div className="absolute inset-0 bg-bg-container" />}
    </div>
  )
}

EnvironmentThumb.propTypes = {
  environmentId: PropTypes.string.isRequired,
  className: PropTypes.string,
}

export default EnvironmentThumb
