import { useMemo } from 'react'
import PropTypes from 'prop-types'

const CAR_GRID = [
  '.........000000.........',
  '.....00.01111110........',
  '...001005544444400......',
  '..0111115444444444000...',
  '.0711111111111111111160.',
  '072222222222222222222260',
  '033000003333333000003300',
  '.08888803333333088888000',
  '.0899980000000008999800.',
  '..08880.........08880...',
]

// Precompute active pixel coordinates once at module load
const PIXEL_COORDINATES = []
CAR_GRID.forEach((row, y) => {
  for (let x = 0; x < row.length; x += 1) {
    const char = row[x]
    if (char !== '.') {
      PIXEL_COORDINATES.push({ x, y, char })
    }
  }
})

function parseHex(input) {
  if (!input || typeof input !== 'string') return [56, 189, 248]
  let hex = input.trim()
  if (hex.startsWith('#')) {
    hex = hex.slice(1)
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('')
    }
    if (hex.length >= 6) {
      const num = parseInt(hex.slice(0, 6), 16)
      if (!Number.isNaN(num)) {
        return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
      }
    }
  }
  return [56, 189, 248]
}

function adjustBrightness([r, g, b], factor) {
  if (factor > 0) {
    return [
      Math.round(r + (255 - r) * factor),
      Math.round(g + (255 - g) * factor),
      Math.round(b + (255 - b) * factor),
    ]
  }
  const f = 1 + factor
  return [
    Math.round(Math.max(0, r * f)),
    Math.round(Math.max(0, g * f)),
    Math.round(Math.max(0, b * f)),
  ]
}

function toHex([r, g, b]) {
  return (
    '#' +
    [r, g, b]
      .map((val) => Math.min(255, Math.max(0, val)).toString(16).padStart(2, '0'))
      .join('')
  )
}

function PixelCarIcon({ color = '#38bdf8', className }) {
  const palette = useMemo(() => {
    const rgb = parseHex(color)
    const hi = adjustBrightness(rgb, 0.45)
    const sh = adjustBrightness(rgb, -0.45)
    return {
      0: '#05070d', // crisp pixel outline
      1: toHex(hi), // highlight tint (roof, hood, wing)
      2: toHex(rgb), // base body color
      3: toHex(sh), // underbody shadow tone
      4: '#38bdf8', // windshield retro cyan glass
      5: '#ffffff', // windshield glint
      6: '#fef08a', // front headlight amber
      7: '#ef4444', // rear taillight red
      8: '#0f172a', // rubber tire dark slate
      9: '#e2e8f0', // wheel rim chrome
    }
  }, [color])

  return (
    <svg
      viewBox="0 0 24 10"
      preserveAspectRatio="xMidYMax meet"
      className={`pixelated ${className ?? ''}`}
      shapeRendering="crispEdges"
    >
      {PIXEL_COORDINATES.map(({ x, y, char }) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={1}
          height={1}
          fill={palette[char]}
        />
      ))}
    </svg>
  )
}

PixelCarIcon.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string,
}

export default PixelCarIcon
