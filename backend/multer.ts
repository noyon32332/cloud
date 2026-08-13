import multer from 'multer'
import path from 'path'

// Configure storage - store files locally in the uploads directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using timestamp + original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    const baseName = path.basename(file.originalname, ext)
    cb(null, baseName + '-' + uniqueSuffix + ext)
  }
})

// File filter - allow common file types
const fileFilter = (req: any, file: any, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/zip'
  ]

  if (allowedTypes.includes(file.mimeType)) {
    cb(null, true)
  } else {
    cb(null, false)
    // Optionally reject with error
    // cb(new Error('Invalid file type'))
  }
}

export const upload = multer({ storage, fileFilter })