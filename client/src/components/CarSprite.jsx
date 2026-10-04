import { useState } from 'react'
import PropTypes from 'prop-types'
import PixelCarIcon from './PixelCarIcon'
import { spriteColorFor } from '../utils/spriteColor'

/**
 * A car's sprite, falling back to the built-in pixel car glyph.
 *
 * Two ways the sprite can be absent, and both land on the same fallback:
 * the car has no pixelImageUrl yet, or it has one that no longer resolves.
 * The second happens on a fresh deployment, where the database rows survive
 * but the images they point at were written to a local disk that is gone.
 * Without the onError branch that renders as a broken image icon.
 */
function CarSprite({ car, className, alt }) {
  const [failedUrl, setFailedUrl] = useState(null)
  const isFailed = failedUrl === car.pixelImageUrl
  const showImage = Boolean(car.pixelImageUrl) && !isFailed

  if (!showImage) {
    return (
      <PixelCarIcon
        color={car.color ?? spriteColorFor(car.id)}
        className={className}
      />
    )
  }

  return (
    <img
      src={car.pixelImageUrl}
      alt={alt ?? ''}
      onError={() => setFailedUrl(car.pixelImageUrl)}
      className={`pixelated object-contain object-bottom ${className ?? ''}`}
    />
  )
}

CarSprite.propTypes = {
  car: PropTypes.shape({
    id: PropTypes.string.isRequired,
    color: PropTypes.string,
    pixelImageUrl: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
  alt: PropTypes.string,
}

export default CarSprite
