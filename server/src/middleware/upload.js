import multer from 'multer'

const MAX_UPLOAD_SIZE_MB = Number(process.env.MAX_UPLOAD_SIZE_MB || 5)

export const upload = multer({
  dest: 'temp_uploads/',
  limits: { fileSize: MAX_UPLOAD_SIZE_MB * 1024 * 1024 },
})
