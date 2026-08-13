import { Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { File } from '../models/File'
import { Folder } from '../models/Folder'
import { upload } from '../multer'

// @desc    Upload a file
// @route   POST /api/files/upload/:folderId? (optional folderId)
// @access  Private
export function uploadFile(req: Request, res: Response): void {
  const folderId = req.params.folderId || undefined

  // Handle multer upload
  upload.single('file')(req as any, res as any, async (err: any) => {
    if (err) {
      console.error('Multer error:', err.message)
      return res.status(400).json({ message: err.message || 'File upload error' })
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    try {
      const { originalName, size, mimeType } = req.file
      const uploadedBy = (req as any).user?.id || null

      // If folderId provided, verify it exists and belongs to user
      let folderDocument = null
      if (folderId) {
        folderDocument = await Folder.findById(folderId)
        if (!folderDocument) {
          // Delete the uploaded file if folder not found
          fs.unlinkSync(req.file.path)
          return res.status(404).json({ message: 'Folder not found' })
        }
      }

      const newFile = new File({
        name: req.file.filename,
        originalName,
        url: `/uploads/${req.file.filename}`,
        size,
        mimeType,
        uploadedBy,
        folderId: folderDocument?._id,
        sharedWith: []
      })

      await newFile.save()

      // If folderId provided, associate file with folder
      if (folderDocument && folderDocument.owner.toString() !== uploadedBy?.toString()) {
        return res.status(403).json({ message: 'Not authorized to upload to this folder' })
      }

      res.status(201).json({
        message: 'File uploaded successfully',
        file: {
          id: newFile._id,
          name: newFile.name,
          originalName: newFile.originalName,
          url: newFile.url,
          size: newFile.size,
          mimeType: newFile.mimeType,
          folderId: newFile.folderId
        }
      })
    } catch (error: any) {
      console.error('Upload error:', error.message)
      // Clean up uploaded file on error
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path)
      }
      res.status(500).json({ message: error.message || 'Server error during upload' })
    }
  })
}

// @desc    Get all files with optional folder filtering
// @route   GET /api/files
// @access  Private
export function getFiles(req: Request, res: Response): void {
  try {
    const { folderId, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query

    // Build query
    const query: any = { uploadedBy: (req as any).user?.id }

    if (folderId) {
      query.folderId = folderId
    }

    // Add search filter if provided
    if (search) {
      query.name = { $regex: search as string, $options: 'i' }
    }

    // Sort options
    const sortOption: any = {}
    sortOption[sortBy as string] = sortOrder === 'desc' ? -1 : 1

    const files = File.find(query)
      .sort(sortOption)
      .select('-__v')
      .lean()

    const total = File.countDocuments(query)

    Promise.all([files, total]).then(([files, total]) => {
      res.json({
        files,
        total,
        page: 1,
        pages: 1
      })
    }).catch((err) => {
      res.status(500).json({ message: err.message || 'Error fetching files' })
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching files' })
  }
}

// @desc    Get a single file by ID
// @route   GET /api/files/:id
// @access  Private
export function getFileById(req: Request, res: Response): void {
  try {
    const file = File.findById(req.params.id)
      .select('-__v')
      .lean()

    file.then((result) => {
      if (!result) {
        return res.status(404).json({ message: 'File not found' })
      }
      res.json(result)
    }).catch((err) => {
      res.status(500).json({ message: err.message || 'Error fetching file' })
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching file' })
  }
}

// @desc    Update file (share, rename, etc.)
// @route   PUT /api/files/:id
// @access  Private
export function updateFile(req: Request, res: Response): void {
  try {
    const { name, sharedWith } = req.body

    const updatedFile = File.findByIdAndUpdate(
      req.params.id,
      { name, sharedWith },
      { new: true, runValidators: true }
    )
      .select('-__v')
      .lean()

    updatedFile.then((result) => {
      if (!result) {
        return res.status(404).json({ message: 'File not found' })
      }
      res.json({
        message: 'File updated successfully',
        file: result
      })
    }).catch((err) => {
      res.status(500).json({ message: err.message || 'Error updating file' })
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating file' })
  }
}

// @desc    Delete a file
// @route   DELETE /api/files/:id
// @access  Private
export function deleteFile(req: Request, res: Response): void {
  try {
    const file = File.findById(req.params.id).lean()

    file.then((result) => {
      if (!result) {
        return res.status(404).json({ message: 'File not found' })
      }

      // Delete physical file from storage
      const filePath = path.join('uploads', result.name)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }

      // Delete from database
      File.findByIdAndDelete(req.params.id)

      res.json({
        message: 'File deleted successfully'
      })
    }).catch((err) => {
      res.status(500).json({ message: err.message || 'Error deleting file' })
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error deleting file' })
  }
}

// @desc    Get files in a specific folder
// @route   GET /api/files/folder/:folderId
// @access  Private
export function getFilesByFolder(req: Request, res: Response): void {
  try {
    const { folderId } = req.params

    const files = File.find({ folderId })
      .select('-__v')
      .lean()

    const total = File.countDocuments({ folderId })

    Promise.all([files, total]).then(([files, total]) => {
      res.json({
        files,
        total,
        folderId
      })
    }).catch((err) => {
      res.status(500).json({ message: err.message || 'Error fetching folder files' })
    })
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching folder files' })
  }
}