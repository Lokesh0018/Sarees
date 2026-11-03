import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { FALLBACK_SETTINGS } from '../config/site'
import { getCategories, getSettings } from '../services/catalog'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [settings, setSettings] = useState(FALLBACK_SETTINGS)
  const [categories, setCategories] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    let alive = true
    Promise.allSettled([getSettings(), getCategories()]).then(([s, c]) => {
      if (!alive) return
      if (s.status === 'fulfilled') setSettings({ ...FALLBACK_SETTINGS, ...s.value })
      if (c.status === 'fulfilled') setCategories(c.value)
      setStatus(c.status === 'fulfilled' ? 'ready' : 'error')
    })
    return () => { alive = false }
  }, [])

  const value = useMemo(() => ({ settings, categories, status }), [settings, categories, status])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
