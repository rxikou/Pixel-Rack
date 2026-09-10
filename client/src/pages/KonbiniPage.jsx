import ScenePage from '../components/ScenePage'
import konbiniBackground from '../assets/konbini-background.webp'

// Centred on the three bays the v2 artwork actually paints. The lines were
// measured off the image rather than eyeballed: they sit at 17.9/39.5/60.5/81.7
// percent, so the bay centres land near 30, 50 and 70 percent.
const SLOTS = [
  { left: '20.5%', top: '74%', width: '19%', height: '20%' },
  { left: '40.5%', top: '74%', width: '19%', height: '20%' },
  { left: '60.5%', top: '74%', width: '19%', height: '20%' },
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
