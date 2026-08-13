export type FileCategory =
  | 'image'
  | 'pdf'
  | 'document'
  | 'sheet'
  | 'presentation'
  | 'archive'
  | 'text'
  | 'other'

export interface FileTypeInfo {
  category: FileCategory
  label: string
  gradient: string
  text: string
}

export const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'zip', 'jpg', 'jpeg', 'png']

export const MAX_FILE_SIZE = 25 * 1024 * 1024

export const ACCEPT_ATTRIBUTE = ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(',')

export function getExtension(fileName: string): string {
  const parts = fileName.split('.')
  return parts.length > 1 ? (parts.pop()?.toLowerCase() ?? '') : ''
}

export function isFileAllowed(fileName: string): boolean {
  return ALLOWED_EXTENSIONS.includes(getExtension(fileName))
}

export function getFileTypeInfo(fileName: string): FileTypeInfo {
  const ext = getExtension(fileName)
  switch (ext) {
    case 'pdf':
      return { category: 'pdf', label: 'PDF', gradient: 'from-red-500 to-rose-600', text: 'text-red-500 dark:text-red-400' }
    case 'doc':
    case 'docx':
      return { category: 'document', label: 'DOC', gradient: 'from-blue-500 to-indigo-600', text: 'text-blue-500 dark:text-blue-400' }
    case 'ppt':
    case 'pptx':
      return { category: 'presentation', label: 'PPT', gradient: 'from-orange-500 to-amber-600', text: 'text-orange-500 dark:text-orange-400' }
    case 'xls':
    case 'xlsx':
      return { category: 'sheet', label: 'XLS', gradient: 'from-emerald-500 to-green-600', text: 'text-emerald-500 dark:text-emerald-400' }
    case 'txt':
      return { category: 'text', label: 'TXT', gradient: 'from-slate-500 to-slate-600', text: 'text-slate-400 dark:text-slate-400' }
    case 'zip':
      return { category: 'archive', label: 'ZIP', gradient: 'from-yellow-500 to-amber-600', text: 'text-yellow-500 dark:text-yellow-400' }
    case 'jpg':
    case 'jpeg':
      return { category: 'image', label: 'JPG', gradient: 'from-fuchsia-500 to-pink-600', text: 'text-fuchsia-500 dark:text-fuchsia-400' }
    case 'png':
      return { category: 'image', label: 'PNG', gradient: 'from-fuchsia-500 to-pink-600', text: 'text-fuchsia-500 dark:text-fuchsia-400' }
    default:
      return { category: 'other', label: (ext || 'FILE').toUpperCase(), gradient: 'from-slate-500 to-slate-700', text: 'text-slate-400 dark:text-slate-400' }
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}

export function toDisplayDate(value: unknown): string {
  if (!value) return '—'
  const date =
    typeof value === 'object' && value !== null && 'toDate' in value
      ? (value as { toDate: () => Date }).toDate()
      : new Date(value as string | number | Date)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function toDateTimeLabel(value: unknown): string {
  if (!value) return '—'
  const date =
    typeof value === 'object' && value !== null && 'toDate' in value
      ? (value as { toDate: () => Date }).toDate()
      : new Date(value as string | number | Date)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' · ' +
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
