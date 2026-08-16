import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download,
  Eye,
  FileCode,
  FileImage,
  FileText,
  FolderKanban,
  Grid,
  HardDrive,
  List,
  Plus,
  Search,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import {
  uploadFileToSupabase,
  getUserFilesFirestore,
  deleteFileFirestore,
  type FirestoreFile,
} from '@/services/firestore'

function formatBytes(bytes: number, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function getFileIcon(fileType: string) {
  const lower = fileType.toLowerCase()
  if (lower.includes('pdf')) return <FileText className="h-5 w-5 text-red-500" />
  if (lower.includes('image') || lower.includes('png') || lower.includes('jpg') || lower.includes('jpeg'))
    return <FileImage className="h-5 w-5 text-emerald-500" />
  if (lower.includes('doc') || lower.includes('ppt'))
    return <FileCode className="h-5 w-5 text-blue-500" />
  return <FileText className="h-5 w-5 text-slate-500" />
}

export default function MyFilesPage() {
  const { user } = useAuth()
  const userId = user?.id || 'demo-user-1'

  const [files, setFiles] = useState<FirestoreFile[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [previewFile, setPreviewFile] = useState<FirestoreFile | null>(null)
  const [isDragOver, setIsDragOver] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch User's Files from Firestore
  const loadFiles = async () => {
    setLoading(true)
    const userFiles = await getUserFilesFirestore(userId)
    setFiles(userFiles)
    setLoading(false)
  }

  useEffect(() => {
    void loadFiles()
  }, [userId])

  // File Upload Handler
  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    const file = fileList[0]

    // Guard: block upload if user is not authenticated
    if (!user?.id) {
      alert('You must be signed in to upload files.')
      return
    }

    // Allowed Extensions Check
    const allowed = ['pdf', 'docx', 'pptx', 'png', 'jpg', 'jpeg']
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    if (!allowed.includes(ext)) {
      alert('Only PDF, DOCX, PPTX, PNG, and JPG files are supported.')
      return
    }

    console.log('[MyFilesPage] Upload triggered — userId:', userId, '| file:', file.name)

    setUploading(true)
    setUploadProgress(0)

    try {
      await uploadFileToSupabase(file, userId, (progress) => {
        setUploadProgress(progress)
      })
      await loadFiles()
    } catch (err) {
      console.error('[MyFilesPage] ❌ File upload failed:', err)
      alert(
        err instanceof Error
          ? `Upload failed:\n${err.message}`
          : 'File upload failed. Check the browser console for details.'
      )
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  // Delete Handler
  const handleDelete = async (file: FirestoreFile) => {
    if (confirm(`Are you sure you want to delete "${file.fileName}"?`)) {
      try {
        await deleteFileFirestore(file.id, file.storagePath)
        setFiles((prev) => prev.filter((f) => f.id !== file.id))
        if (previewFile?.id === file.id) setPreviewFile(null)
      } catch (err) {
        console.error('Delete file error', err)
      }
    }
  }

  // Filtered files by search query
  const filteredFiles = files.filter((f) =>
    f.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Storage usage stats
  const totalStorageBytes = files.reduce((acc, f) => acc + (f.fileSize || 0), 0)
  const storageCapacityBytes = 5 * 1024 * 1024 * 1024 // 5 GB limit
  const storagePercentage = Math.min(
    Math.round((totalStorageBytes / storageCapacityBytes) * 100),
    100
  )

  return (
    <DashboardLayout>
      <div className="space-y-7">
        {/* Header Banner */}
        <section className="panel-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <span className="eyebrow">Supabase Storage</span>
            <h1 className="mt-1 text-lg font-bold text-slate-900">My Files</h1>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Upload, preview, organize, and download your academic documents.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-primary shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            Upload Document
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => void handleUpload(e.target.files)}
            accept=".pdf,.docx,.pptx,.png,.jpg,.jpeg"
            className="hidden"
          />
        </section>

        {/* Drag & Drop Upload Zone + Storage Usage Bar */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Drag & Drop Zone (8 cols) */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragOver(false)
              void handleUpload(e.dataTransfer.files)
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`panel-card lg:col-span-8 cursor-pointer border-2 border-dashed p-6 text-center transition-all ${
              isDragOver
                ? 'border-blue-500 bg-blue-50/60'
                : 'panel-card-interactive border-slate-200/80'
            }`}
          >
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <UploadCloud className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold text-slate-900">
              Drag &amp; Drop files here or <span className="text-blue-600 underline">browse</span>
            </p>
            <p className="mt-1 text-[10px] text-slate-400">
              Supports PDF, DOCX, PPTX, PNG, JPG (Scoped to your user account)
            </p>

            {uploading && (
              <div className="mx-auto mt-4 max-w-xs space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-blue-700">
                  <span>Uploading to Supabase...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Storage Usage Card (4 cols) */}
          <div className="panel-card flex flex-col justify-between p-5 space-y-3 lg:col-span-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <HardDrive className="h-4 w-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900">Cloud Storage</h3>
              </div>
              <span className="chip bg-slate-100 text-slate-500">5 GB Quota</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-800">{formatBytes(totalStorageBytes)} Used</span>
                <span className="text-blue-600">{files.length} Files</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all"
                  style={{ width: `${Math.max(storagePercentage, 2)}%` }}
                />
              </div>
            </div>

            <p className="text-[10px] font-medium text-slate-400">
              Supabase Storage encrypts and protects your documents at rest.
            </p>
          </div>
        </div>

        {/* Filter & View Mode Controls */}
        <div className="panel-card flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search file name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-8"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200/60">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <Grid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Files Grid / Table Display */}
        {loading ? (
          <div className="panel-card p-10 text-center space-y-2">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="text-xs font-medium text-slate-500">Fetching documents from Firestore...</p>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="panel-card border-dashed p-10 text-center">
            <FolderKanban className="mx-auto mb-1 h-8 w-8 text-slate-300" />
            <h3 className="text-xs font-bold text-slate-700">No files uploaded yet</h3>
            <p className="mt-1 text-[11px] text-slate-400">
              Drag and drop files above to upload them to Supabase Storage.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="panel-card panel-card-interactive flex flex-col justify-between p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                      {getFileIcon(file.fileType)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-900" title={file.fileName}>
                        {file.fileName}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400">
                        {formatBytes(file.fileSize)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setPreviewFile(file)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-blue-600"
                  >
                    <Eye className="h-3.5 w-3.5" /> Preview
                  </button>
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </a>
                  <button
                    type="button"
                    onClick={() => void handleDelete(file)}
                    className="p-1 text-slate-400 hover:text-red-600"
                    title="Delete File"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="panel-card p-5 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 font-bold uppercase tracking-wider text-slate-400 text-[9px]">
                  <th className="pb-2.5">File Name</th>
                  <th className="pb-2.5">Size</th>
                  <th className="pb-2.5">Type</th>
                  <th className="pb-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        {getFileIcon(file.fileType)}
                        <span className="font-bold text-slate-900">{file.fileName}</span>
                      </div>
                    </td>
                    <td className="py-3 font-medium text-slate-600">{formatBytes(file.fileSize)}</td>
                    <td className="py-3 text-[10px] font-medium uppercase text-slate-500">{file.fileType.split('/')[1] || file.fileType}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setPreviewFile(file)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-blue-600"
                        >
                          <Eye className="h-3.5 w-3.5" /> Preview
                        </button>
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                        >
                          <Download className="h-3.5 w-3.5" /> Download
                        </a>
                        <button
                          type="button"
                          onClick={() => void handleDelete(file)}
                          className="text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* File Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">File Preview</span>
                  <h2 className="text-base font-bold text-slate-900">{previewFile.fileName}</h2>
                  <p className="text-[11px] text-slate-400">{formatBytes(previewFile.fileSize)}</p>
                </div>
                <button type="button" onClick={() => setPreviewFile(null)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center justify-center p-4 rounded-xl bg-slate-50 border border-slate-100 min-h-[220px]">
                {previewFile.fileType.toLowerCase().includes('image') ||
                ['png', 'jpg', 'jpeg'].some((ext) => previewFile.fileName.toLowerCase().endsWith(ext)) ? (
                  <img
                    src={previewFile.fileUrl}
                    alt={previewFile.fileName}
                    className="max-h-80 w-auto rounded-lg object-contain"
                  />
                ) : (
                  <div className="text-center space-y-2">
                    {getFileIcon(previewFile.fileType)}
                    <p className="font-bold text-slate-800 text-xs">{previewFile.fileName}</p>
                    <p className="text-[11px] text-slate-400">Document preview ready for download</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPreviewFile(null)}
                  className="rounded-lg border border-slate-200/80 px-4 py-2 font-semibold text-slate-700"
                >
                  Close
                </button>
                <a
                  href={previewFile.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-xs hover:bg-blue-700 inline-flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" /> Download File
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
