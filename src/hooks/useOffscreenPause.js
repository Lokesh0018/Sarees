import { useEffect } from 'react'

// Marks every <section> on the page with data-offscreen while it is out of view, which (via index.css) pauses the
// looping CSS animations inside it. JS-driven animations manage their own visibility with IntersectionObserver.
export function useOffscreenPause() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.removeAttribute('data-offscreen')
        else e.target.setAttribute('data-offscreen', '')
      })
    }, { rootMargin: '100px 0px' })
    const sections = document.querySelectorAll('main section, footer')
    sections.forEach((el) => io.observe(el))
    return () => {
      io.disconnect()
      sections.forEach((el) => el.removeAttribute('data-offscreen'))
    }
  }, [])
}
