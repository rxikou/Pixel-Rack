import ScenePage from '../components/ScenePage'
import konbiniBackground from '../assets/konbini-background.webp'

// Centered on 3 of the artwork's painted bays (skipping the leftmost one,
// which sits behind the phone booth pole).
const SLOTS = [
  { left: '22%', top: '72%', width: '18%', height: '22%' },
  { left: '41%', top: '72%', width: '18%', height: '22%' },
  { left: '60%', top: '72%', width: '18%', height: '22%' },
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
