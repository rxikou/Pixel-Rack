import { useCallback, useRef } from 'react'
import PropTypes from 'prop-types'

// Crop is stored as fractions of the image (0-1) so it stays correct no matter
// what size the preview renders at, and maps straight onto natural pixels.
export const INITIAL_CROP = { x: 0.1, y: 0.1, w: 0.8, h: 0.8 }
const MIN_SIZE = 0.08

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

// Controlled on purpose: the parent owns the crop, so there is no internal
// state to keep in sync with the selected file and no reset effect.
function ImageCropper({ src, crop, onChange }) {
  const imgRef = useRef(null)
  const frameRef = useRef(null)
  // 'move' | 'resize' | null
  const dragRef = useRef(null)

  const pointerFraction = useCallback((e) => {
    const rect = frameRef.current.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    }
  }, [])

  function startDrag(mode, e) {
    e.preventDefault()
    e.stopPropagation()
    const p = pointerFraction(e)
    dragRef.current = { mode, startX: p.x, startY: p.y, crop }
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }

  function onPointerMove(e) {
    const drag = dragRef.current
    if (!drag) return
    const p = pointerFraction(e)
    const dx = p.x - drag.startX
    const dy = p.y - drag.startY

    if (drag.mode === 'move') {
      onChange({
        ...drag.crop,
        x: clamp(drag.crop.x + dx, 0, 1 - drag.crop.w),
        y: clamp(drag.crop.y + dy, 0, 1 - drag.crop.h),
      })
    } else {
      const w = clamp(drag.crop.w + dx, MIN_SIZE, 1 - drag.crop.x)
      const h = clamp(drag.crop.h + dy, MIN_SIZE, 1 - drag.crop.y)
      onChange({ ...drag.crop, w, h })
    }
  }

  function endDrag() {
    dragRef.current = null
  }

  const pct = (n) => `${n * 100}%`

  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-[11px] text-text-secondary">
        Drag the box over just the car. Packaging and background get cut away.
      </p>
      <div
        ref={frameRef}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="relative select-none overflow-hidden border-2 border-bg-primary bg-bg-primary"
      >
        <img
          ref={imgRef}
          src={src}
          alt="Crop preview"
          draggable={false}
          className="block max-h-56 w-full object-contain"
        />

        {/* dimmed area outside the crop */}
        <div className="pointer-events-none absolute inset-0 bg-bg-primary/70" />

        <div
          onPointerDown={(e) => startDrag('move', e)}
          style={{ left: pct(crop.x), top: pct(crop.y), width: pct(crop.w), height: pct(crop.h) }}
          className="absolute cursor-move border-2 border-accent-blue shadow-[0_0_0_9999px_rgba(15,23,42,0.0)]"
        >
          {/* re-show the image inside the crop window at full brightness */}
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: `${100 / crop.w}% ${100 / crop.h}%`,
              backgroundPosition: `${(crop.x / (1 - crop.w || 1)) * 100}% ${(crop.y / (1 - crop.h || 1)) * 100}%`,
              backgroundRepeat: 'no-repeat',
            }}
          />
          <span
            onPointerDown={(e) => startDrag('resize', e)}
            className="absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 cursor-se-resize border-2 border-bg-primary bg-accent-blue"
          />
        </div>
      </div>
    </div>
  )
}

ImageCropper.propTypes = {
  src: PropTypes.string.isRequired,
  crop: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    w: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default ImageCropper

/**
 * Applies a fractional crop to a File and returns a new PNG File containing
 * only that region, at the source image's natural resolution.
 */
export async function cropFileToPng(file, crop) {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('Could not read that image'))
      el.src = url
    })

    const sx = Math.round(crop.x * img.naturalWidth)
    const sy = Math.round(crop.y * img.naturalHeight)
    const sw = Math.max(1, Math.round(crop.w * img.naturalWidth))
    const sh = Math.max(1, Math.round(crop.h * img.naturalHeight))

    const canvas = document.createElement('canvas')
    canvas.width = sw
    canvas.height = sh
    canvas.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh)

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
    return new File([blob], 'car.png', { type: 'image/png' })
  } finally {
    URL.revokeObjectURL(url)
  }
}
