import ScenePage from '../components/ScenePage'
import garageBackground from '../assets/garage-background.webp'

// Pinned to the open concrete in the artwork, scaled up to match the
// proportions of the garage tools, roll-up door, and hydraulic lift.
const SLOTS = [
  { left: '10%', top: '67%', width: '39%', height: '29%' },
  { left: '52%', top: '67%', width: '39%', height: '29%', flipX: true },
]

function GaragePage() {
  return (
    <ScenePage
      environmentId="garage"
      title="Virtual Garage"
      blurb="Pick two cars from your collection to bring into the garage, then click one to give it a wash."
      effect="wash"
      slotPositions={SLOTS}
      background={
        <>
          <img
            src={garageBackground}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-bg-primary/20" />
        </>
      }
    />
  )
}

export default GaragePage
