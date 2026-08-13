import type { ReactNode } from 'react'

interface TooltipEntry {
  name?: string
  value?: number | string
  color?: string
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string | number
  formatter?: (value: number | string, name: string) => ReactNode
}

export default function ChartTooltip({ active, payload, label, formatter }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-xl border border-slate-200/70 bg-white/95 px-3.5 py-2.5 shadow-xl shadow-slate-950/10 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95">
      {label !== undefined && (
        <p className="mb-1.5 text-xs font-semibold text-slate-900 dark:text-white">{label}</p>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-500 dark:text-slate-400">{entry.name}</span>
            <span className="ml-auto font-bold tabular-nums text-slate-900 dark:text-white">
              {formatter ? formatter(entry.value ?? 0, entry.name ?? '') : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
