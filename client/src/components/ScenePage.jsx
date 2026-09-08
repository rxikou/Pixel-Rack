import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Navbar from './Navbar'
import Footer from './Footer'
import Panel from './Panel'
import PixelCarIcon from './PixelCarIcon'
import CarPickerModal from './CarPickerModal'
import { fetchCars, fetchPlacements, setPlacement } from '../api/cars'
import { spriteColorFor } from '../utils/spriteColor'

function SlotCar({ car }) {
  return car.pixelImageUrl ? (
    <img
      src={car.pixelImageUrl}
      alt={car.name}
      className="pixelated h-full w-full object-contain drop-shadow-[0_3px_3px_rgba(0,0,0,0.7)]"
    />
  ) : (
    <PixelCarIcon
      color={car.color ?? spriteColorFor(car.id)}
      className="h-full w-full drop-shadow-[0_3px_3px_rgba(0,0,0,0.7)]"
    />
  )
}
SlotCar.propTypes = { car: PropTypes.object.isRequired }

/**
 * A scene with a fixed number of car slots. Slot positions are given as
 * percentages so they stay pinned to the right spot in the artwork as the
 * scene scales.
 */
function ScenePage({ environmentId, title, blurb, background, slotPositions, effect }) {
  const [cars, setCars] = useState([])
  const [placements, setPlacements] = useState([])
  const [environment, setEnvironment] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [pickingSlot, setPickingSlot] = useState(null)
  const [activeEffect, setActiveEffect] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [carList, scene] = await Promise.all([
          fetchCars(),
          fetchPlacements(environmentId),
        ])
        if (cancelled) return
        setCars(carList)
        setEnvironment(scene.environment)
        setPlacements(scene.placements)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [environmentId])

  const carInSlot = (i) => placements.find((p) => p.slotIndex === i)?.car ?? null
  const placedCarIds = placements.map((p) => p.car.id)

  async function choose(car) {
    const slot = pickingSlot
    setPickingSlot(null)
    try {
      await setPlacement(environmentId, slot, car.id)
      const scene = await fetchPlacements(environmentId)
      setPlacements(scene.placements)
    } catch (err) {
      setError(err.message)
    }
  }

  async function clearSlot() {
    const slot = pickingSlot
    setPickingSlot(null)
    try {
      await setPlacement(environmentId, slot, null)
      const scene = await fetchPlacements(environmentId)
      setPlacements(scene.placements)
    } catch (err) {
      setError(err.message)
    }
  }

  function playEffect(slotIndex) {
    setActiveEffect(slotIndex)
    setTimeout(() => setActiveEffect(null), 1400)
  }

  const slotCount = environment?.slots ?? slotPositions.length

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-6 py-8">
        {error && (
          <p className="pixel-panel bg-red-900/60 px-3 py-2 font-mono text-xs text-white">
            {error}
          </p>
        )}

        <Panel title={title} bodyClassName="p-3">
          <p className="mb-3 font-mono text-xs text-text-secondary">{blurb}</p>

          <div className="pixel-inset relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
            {background}

            {isLoading ? (
              <p className="absolute inset-0 flex items-center justify-center font-mono text-sm text-white">
                Loading scene...
              </p>
            ) : (
              slotPositions.slice(0, slotCount).map((pos, i) => {
                const car = carInSlot(i)
                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      left: pos.left,
                      top: pos.top,
                      width: pos.width,
                      height: pos.height,
                    }}
                  >
                    {car ? (
                      <button
                        type="button"
                        onClick={() => playEffect(i)}
                        onDoubleClick={() => setPickingSlot(i)}
                        title={`${car.name} - click to ${effect === 'wash' ? 'wash' : 'admire'}, double click to change`}
                        className="relative h-full w-full cursor-pointer"
                      >
                        <SlotCar car={car} />

                        {activeEffect === i && effect === 'wash' && (
                          <>
                            <span className="pointer-events-none absolute inset-0 overflow-hidden">
                              <span className="animate-shine-across absolute inset-y-0 w-1/3 bg-white/50" />
                            </span>
                            {[10, 35, 60, 85].map((x, b) => (
                              <span
                                key={x}
                                className="animate-bubble-rise pointer-events-none absolute bottom-2 h-3 w-3 rounded-full border-2 border-white/70 bg-sky-200/50"
                                style={{ left: `${x}%`, animationDelay: `${b * 120}ms` }}
                              />
                            ))}
                          </>
                        )}

                        {activeEffect === i && effect === 'sparkle' && (
                          <>
                            {[[15, 10], [70, 5], [45, 60], [85, 45]].map(([x, y], s) => (
                              <span
                                key={`${x}-${y}`}
                                className="animate-sparkle-pop pointer-events-none absolute font-pixel text-lg text-amber-200"
                                style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${s * 140}ms` }}
                              >
                                +
                              </span>
                            ))}
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPickingSlot(i)}
                        className="pixel-panel h-full w-full cursor-pointer bg-black/40 hover:bg-black/25"
                      >
                        <span className="pixel-text font-pixel text-2xl leading-none text-white/80">
                          +
                        </span>
                      </button>
                    )}
                  </div>
                )
              })
            )}
          </div>

          <p className="mt-3 font-mono text-[11px] text-text-secondary">
            Click an empty slot to place a car. Click a placed car to{' '}
            {effect === 'wash' ? 'wash it' : 'admire it'}, double click to swap it out.
          </p>
        </Panel>
      </main>

      <Footer />

      {pickingSlot !== null && (
        <CarPickerModal
          cars={cars}
          placedCarIds={placedCarIds}
          canClear={Boolean(carInSlot(pickingSlot))}
          onPick={choose}
          onClear={clearSlot}
          onClose={() => setPickingSlot(null)}
        />
      )}
    </div>
  )
}

ScenePage.propTypes = {
  environmentId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  blurb: PropTypes.string.isRequired,
  background: PropTypes.node,
  slotPositions: PropTypes.arrayOf(
    PropTypes.shape({
      left: PropTypes.string.isRequired,
      top: PropTypes.string.isRequired,
      width: PropTypes.string.isRequired,
      height: PropTypes.string.isRequired,
    }),
  ).isRequired,
  effect: PropTypes.oneOf(['wash', 'sparkle']).isRequired,
}

export default ScenePage
