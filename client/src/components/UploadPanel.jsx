import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Button from './Button'
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
    <div id="upload-panel" className="flex flex-col gap-4 border-2 border-bg-container bg-bg-container/40 p-4">
      <h2 className="font-pixel text-base text-accent-blue">Hot Wheels Pixelator</h2>

      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-text-secondary">
          Active Transformation
        </p>

        {isProcessing ? (
          <div className="flex flex-col items-center gap-3 border-2 border-accent-blue bg-bg-primary p-3">
            <p className="font-mono text-xs text-text-secondary">
              Transforming "{name}"
            </p>
            <div className="flex items-center gap-2">
              <img
                src={previewUrl}
                alt="Original upload"
                className="h-16 w-16 border-2 border-bg-container object-cover"
              />
              <span className="text-accent-blue">&#8594;</span>
              <div className="flex h-16 w-16 items-center justify-center border-2 border-accent-blue bg-bg-container">
                <PixelCarIcon color={spriteColor} className="h-8 w-14" />
              </div>
            </div>
            <div className="w-full border-2 border-bg-container bg-bg-container">
              <div
                className="h-2 bg-accent-blue transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="font-mono text-xs text-text-secondary">{progress}%</p>
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
            <Button type="submit" variant="primary" className="w-full">
              Upload &amp; Transform
            </Button>
          </form>
        )}
      </div>

      <div>
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-text-secondary">
          Queue
        </p>
        {isProcessing ? (
          <div className="flex items-center justify-between border-2 border-bg-container bg-bg-primary px-2 py-1.5 font-mono text-xs text-text-secondary">
            <span className="truncate">Transforming "{name}"...</span>
            <span>{progress}%</span>
          </div>
        ) : (
          <p className="font-mono text-xs text-text-secondary">
            No transformations queued.
          </p>
        )}
      </div>
    </div>
  )
}

UploadPanel.propTypes = {
  onUpload: PropTypes.func.isRequired,
}

export default UploadPanel
