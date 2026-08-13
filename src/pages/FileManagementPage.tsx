import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useRoutes, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser } from '@/store/store'
import FileList from '@/components/files/FileList'
import FolderBrowser from '@/components/files/FolderBrowser'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface FileManagementPageProps {
  className?: string
}

export default function FileManagementPage({ className }: FileManagementPageProps) {
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.user)

  useEffect(() => {
    dispatch(getFolders())
    dispatch(getFiles())
  }, [dispatch])

  return (
    <div className={className}>
      {/* Folder Browser Sidebar */}
      <FolderBrowser initialPath="" />

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Upload button */}
          <Button
            variant="primary"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            Upload
          </Button>

          {/* New folder button (only show when in root) */}
          {/* File upload input (hidden) */}
          <input
            type="file"
            multiple
            id="file-upload"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.jpg,.jpeg,.png"
            className="hidden"
          />
        </div>

        {/* File List */}
        <FileList initialFolderId="" />
      </div>
    </div>
  )
}