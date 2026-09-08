import ScenePage from '../components/ScenePage'
import garageBackground from '../assets/garage-background.webp'

// Pinned to the open concrete in the artwork: below the workbenches and
// tool chests, left of the car lift ramps.
const SLOTS = [
  { left: '19%', top: '78%', width: '27%', height: '19%' },
  { left: '50%', top: '78%', width: '27%', height: '19%' },
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
