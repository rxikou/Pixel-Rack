import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Button from './Button'
import PixelCarIcon from './PixelCarIcon'

const PLACEHOLDER_COLORS = ['#f97316', '#38bdf8', '#f472b6', '#4ade80', '#facc15']

function UploadModal({ onClose, onUpload }) {
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

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 4
      })
    }, 50)
    return () => clearInterval(interval)
  }, [isProcessing])

  useEffect(() => {
    if (progress < 100 || !isProcessing) return

    onUpload({
      id: crypto.randomUUID(),
      name,
      series: series || 'Uncategorized',
      color: spriteColor,
    })
  }, [progress, isProcessing, name, series, spriteColor, onUpload])

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
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-bg-primary/80 px-4">
      <div className="w-full max-w-sm border-2 border-accent-blue bg-bg-container p-6">
        <h2 className="mb-4 font-pixel text-xs text-accent-blue">Upload Car</h2>

        {isProcessing ? (
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="flex items-center gap-3">
              <img
                src={previewUrl}
                alt="Original upload"
                className="h-20 w-20 border-2 border-bg-primary object-cover"
              />
              <span className="text-accent-blue">&#8594;</span>
              <div className="flex h-20 w-20 items-center justify-center border-2 border-accent-blue bg-bg-primary">
                <PixelCarIcon color={spriteColor} className="h-10 w-16" />
              </div>
            </div>
            <div className="w-full border-2 border-bg-primary bg-bg-primary">
              <div
                className="h-3 bg-accent-blue transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="font-mono text-xs text-text-secondary">
              Pixelating "{name}"... {progress}%
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="cursor-pointer border-2 border-dashed border-text-secondary p-6 text-center font-mono text-xs text-text-secondary hover:border-accent-blue">
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

            <div className="mt-2 flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Upload
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

UploadModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
}

export default UploadModal
