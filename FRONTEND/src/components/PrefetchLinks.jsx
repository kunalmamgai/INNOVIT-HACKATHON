import { useEffect } from 'react'

// Map of routes to their JS chunk filenames (Vite-generated).
// These are the most common navigation targets from the Navbar.
// The actual chunk names are stable hashes — update after build if they change.
const ROUTE_CHUNKS = {
  '/heritage':          () => import('../pages/Heritage'),
  '/festivals':         () => import('../pages/Festivals'),
  '/arts':              () => import('../pages/ArtCrafts'),
  '/explore':           () => import('../pages/Explore'),
  '/virtual-tour':      () => import('../pages/VirtualTour'),
  '/ar-vr-tour':        () => import('../pages/AR-Chaelogist'),
  '/headset':           () => import('../pages/Headset'),
  '/about':             () => import('../pages/About'),
  '/contact':           () => import('../pages/Contact'),
  '/login':             () => import('../pages/Login'),
}

// Routes to prefetch immediately after page load (highest-traffic destinations)
const EAGER_PREFETCH = ['/heritage', '/explore', '/festivals', '/virtual-tour']

// Routes to prefetch on hover (user intent signals)
const HOVER_PREFETCH = ['/arts', '/ar-vr-tour', '/headset', '/about', '/contact', '/login']

/**
 * PrefetchLinks — eagerly prefetches route chunks for instant navigation.
 *
 * Strategy:
 * 1. After page load: prefetch the 4 most common routes
 * 2. On hover over nav links: prefetch remaining routes
 * 3. Uses dynamic import() so chunks are fetched in background, not blocking
 */
export default function PrefetchLinks() {
  useEffect(() => {
    // Prefetch high-priority routes after a short delay (don't block initial paint)
    const timer = setTimeout(() => {
      EAGER_PREFETCH.forEach(route => {
        const loader = ROUTE_CHUNKS[route]
        if (loader) {
          // Fire-and-forget — the import will cache the chunk in the browser
          loader().catch(() => {})
        }
      })
    }, 2000) // Wait 2s after page load to avoid competing with critical resources

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Add hover-based prefetching to all nav links
    const navLinks = document.querySelectorAll('nav a[href^="/"]')
    const cleanupFns = []

    navLinks.forEach(link => {
      const route = link.getAttribute('href')
      if (!HOVER_PREFETCH.includes(route)) return

      const loader = ROUTE_CHUNKS[route]
      if (!loader) return

      let prefetched = false

      const handleEnter = () => {
        if (prefetched) return
        prefetched = true
        loader().catch(() => {})
      }

      link.addEventListener('mouseenter', handleEnter)
      link.addEventListener('focus', handleEnter)

      cleanupFns.push(() => {
        link.removeEventListener('mouseenter', handleEnter)
        link.removeEventListener('focus', handleEnter)
      })
    })

    return () => cleanupFns.forEach(fn => fn())
  }, [])

  return null // This component renders nothing
}
