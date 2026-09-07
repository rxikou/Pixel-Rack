import PropTypes from 'prop-types'

const PIXELS = [
  '0111111100',
  '0111111100',
  '1111111111',
  '1111111111',
  '0011001100',
]

function PixelCarIcon({ color, className }) {
  return (
    <svg
      viewBox="0 0 10 5"
      className={`pixelated ${className ?? ''}`}
      shapeRendering="crispEdges"
    >
      {PIXELS.flatMap((row, y) =>
        row
          .split('')
          .map((cell, x) =>
            cell === '1' ? (
              <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />
            ) : null,
          ),
      )}
    </svg>
  )
}

PixelCarIcon.propTypes = {
  color: PropTypes.string.isRequired,
  className: PropTypes.string,
}

export default PixelCarIcon
