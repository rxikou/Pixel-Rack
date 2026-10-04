import ScenePage from '../components/ScenePage'
import konbiniBackground from '../assets/konbini-background.webp'

// Centred on the three parking bays in the artwork, scaled up so the cars
// look natural and prominent in front of the convenience store and Mt. Fuji.
const SLOTS = [
  { left: '15%', top: '69%', width: '23%', height: '26%' },
  { left: '39%', top: '69%', width: '23%', height: '26%' },
  { left: '63%', top: '69%', width: '23%', height: '26%' },
]

function KonbiniPage() {
  return (
    <ScenePage
      environmentId="konbini"
      title="7-11 Japan"
      blurb="Park three of your cars in the lot and take in the Mt Fuji view. Click a car to make it gleam."
      effect="sparkle"
      slotPositions={SLOTS}
      background={
        <img
          src={konbiniBackground}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      }
    />
  )
}

export default KonbiniPage
