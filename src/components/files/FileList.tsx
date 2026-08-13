import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { File, Folder } from '@/backend/models'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectFiles, selectFolders, selectCurrentFolder } from '@/store/slices/fileSlice'
import { getFiles, getFilesByFolder, createFolder } from '@/services/fileService'
import { formatBytes, getFileTypeInfo, isFileAllowed } from '@/lib/fileUtils'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { useRouter } from 'react-router-dom'

interface FileItem {
  id: string
  name: string
  originalName: string
  url: string
  size: number
  mimeType: string
  folderId?: string
  sharedWith: string[]
  createdAt: Date
}

interface FileListProps {
  initialFolderId?: string
}

export default function FileList({ initialFolderId }: FileListProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const router = useRouter()

  // Get folder ID from route or initial prop
  const { folderId } = router.currentRouteParams || {}
  const currentFolderId = initialFolderId || folderId

  useEffect(() => {
    if (currentFolderId) {
      dispatch(getFilesByFolder(currentFolderId))
    } else {
      dispatch(getFiles())
    }
  }, [currentFolderId, dispatch])

  const files = useSelector((state: any) => state.files.items)
  const folders = useSelector((state: any) => state.folders.items)
  const currentFolder = useSelector((state: any) => state.folders.current)
  const loading = useSelector((state: any) => state.files.loading)
  const error = useSelector((state: any) => state.files.error)

  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'createdAt'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [renameModalOpen, setRenameModalOpen] = useState(false)
  const [renameFileId, setRenameFileId] = useState<string>('')
  const [renameNewName, setRenameNewName] = useState<string>('')

  // Breadcrumbs
  const breadcrumbs = useSelector((state: any) => state.folders.breadcrumbs)

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value)
  }

  const handleSortChange = (e: any) => {
    setSortBy(e.target.value)
  }

  const handleOrderChange = (e: any) => {
    setSortOrder(e.target.value)
  }

  const handleViewModeChange = (e: any) => {
    setViewMode(e.target.value)
  }

  const handleRename = () => {
    setRenameModalOpen(true)
    setRenameFileId('')
    setRenameNewName('')
  }

  const confirmRename = async () => {
    if (!renameFileId || !renameNewName.trim()) return

    try {
      await File.findByIdAndUpdate(renameFileId, { name: renameNewName.trim() })
      setRenameModalOpen(false)
      setRenameNewName('')
      dispatch(getFiles())
    } catch (err: any) {
      console.error('Rename error:', err.message)
    }
  }

  const handleFileAction = async (fileId: string, action: 'delete' | 'share' | 'download' | 'move' | 'copy') => {
    switch (action) {
      case 'delete':
        if (confirm('Are you sure you want to delete this file?')) {
          try {
            const file = files.find((f: FileItem) => f.id === fileId)
            if (file?.url) {
              const filePath = path.join('uploads', file.url.split('/').pop() || '')
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
              }
            }
            await File.findByIdAndDelete(fileId)
            dispatch(getFiles())
          } catch (err: any) {
            console.error('Delete error:', err.message)
          }
        }
        break
      case 'share':
        // Implement sharing logic
        break
      case 'download':
        // Implement download logic
        break
      case 'move':
        // Implement move logic
        break
      case 'copy':
        // Implement copy logic
        break
    }
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <span className="animate-spin rounded-full border-b-2 border-emerald-500"></span>
      </div>
    )
  }

  if (error) {
    return <Alert variant="destructive">{error}</Alert>
  }

  const filteredFiles = files.filter((file: FileItem) => {
    const matchesSearch = searchQuery
      ? file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.originalName.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    return matchesSearch
  })

  // Sort files
  const sortedFiles = [...filteredFiles].sort((a: FileItem, b: FileItem) => {
    let aValue: any, bValue: any

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'size':
        aValue = a.size
        bValue = b.size
        break
      case 'createdAt':
      default:
        aValue = a.createdAt
        bValue = b.createdAt
        break
    }

    if (sortOrder === 'desc') {
      return (bValue as any) > (aValue as any) ? 1 : -1
    }
    return (aValue as any) > (bValue as any) ? 1 : -1
  })

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 pb-4 border-b border-border-color/50 pb-6">
        {/* Left side: search and sort */}
        <div className="flex-1 flex flex-col sm:w-auto">
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full"
          />
          <Select onValueChange={handleSortChange} className="mt-2">
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Newest first</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="name">Name Z-A</SelectItem>
              <SelectItem value="size">Size largest first</SelectItem>
              <SelectItem value="size">Size smallest first</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={handleOrderChange} className="mt-2">
            <SelectTrigger>
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Right side: view mode and new folder */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-md"
          >
            {viewMode === 'grid' ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </Button>

          <Button variant="secondary" onClick={handleRename} className="hidden sm:block">
            Rename
          </Button>
        </div>
      </div>

      {/* Files Grid or List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedFiles.map((file: FileItem) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group rounded-xl border border-border-color/50 overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* File icon and name */}
            <div className="p-3">
              <FileIcon fileName={file.name} className="h-6 w-6 m-auto" />
              <p className="mt-1 text-xs text-caption color-slate-600 dark:text-slate-400 truncate">
                {file.originalName}
              </p>
            </div>

            {/* File actions */}
            <div className="p-2 border-t border-border-color/50">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center px-2 text-xs"
                onClick={() => handleFileAction(file.id, 'download')}
              >
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center px-2 text-xs mt-1"
                onClick={() => handleFileAction(file.id, 'share')}
              >
                Share
              </Button>
            </div>
          </motion.div>
        ))}

        {/* Empty state */}
        {!sortedFiles.length && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full p-8 text-center"
          >
            <p className="text-muted-foreground">No files found</p>
            <p className="mt-2 text-sm">Upload your first file or create a folder</p>
          </motion.div>
        )}
      </div>

      {/* Pagination */}
      {sortedFiles.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            Showing {Math.min((1 || 0) * 10 + 1, sortedFiles.length)} of {sortedFiles.length} files
          </span>
          <Select onValueChange={handleViewModeChange} className="hidden sm:block">
            <SelectTrigger>
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="list">List</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}