import { useState, useCallback } from 'react'

export function usePasswordVisibility() {
  const [visible, setVisible] = useState(false)
  const toggle = useCallback(() => setVisible(prev => !prev), [])
  return { visible, toggle, type: visible ? 'text' as const : 'password' as const }
}

export function usePasswordStrength() {
  const [strength, setStrength] = useState(0)

  const evaluate = useCallback((password: string) => {
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    setStrength(score)
    return score
  }, [])

  const getLabel = useCallback(() => {
    if (strength <= 2) return 'Weak'
    if (strength <= 4) return 'Fair'
    if (strength <= 5) return 'Strong'
    return 'Very Strong'
  }, [strength])

  const getColor = useCallback(() => {
    if (strength <= 2) return 'bg-red-500'
    if (strength <= 4) return 'bg-yellow-500'
    if (strength <= 5) return 'bg-blue-500'
    return 'bg-green-500'
  }, [strength])

  const getPercent = useCallback(() => {
    return Math.min((strength / 6) * 100, 100)
  }, [strength])

  return { strength, evaluate, getLabel, getColor, getPercent }
}
