import { useEffect, useState } from 'react'

// Runs an async loader whenever deps change; ignores results from stale runs.
export function useAsync(loader, deps) {
  const [state, setState] = useState({ data: undefined, error: null, loading: true })
  useEffect(() => {
    let alive = true
    setState((s) => ({ ...s, loading: true, error: null }))
    loader()
      .then((data) => alive && setState({ data, error: null, loading: false }))
      .catch((error) => alive && setState({ data: undefined, error, loading: false }))
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return state
}
