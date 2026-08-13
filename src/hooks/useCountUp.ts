import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface UseCountUpOptions {
  duration?: number
  decimals?: number
}

export function useCountUp(target: number, { duration = 1.6, decimals = 0 }: UseCountUpOptions = {}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf: number
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Number((target * eased).toFixed(decimals)))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target, duration, decimals])

  return { ref, value }
}
