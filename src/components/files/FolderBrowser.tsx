import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectFolders, selectCurrentFolder, selectBreadcrumbs } from '@/store/slices/fileSlice'
import { getFolders, createFolder as createFolderService } from '@/services/fileService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useParams } from 'react-router-dom'

interface FolderBrowserProps {
  initialPath?: string
}

export default function FolderBrowser({ initialPath }: FolderBrowserProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { folderId } = useParams() as { folderId?: string }

  useEffect(() => {
    dispatch(getFolders())
  }, [dispatch])

  const folders = useSelector((state: any) => state.folders.tree)
  const currentFolder = useSelector((state: any) => state.folders.current)
  const breadcrumbs = useSelector((state: any) => state.folders.breadcrumbs)
  const loading = useSelector((state: any) => state.folders.loading)

  const [newFolderName, setNewFolderName] = useState('')

  const handleCreateFolder = async (name: string) => {
    if (!name.trim()) return
    try {
      await createFolderService(name.trim(), currentFolder?.id)
      dispatch(getFolders())
      setNewFolderName('')
    } catch (err: any) {
      console.error('Create folder error:', err.message)
    }
  }

  const navigateToFolder = (folderId: string, name?: string) => {
    const path = folderId ? `/files/folder/${folderId}` : '/files'
    navigate(path)
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <span className="animate-spin rounded-full border-b-2 border-emerald-500"></span>
      </div>
    )
  }

  return (
    <div className="bg-card-color border border-border-color/50 rounded-lg p-4 mb-4">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap gap-2 mb-3">
        {breadcrumbs.map((bc: { id: string; name: string; path: string }, index: number) => (
          <span key={index}>
            {index > 0 ? '>' : ''}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateToFolder(bc.id, bc.name)}
              className="p-1 rounded-md hover:bg-emerald-500/20"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" />
                <path d="M9 5h9m2 3H7" />
              </svg>
            </Button>
            {bc.name}{' '}
            {index < breadcrumbs.length - 1 ? '' : ''}
          </span>
        ))}
      </nav>

      {/* Current folder path and create new folder */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Select folder"
          readOnly
          value={currentFolder?.name || 'My Drive'}
          className="flex-1 rounded-none rounded-l-lg"
        />
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setNewFolderName((prev) => `${prev} `)}
          className="hidden sm:flex items-center gap-1"
        >
          +
        </Button>
        {currentFolder ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setNewFolderName('')}
            className="hidden sm:flex items-center gap-1"
          >
            +
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setNewFolderName('')}
            className="hidden sm:flex items-center gap-1"
          >
            +
          </Button>
        )}

        {/* New folder input */}
        {currentFolder ? (
          <div className="hidden sm:flex items-center gap-2">
            <Input
              placeholder="New folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-32 rounded-r-lg"
            />
            <Button
              variant="primary"
              onClick={() => handleCreateFolder(newFolderName)}
              className="rounded-l-lg"
            >
              Create
            </Button>
          </div>
        ) : (
          <Button
            variant="primary"
            onClick={() => handleCreateFolder(newFolderName)}
          >
            Create folder
          </Button>
        )}
      </div>

      {/* Folder tree */}
      {folders.length > 0 && (
        <div className="mt-3 max-h-80 overflow-y-auto">
          {folders.map((folder: any) => (
            <Button
              key={folder.id}
              variant="ghost"
              size="icon"
              onClick={() => navigateToFolder(folder.id, folder.name)}
              className="flex items-center gap-1 p-1 rounded-md hover:bg-emerald-500/20"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10 6L8.59 2.29a2 2 0 0 0-2.83 1.41L3 6v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6zM14 4h-2v2h2V4zm0 6h-2v2h2V10zm0 6h-2v2h2v-2zm-7 4.59L8.59 15.41a2 2 0 0 0-2.83 1.41l1.42 1.42L3 20v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2l-1.41-1.41a2 2 0 0 0-1.42-2.83l-8.59 8.59a2 2 0 0 1-2.83 0l-8.59-8.59a2 2 0 0 1 0-2.84l8.59-8.59z" />
              </svg>
              {folder.name}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}