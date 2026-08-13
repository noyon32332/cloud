import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, CloudUpload, Loader2, XCircle } from 'lucide-react'
import { ACCEPT_ATTRIBUTE, formatBytes, isFileAllowed, MAX_FILE_SIZE } from '@/lib/fileUtils'
import FileIcon from '@/components/files/FileIcon'
import { cn } from '@/lib/utils'

export interface UploadItem {
  id: string
  name: string
  size: number
  progress: number
  status: 'uploading' | 'done' | 'error'
}

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void
  uploads: UploadItem[]
}

export default function FileUploadZone({ onFilesSelected, uploads }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const accepted: File[] = []
    for (const file of Array.from(files)) {
      const allowed = isFileAllowed(file.name)
      const withinSize = file.size <= MAX_FILE_SIZE
      if (allowed && withinSize) {
        accepted.push(file)
      }
    }
    onFilesSelected(accepted)
  }

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <motion.div
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          handleFiles(event.dataTransfer.files)
        }}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? 'rgba(59, 130, 246, 0.6)' : undefined,
        }}
        className={cn(
          'group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center transition-colors dark:border-slate-700 dark:bg-slate-900/40',
          isDragging && 'border-blue-500 bg-blue-500/5 dark:border-blue-500'
        )}
        onClick={() => inputRef.current?.click()}
      >
        <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl transition-opacity group-hover:opacity-100" />
        <motion.div
          animate={{ y: isDragging ? -6 : 0 }}
          className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
        >
          <CloudUpload className="h-7 w-7" />
        </motion.div>
        <h4 className="relative mt-4 text-base font-bold text-slate-900 dark:text-white">
          {isDragging ? 'Drop your files here' : 'Drag & drop your files'}
        </h4>
        <p className="relative mt-1 text-sm text-slate-500 dark:text-slate-400">
          or <span className="font-semibold text-blue-600 dark:text-blue-400">browse files</span> from your computer
        </p>
        <p className="relative mt-3 text-[11px] text-slate-400 dark:text-slate-500">
          PDF · DOC/DOCX · PPT/PPTX · XLS/XLSX · TXT · ZIP · JPG · PNG &nbsp;—&nbsp; max {Math.round(MAX_FILE_SIZE / (1024 * 1024))} MB
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT_ATTRIBUTE}
          className="hidden"
          onChange={(event) => {
            handleFiles(event.target.files)
            event.target.value = ''
          }}
        />
      </motion.div>

      {/* Upload progress */}
      <AnimatePresence>
        {uploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            {uploads.map((upload) => (
              <motion.div
                key={upload.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/60 p-3 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <FileIcon fileName={upload.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{upload.name}</p>
                    {upload.status === 'uploading' && (
                      <span className="shrink-0 text-xs font-semibold tabular-nums text-blue-500 dark:text-blue-400">
                        {upload.progress}%
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{formatBytes(upload.size)}</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    {upload.status === 'error' ? (
                      <div className="h-full w-full rounded-full bg-red-500" />
                    ) : (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${upload.progress}%` }}
                        transition={{ ease: 'easeOut', duration: 0.3 }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      />
                    )}
                  </div>
                </div>
                <div className="shrink-0">
                  {upload.status === 'uploading' && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
                  {upload.status === 'done' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                  {upload.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
