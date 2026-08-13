import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowDownUp,
  Copy,
  Download,
  Eye,
  FolderOpen,
  Pencil,
  Search,
  Trash2,
} from 'lucide-react'
import type { StudentFile } from '@/services/files'
import { formatBytes, toDisplayDate, toDateTimeLabel } from '@/lib/fileUtils'
import FileIcon from '@/components/files/FileIcon'
import { cn } from '@/lib/utils'

type SortKey = 'newest' | 'oldest' | 'name' | 'size'

interface FileTableProps {
  files: StudentFile[]
  loading: boolean
  currentUserId: string
  onPreview: (file: StudentFile) => void
  onDownload: (file: StudentFile) => void
  onRename: (file: StudentFile) => void
  onDelete: (file: StudentFile) => void
  onCopyLink: (file: StudentFile) => void
}

const selectClassName =
  'h-10 rounded-xl border border-slate-200 bg-white/70 px-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300'

const actionButtonClassName =
  'flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-all hover:scale-105 hover:text-blue-500 dark:text-slate-500 dark:hover:text-blue-400'

export default function FileTable({
  files,
  loading,
  currentUserId,
  onPreview,
  onDownload,
  onRename,
  onDelete,
  onCopyLink,
}: FileTableProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [sort, setSort] = useState<SortKey>('newest')

  const fileTypes = useMemo(() => {
    const types = Array.from(new Set(files.map((file) => file.fileType).filter(Boolean))).sort()
    return ['All', ...types]
  }, [files])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    const result = files.filter((file) => {
      const matchesSearch = !term || file.fileName.toLowerCase().includes(term)
      const matchesType = typeFilter === 'All' || file.fileType === typeFilter
      return matchesSearch && matchesType
    })

    const sorted = [...result]
    switch (sort) {
      case 'newest':
        sorted.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
        break
      case 'oldest':
        sorted.sort((a, b) => a.uploadedAt.localeCompare(b.uploadedAt))
        break
      case 'name':
        sorted.sort((a, b) => a.fileName.localeCompare(b.fileName))
        break
      case 'size':
        sorted.sort((a, b) => b.fileSize - a.fileSize)
        break
    }
    return sorted
  }, [files, search, typeFilter, sort])

  const isOwner = (file: StudentFile) => file.uploadedBy === currentUserId

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="h-2.5 w-1/4 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
            </div>
            <div className="h-8 w-24 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200/60 bg-white/50 px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900/50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="absolute -inset-3 rounded-2xl bg-blue-500/10 blur-xl" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-blue-500 dark:text-blue-400">
            <FolderOpen className="h-8 w-8" />
          </div>
        </motion.div>
        <h4 className="mt-5 text-base font-bold text-slate-900 dark:text-white">
          {files.length === 0 ? 'No files yet' : 'No matching files'}
        </h4>
        <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {files.length === 0
            ? 'Upload your first file to get started. You can drag & drop files or browse from your computer.'
            : 'Try adjusting your search or filter to find what you are looking for.'}
        </p>
      </div>
    )
  }

  const actionButtons = (file: StudentFile) => (
    <div className="flex items-center justify-end gap-0.5">
      <button type="button" title="Preview" className={actionButtonClassName} onClick={() => onPreview(file)}>
        <Eye className="h-4 w-4" />
      </button>
      <button type="button" title="Download" className={actionButtonClassName} onClick={() => onDownload(file)}>
        <Download className="h-4 w-4" />
      </button>
      <button type="button" title="Copy download link" className={actionButtonClassName} onClick={() => onCopyLink(file)}>
        <Copy className="h-4 w-4" />
      </button>
      {isOwner(file) && (
        <>
          <button type="button" title="Rename" className={actionButtonClassName} onClick={() => onRename(file)}>
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Delete"
            className={cn(actionButtonClassName, 'hover:text-red-500 dark:hover:text-red-400')}
            onClick={() => onDelete(file)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="search"
            placeholder="Search by file name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white/70 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className={selectClassName} aria-label="Filter by type">
            {fileTypes.map((type) => (
              <option key={type} value={type}>
                {type === 'All' ? 'All types' : type}
              </option>
            ))}
          </select>
          <div className="relative">
            <ArrowDownUp className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <select value={sort} onChange={(event) => setSort(event.target.value as SortKey)} className={cn(selectClassName, 'pl-9')} aria-label="Sort by">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name (A–Z)</option>
              <option value="size">Size (largest)</option>
            </select>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 dark:text-slate-500">
        {filtered.length} {filtered.length === 1 ? 'file' : 'files'}
      </p>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/50 md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200/60 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
              <th className="px-5 py-3.5">File</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Size</th>
              <th className="px-5 py-3.5">Uploaded</th>
              <th className="px-5 py-3.5">Uploaded By</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((file, index) => (
              <motion.tr
                key={file.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                className="group border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/70 dark:border-slate-800/60 dark:hover:bg-slate-800/40"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <FileIcon fileName={file.fileName} />
                    <div className="min-w-0">
                      <p className="max-w-[260px] truncate text-sm font-semibold text-slate-900 dark:text-white">{file.fileName}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{file.originalFileName}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    {file.fileType}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm tabular-nums text-slate-600 dark:text-slate-300">{formatBytes(file.fileSize)}</td>
                <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400">{toDateTimeLabel(file.uploadedAt)}</td>
                <td className="px-5 py-3.5 text-sm text-slate-500 dark:text-slate-400">{file.studentName || '—'}</td>
                <td className="px-5 py-3.5">{actionButtons(file)}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {filtered.map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
            className="rounded-2xl border border-slate-200/60 bg-white/60 p-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/50"
          >
            <div className="flex items-start gap-3">
              <FileIcon fileName={file.fileName} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{file.fileName}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
                  <span className="rounded-full bg-blue-500/10 px-2 py-0.5 font-bold text-blue-600 dark:text-blue-400">{file.fileType}</span>
                  <span className="tabular-nums">{formatBytes(file.fileSize)}</span>
                  <span>{toDisplayDate(file.uploadedAt)}</span>
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-1 border-t border-slate-100 pt-2 dark:border-slate-800">
              {actionButtons(file)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
