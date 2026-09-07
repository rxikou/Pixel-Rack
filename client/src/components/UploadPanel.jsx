import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import BracketButton from './BracketButton'
import Panel from './Panel'
import PixelCarIcon from './PixelCarIcon'

const PLACEHOLDER_COLORS = ['#f97316', '#38bdf8', '#f472b6', '#4ade80', '#facc15']

function UploadPanel({ onUpload }) {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [name, setName] = useState('')
  const [series, setSeries] = useState('')
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [spriteColor, setSpriteColor] = useState(null)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  useEffect(() => {
    if (!isProcessing) return undefined

    let current = 0
    const interval = setInterval(() => {
      current += 4
      setProgress(current)

      if (current >= 100) {
        clearInterval(interval)
        onUpload({
          id: crypto.randomUUID(),
          name,
          series: series || 'Uncategorized',
          color: spriteColor,
        })
        setIsProcessing(false)
        setFile(null)
        setPreviewUrl('')
        setName('')
        setSeries('')
        setProgress(0)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [isProcessing, name, series, spriteColor, onUpload])

  function handleFileChange(e) {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!name || !file) return

    setSpriteColor(
      PLACEHOLDER_COLORS[Math.floor(Math.random() * PLACEHOLDER_COLORS.length)],
    )
    setIsProcessing(true)
  }

  return (
    <Panel
      id="upload-panel"
      title="Hot Wheels Pixelator"
      bodyClassName="flex flex-col gap-4 p-3"
    >
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs uppercase tracking-wide text-text-secondary">
          Active Transformation
        </p>

        {isProcessing ? (
          <div className="flex flex-col gap-3 border-2 border-accent-blue/50 bg-bg-primary p-3">
            <p className="truncate font-mono text-xs text-text-secondary">
              Transforming "{name}"
            </p>

            <div className="flex items-center justify-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <img
                  src={previewUrl}
                  alt="Original upload"
                  className="h-20 w-20 border-2 border-text-secondary/40 object-cover"
                />
                <span className="font-mono text-[10px] uppercase tracking-wide text-text-secondary">
                  Original
                </span>
              </div>

              <span aria-hidden="true" className="pb-4 text-xl text-accent-blue">
                &#10142;
              </span>

              <div className="flex flex-col items-center gap-1">
                <div className="flex h-20 w-20 items-center justify-center border-2 border-accent-blue bg-bg-container">
                  <PixelCarIcon color={spriteColor} className="h-10 w-16" />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wide text-accent-blue">
                  Pixel Sprite
                </span>
              </div>
            </div>

            <div className="relative h-5 w-full border-2 border-bg-container bg-bg-container">
              <div
                className="h-full bg-accent-blue transition-all"
                style={{ width: `${progress}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-bold text-text-primary">
                {progress}%
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label className="cursor-pointer border-2 border-dashed border-text-secondary p-4 text-center font-mono text-xs text-text-secondary hover:border-accent-blue">
              {file ? file.name : 'Drag & drop a photo, or click to choose'}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="hidden"
              />
            </label>
            <input
              type="text"
              placeholder="Car name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-2 border-bg-primary bg-bg-primary px-3 py-2 font-mono text-sm text-text-primary outline-none focus:border-accent-blue"
            />
            <input
              type="text"
              placeholder="Series (optional)"
              value={series}
              onChange={(e) => setSeries(e.target.value)}
              className="border-2 border-bg-primary bg-bg-primary px-3 py-2 font-mono text-sm text-text-primary outline-none focus:border-accent-blue"
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
