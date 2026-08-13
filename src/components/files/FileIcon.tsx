import {
  File,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  Presentation,
} from 'lucide-react'
import { getFileTypeInfo } from '@/lib/fileUtils'
import { cn } from '@/lib/utils'

interface FileIconProps {
  fileName: string
  className?: string
}

export default function FileIcon({ fileName, className }: FileIconProps) {
  const info = getFileTypeInfo(fileName)

  const Icon = {
    image: FileImage,
    pdf: FileText,
    document: FileText,
    sheet: FileSpreadsheet,
    presentation: Presentation,
    archive: FileArchive,
    text: FileText,
    other: File,
  }[info.category]

  return (
    <div
      className={cn(
        'relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg',
        info.gradient,
        className
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="absolute -bottom-1 -right-1 rounded border border-white/60 bg-slate-950/90 px-1 text-[8px] font-bold text-white">
        {info.label}
      </span>
    </div>
  )
}
