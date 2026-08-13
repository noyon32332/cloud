import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FileUp, FolderOpen, HardDrive, Upload } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import FileUploadZone, { type UploadItem } from '@/components/files/FileUploadZone'
import Modal from '@/components/ui/modal'
import Toast, { type ToastState } from '@/components/ui/toast'
import {
  deleteStudentFile,
  getFirestoreErrorMessage,
  listStudentFiles,
  renameStudentFile,
  uploadStudentFile,
  type StudentFile,
} from '@/services/files'
import { formatBytes, isFileAllowed } from '@/lib/fileUtils'

interface RenameState {
  file: StudentFile
}

export default function FileManagerPage() {
  const { user } = useAuth()
  const [files, setFiles] = useState<StudentFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [renameTarget, setRenameTarget] = useState<RenameState | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [renaming, setRenaming] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<StudentFile | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = useCallback((type: ToastState['type'], message: string) => {
    setToast({ type, message })
  }, [])

  const fetchFiles = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const list = await listStudentFiles(user.id)
      setFiles(list)
    } catch (error) {
      showToast('error', getFirestoreErrorMessage(error, 'Failed to load your files.'))
    } finally {
      setLoading(false)
    }
  }, [user, showToast])

  useEffect(() => {
    void fetchFiles()
  }, [fetchFiles])

  const summary = useMemo(() => {
    const totalSize = files.reduce((sum, file) => sum + file.fileSize, 0)
    const month = new Date().getMonth()
    const thisMonth = files.filter((file) => new Date(file.uploadedAt).getMonth() === month).length
    return { count: files.length, totalSize, thisMonth }
  }, [files])

  const handleFilesSelected = useCallback(
    (selected: File[]) => {
      if (!user) return
      if (selected.length === 0) {
        showToast('error', 'No valid files selected. Check the allowed types and size limit.')
        return
      }
      setUploadOpen(true)
      const items: UploadItem[] = selected.map((file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'uploading',
      }))
      setUploads((prev) => [...prev, ...items])

      for (const [index, file] of selected.entries()) {
        const itemId = items[index].id
        uploadStudentFile(file, user, {
          onProgress: (percent) => {
            setUploads((prev) => prev.map((item) => (item.id === itemId ? { ...item, progress: percent } : item)))
          },
        })
          .then(() => {
            setUploads((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: 'done', progress: 100 } : item)))
            showToast('success', `"${file.name}" uploaded successfully.`)
            void fetchFiles()
          })
          .catch((error) => {
            setUploads((prev) => prev.map((item) => (item.id === itemId ? { ...item, status: 'error' } : item)))
            showToast('error', getFirestoreErrorMessage(error, `Failed to upload "${file.name}".`))
          })
      }
    },
    [user, showToast, fetchFiles]
  )

  const handlePreview = useCallback((file: StudentFile) => {
    window.open(file.downloadURL, '_blank', 'noopener,noreferrer')
  }, [])

  const handleDownload = useCallback((file: StudentFile) => {
    const anchor = document.createElement('a')
    anchor.href = file.downloadURL
    anchor.download = file.fileName
    anchor.target = '_blank'
    anchor.rel = 'noopener noreferrer'
    anchor.click()
  }, [])

  const handleCopyLink = useCallback(
    (file: StudentFile) => {
      void navigator.clipboard
        .writeText(file.downloadURL)
        .then(() => showToast('success', 'Download link copied to clipboard.'))
        .catch(() => showToast('error', 'Could not copy the link. Try again.'))
    },
    [showToast]
  )

  const openRename = useCallback((file: StudentFile) => {
    setRenameValue(file.fileName)
    setRenameTarget({ file })
  }, [])

  const confirmRename = useCallback(async () => {
    if (!renameTarget) return
    const name = renameValue.trim()
    if (!name) {
      showToast('error', 'File name cannot be empty.')
      return
    }
    if (!isFileAllowed(name)) {
      showToast('error', 'Keep the original file extension when renaming.')
      return
    }
    try {
      setRenaming(true)
      await renameStudentFile(renameTarget.file.id, name)
      showToast('success', 'File renamed successfully.')
      setRenameTarget(null)
      void fetchFiles()
    } catch (error) {
      showToast('error', getFirestoreErrorMessage(error, 'Failed to rename the file.'))
    } finally {
      setRenaming(false)
    }
  }, [renameTarget, renameValue, showToast, fetchFiles])

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    try {
      setDeleting(true)
      await deleteStudentFile(deleteTarget)
      showToast('success', 'File deleted successfully.')
      setDeleteTarget(null)
      void fetchFiles()
    } catch (error) {
      showToast('error', getFirestoreErrorMessage(error, 'Failed to delete the file.'))
    } finally {
      setDeleting(false)
    }
  }, [deleteTarget, showToast, fetchFiles])

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1200px] space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">My Files</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Upload, preview, and manage your study files securely.</p>
          </div>
          <button
            type="button"
            onClick={() => setUploadOpen((prev) => !prev)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/40 active:scale-95"
          >
            <Upload className="h-4 w-4" />
            Upload File
          </button>
        </div>

        {/* Summary chips */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: FolderOpen, label: 'Total files', value: `${summary.count}` },
            { icon: HardDrive, label: 'Storage used', value: formatBytes(summary.totalSize) },
            { icon: FileUp, label: 'Uploaded this month', value: `${summary.thisMonth}` },
          ].map((chip, index) => (
            <motion.div
              key={chip.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/70 p-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/60"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-500 dark:text-blue-400">
                <chip.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{chip.label}</p>
                <p className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">{chip.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Upload zone */}
        <AnimatePresence initial={false}>
          {uploadOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <FileUploadZone onFilesSelected={handleFilesSelected} uploads={uploads} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* File list */}
        <FileList initialFolderId="" />
      </div>

      {/* Rename modal */}
      <Modal open={!!renameTarget} onClose={() => setRenameTarget(null)} title="Rename File">
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">New file name</label>
        <input
          value={renameValue}
          onChange={(event) => setRenameValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') void confirmRename()
          }}
          autoFocus
          className="h-11 w-full rounded-xl border border-slate-200 bg-white/70 px-4 text-sm text-slate-900 outline-none transition-all focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white"
          placeholder="e.g. Calculus_Notes.pdf"
        />
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          Keep the file extension (e.g. .pdf, .docx) so the file stays recognizable.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setRenameTarget(null)}
            className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void confirmRename()}
            disabled={renaming}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50"
          >
            {renaming && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            Rename
          </button>
        </div>
      </Modal>

      {/* Delete confirm modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete File">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-slate-900 dark:text-white">&quot;{deleteTarget?.fileName}&quot;</span>? This will
          permanently remove the file from storage. This action cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void confirmDelete()}
            disabled={deleting}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition-all hover:from-red-500 hover:to-rose-500 disabled:opacity-50"
          >
            {deleting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
            Delete
          </button>
        </div>
      </Modal>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </DashboardLayout>
  )
}
