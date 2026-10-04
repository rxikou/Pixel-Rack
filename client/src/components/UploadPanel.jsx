import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import BracketButton from './BracketButton'
import Panel from './Panel'
import PixelCarIcon from './PixelCarIcon'
import ImageCropper, { cropFileToPng, INITIAL_CROP } from './ImageCropper'
import { uploadCar } from '../api/cars'
import { fetchConfig } from '../api/config'
import { spriteColorFor } from '../utils/spriteColor'

const COMING_SOON =
  'Photo transformation is still in the works. This demo has it switched off for now, so nothing was uploaded.'

function UploadPanel({ onUpload }) {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [name, setName] = useState('')
  const [series, setSeries] = useState('')
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [crop, setCrop] = useState(INITIAL_CROP)
  // Assume off until the API says otherwise, so a slow or failed config
  // request cannot briefly present the feature as working.
  const [pixelationEnabled, setPixelationEnabled] = useState(false)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  useEffect(() => {
    let cancelled = false
    fetchConfig()
      .then((config) => {
        if (!cancelled) setPixelationEnabled(Boolean(config?.pixelationEnabled))
      })
      .catch(() => {
        // Leave it disabled: the server would refuse the upload anyway.
      })
    return () => {
      cancelled = true
    }
  }, [])

  function handleFileChange(e) {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
    setCrop(INITIAL_CROP)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // Say so on the click rather than letting them fill the form, wait through
    // an upload and then hit a 503 from the server.
    if (!pixelationEnabled) {
      setError('')
      setNotice(COMING_SOON)
      return
    }

    if (!name || !file) return

    setError('')
    setNotice('')
    setProgress(0)
    setIsProcessing(true)

    // Gemini sprite generation typically takes ~14-16 seconds end-to-end.
    // Progress smoothly advances from 0% toward 96% over ~15 seconds,
    // and hits 100% right when the server returns the generated sprite.
    const startTime = Date.now()
    const TARGET_DURATION_MS = 15000
    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const ratio = Math.min(elapsed / TARGET_DURATION_MS, 1)
      const current = Math.min(96, Math.round(100 * (1 - Math.pow(1 - ratio, 1.4))))
      setProgress(current)
    }, 100)

    try {
      // Upload only the cropped region: background removal treats a packaged
      // car as one object, so sending the whole photo yields a sprite of the
      // packaging rather than the car.
      const toUpload = crop ? await cropFileToPng(file, crop) : file
      const car = await uploadCar({
        file: toUpload,
        name,
        series,
      })
      clearInterval(progressTimer)
      setProgress(100)

      // Hold at 100% briefly so the user sees the completed state
      await new Promise((resolve) => setTimeout(resolve, 350))

      onUpload(car)
      // The car still saved; say so rather than silently showing a placeholder.
      if (car.pixelationError) {
        setError(`Saved, but pixelation failed: ${car.pixelationError}`)
      }
      setFile(null)
      setPreviewUrl('')
      setName('')
      setSeries('')
      setCrop(INITIAL_CROP)
    } catch (err) {
      clearInterval(progressTimer)
      setError(err.message)
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  return (
    <Panel
      id="upload-panel"
      title="Hot Wheels Pixelator"
      action={
        pixelationEnabled ? null : (
          <span className="border-2 border-[#05070d] bg-amber-400 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-[#0b1020]">
            In Development
          </span>
        )
      }
      bodyClassName="flex flex-col gap-4 p-3"
    >
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-wide text-text-secondary">
          Active Transformation
        </p>

        {isProcessing ? (
          <div className="flex flex-col gap-3 border-2 border-accent-blue/50 bg-bg-primary p-3">
            <p className="truncate font-mono text-xs text-text-secondary">
              {progress < 20
                ? `Uploading "${name}"...`
                : progress < 90
                  ? `Redrawing 16-bit sprite with Gemini...`
                  : progress < 100
                    ? `Finalizing pixel artwork...`
                    : `Transformation complete!`}
            </p>

            <div className="flex items-center justify-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <img
                  src={previewUrl}
                  alt="Original upload"
                  className="h-24 w-28 border-2 border-text-secondary/40 object-cover"
                />
                <span className="font-mono text-[10px] uppercase tracking-wide text-text-secondary">
                  Original
                </span>
              </div>

              <span aria-hidden="true" className="pb-4 text-xl text-accent-blue">
                &#10142;
              </span>

              <div className="flex flex-col items-center gap-1">
                <div className="flex h-24 w-28 items-center justify-center border-2 border-accent-blue bg-bg-container">
                  <PixelCarIcon
                    color={spriteColorFor(name || 'pending')}
                    className="h-14 w-20 opacity-60"
                  />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wide text-accent-blue">
                  Pixel Sprite
                </span>
              </div>
            </div>

            <div className="relative h-5 w-full border-2 border-bg-container bg-bg-container">
              <div
                className="h-full bg-accent-blue transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold text-text-primary">
                {progress}%
              </span>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            // noValidate while disabled, otherwise the browser's own "fill this
            // in" popup fires first and the click never reaches handleSubmit to
            // explain that the feature is off.
            noValidate={!pixelationEnabled}
            className="flex flex-col gap-2"
          >
            {error && (
              <p className="border-2 border-accent-pink/60 px-2 py-1.5 font-mono text-xs text-accent-pink">
                {error}
              </p>
            )}
            {notice && (
              <p className="border-2 border-amber-400/70 bg-amber-400/10 px-2 py-1.5 font-mono text-xs text-amber-200">
                {notice}
              </p>
            )}
            <label className="cursor-pointer border-2 border-dashed border-text-secondary p-3 text-center font-mono text-xs text-text-secondary hover:border-accent-blue sm:p-4">
              {file ? file.name : 'Tap or drag a photo to choose'}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="hidden"
              />
            </label>

            {previewUrl && (
              <ImageCropper src={previewUrl} crop={crop} onChange={setCrop} />
            )}

            <input
              type="text"
              placeholder="Car name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-2 border-bg-primary bg-bg-primary px-3 py-2 font-mono text-base text-text-primary outline-none focus:border-accent-blue sm:text-sm"
            />
            <input
              type="text"
              placeholder="Series (optional)"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              className="border-2 border-bg-primary bg-bg-primary px-3 py-2 font-mono text-base text-text-primary outline-none focus:border-accent-blue sm:text-sm"
            />
            <BracketButton type="submit" className="mt-1 w-full py-2">
              Upload &amp; Transform
            </BracketButton>
          </form>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t-2 border-accent-blue/20 pt-3">
        <p className="font-mono text-xs uppercase tracking-wide text-text-secondary">
          Queue Transformations
        </p>
        {isProcessing ? (
          <div className="flex items-center justify-between gap-2 border-2 border-bg-container bg-bg-primary px-2 py-1.5 font-mono text-xs text-text-secondary">
            <span className="truncate">Transforming "{name}"</span>
            <span className="shrink-0 text-accent-blue">{progress}%</span>
          </div>
        ) : (
          <p className="font-mono text-xs text-text-secondary">
            No transformations queued.
          </p>
        )}
      </div>
    </Panel>
  )
}

UploadPanel.propTypes = {
  onUpload: PropTypes.func.isRequired,
}

export default UploadPanel
