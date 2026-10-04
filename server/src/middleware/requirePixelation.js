/**
 * Gates the photo transformation endpoint behind PIXELATION_ENABLED.
 *
 * The demo deployment runs with this off: the Gemini step is billed per
 * upload, so leaving it open to the public internet would spend real money on
 * anyone who finds the URL. Off is the default, so a deployment that forgets
 * to set the variable stays closed rather than open.
 *
 * This runs before multer on purpose, so a disabled build never accepts or
 * writes the upload to disk in the first place.
 */
export const PIXELATION_DISABLED_MESSAGE =
  'Photo transformation is still in the works and is switched off in this demo.'

export function requirePixelation(req, res, next) {
  if (process.env.PIXELATION_ENABLED === 'true') return next()

  res.status(503).json({
    success: false,
    error: PIXELATION_DISABLED_MESSAGE,
    code: 'FEATURE_DISABLED',
  })
}
