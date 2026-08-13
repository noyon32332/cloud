import { Router, Request, Response } from 'express'
import {
  uploadFile,
  getFiles,
  getFileById,
  updateFile,
  deleteFile,
  getFilesByFolder
} from '../controllers/fileController'

const router = Router()

// @route   POST /api/files/upload
// @desc    Upload a file (optional folderId query param)
// @access  Private
router.post('/upload/:folderId?', uploadFile)

// @route   GET /api/files
// @desc    Get all files with optional filtering
// @access  Private
router.get('/', getFiles)

// @route   GET /api/files/:id
// @desc    Get a single file by ID
// @access  Private
router.get('/:id', getFileById)

// @route   PUT /api/files/:id
// @desc    Update file (share, rename)
// @access  Private
router.put('/:id', updateFile)

// @route   DELETE /api/files/:id
// @desc    Delete a file
// @access  Private
router.delete('/:id', deleteFile)

// @route   GET /api/files/folder/:folderId
// @desc    Get files in a specific folder
// @access  Private
router.get('/folder/:folderId', getFilesByFolder)

export default router