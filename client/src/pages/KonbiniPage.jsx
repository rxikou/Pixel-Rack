import ScenePage from '../components/ScenePage'

// Three parking bays, each centred in a marked bay on the asphalt.
const SLOTS = [
  { left: '11%', top: '70%', width: '24%', height: '18%' },
  { left: '38%', top: '70%', width: '24%', height: '18%' },
  { left: '65%', top: '70%', width: '24%', height: '18%' },
]

// Bay dividers, positioned so each slot above sits between two lines.
const BAY_LINES = ['8.5%', '36.5%', '63.5%', '91.5%']

// Fuji's snow cap: a triangle whose lower edge breaks into fingers of snow
// running down the slope.
const SNOW_CAP = 'polygon(50% 0%, 100% 100%, 82% 74%, 66% 96%, 50% 72%, 34% 96%, 18% 74%, 0% 100%)'
const PEAK = 'polygon(50% 0%, 100% 100%, 0% 100%)'

/**
 * Placeholder scene drawn in CSS until the konbini artwork is generated.
 * Dusk sky over Mt Fuji, a lit storefront under the striped awning, and a
 * marked parking lot in the foreground.
 */
function KonbiniBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* dusk sky, warm at the horizon */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1b1b4d] via-[#4a2a6b] to-[#c2643f]" />

      {/* stars, thinning out towards the horizon */}
      {[
        [8, 12], [22, 7], [35, 18], [51, 9], [64, 15], [78, 6], [88, 20], [94, 11],
        [15, 26], [43, 30], [71, 27],
      ].map(([x, y]) => (
        <span
          key={`${x}-${y}`}
          className="absolute h-[2px] w-[2px] bg-white/70"
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}

      {/* moon */}
      <div className="absolute right-[12%] top-[10%] h-[7%] w-[4%] rounded-full bg-amber-50/90 shadow-[0_0_18px_rgba(255,251,235,0.45)]" />

      {/* Mt Fuji */}
      <div
        className="absolute bottom-[38%] left-1/2 h-[36%] w-[62%] -translate-x-1/2 bg-[#3d3a63]"
        style={{ clipPath: PEAK }}
      />
      <div
        className="absolute bottom-[65%] left-1/2 h-[9%] w-[16%] -translate-x-1/2 bg-slate-100"
        style={{ clipPath: SNOW_CAP }}
      />

      {/* treeline haze along the base of the mountain */}
      <div className="absolute inset-x-0 bottom-[38%] h-[4%] bg-[#2a2547]" />

      {/* storefront */}
      <div className="absolute inset-x-[7%] bottom-[38%] h-[19%] border-x-2 border-t-2 border-black/50 bg-[#e8e6ee]">
        {/* awning stripe */}
        <div className="flex h-[26%] w-full">
          <div className="flex-1 bg-[#f26722]" />
          <div className="flex-1 bg-[#d1232a]" />
          <div className="flex-1 bg-[#00a05a]" />
        </div>

        {/* lit glass frontage with a sliding entrance in the middle */}
        <div className="relative flex h-[74%] w-full items-stretch gap-[2px] bg-black/50 p-[3px]">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-1 bg-[#ffe9a8]" />
          ))}
          <div className="absolute bottom-0 left-1/2 flex h-[84%] w-[16%] -translate-x-1/2 gap-[2px] border-2 border-black/50 bg-black/50">
            <div className="flex-1 bg-[#fff8e1]" />
            <div className="flex-1 bg-[#fff8e1]" />
          </div>
        </div>
      </div>

      {/* sign pole beside the store */}
      <div className="absolute bottom-[40%] left-[3%] h-[22%] w-[1%] bg-slate-500" />
      <div className="absolute bottom-[60%] left-[1.5%] h-[6%] w-[4%] border-2 border-black/50 bg-[#f26722]" />

      {/* forecourt */}
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[#3a4152]" />
      {/* kerb between the store and the lot */}
      <div className="absolute inset-x-0 bottom-[36%] h-[2%] bg-[#5b6274]" />

      {/* bay markings */}
      {BAY_LINES.map((x) => (
        <div
          key={x}
          className="absolute bottom-[8%] h-[24%] w-[3px] bg-slate-200/70"
          style={{ left: x }}
        />
      ))}
      <div className="absolute inset-x-[6%] bottom-[32%] h-[2px] bg-slate-200/50" />
    </div>
  )
}

function KonbiniPage() {
  return (
    <ScenePage
      environmentId="konbini"
      title="7-11 Japan"
      blurb="Park three of your cars in the lot and take in the Mt Fuji view. Click a car to make it gleam."
      effect="sparkle"
      slotPositions={SLOTS}
      background={<KonbiniBackdrop />}
    />
  )
}

export default KonbiniPage
