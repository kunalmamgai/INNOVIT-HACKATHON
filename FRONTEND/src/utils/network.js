/**
 * Network-aware loading utilities.
 * Detects slow connections and provides adaptive image quality settings.
 */

// Check if the user is on a slow or data-saver connection
export function isSlowConnection() {
  try {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (!conn) return false

    // Data saver is explicitly on
    if (conn.saveData) return true

    // Effective connection type is slow
    const slowTypes = ['slow-2g', '2g', '3g']
    if (conn.effectiveType && slowTypes.includes(conn.effectiveType)) return true

    // Download speed is very low
    if (conn.downlink && conn.downlink < 1.5) return true

    return false
  } catch {
    return false
  }
}

// Get a reduced image quality factor based on connection
// Returns a number between 0.3 and 1.0
export function getImageQuality() {
  try {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (!conn) return 1.0

    if (conn.saveData) return 0.3
    if (conn.effectiveType === 'slow-2g') return 0.3
    if (conn.effectiveType === '2g') return 0.5
    if (conn.effectiveType === '3g') return 0.7
    if (conn.downlink && conn.downlink < 2) return 0.6

    return 1.0
  } catch {
    return 1.0
  }
}

// Check if the browser supports modern image formats
export function supportsWebP() {
  try {
    const canvas = document.createElement('canvas')
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  } catch {
    return false
  }
}

export function supportsAVIF() {
  try {
    const canvas = document.createElement('canvas')
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
  } catch {
    return false
  }
}
