// src/config/api.js

const PROD_URL = "https://delhi-heritage-api.onrender.com"

// When developing locally use the backend running on port 8000 on the same
// host. In production fall back to `VITE_API_URL` or the PROD_URL.
let API_BASE_URL = import.meta.env.VITE_API_URL || PROD_URL
try {
  if (import.meta.env.DEV) {
    const devHost = `${location.protocol}//${location.hostname}:8000`
    API_BASE_URL = import.meta.env.VITE_API_URL || devHost
  }
} catch (e) {
  // ignore (location may be unavailable in some tooling)
}

export const apiUrl = (path = "/") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

// Known-safe CDN origins that are hotlink-friendly and CORS-enabled.
// Images from these origins bypass the backend proxy entirely —
// fewer network hops, no cold-start penalty, and no rate-limit risk.
const SAFE_IMAGE_ORIGINS = [
  "upload.wikimedia.org",       // Wikimedia Commons — explicitly hotlink-friendly
  "images.unsplash.com",        // Unsplash — open license, CDN-optimized
  "plus.unsplash.com",          // Unsplash premium
  "cdn.mos.cms.futurecdn.net",  // Future CDN (PC Gamer, etc.)
]

// Check if a URL belongs to a known-safe origin
function isSafeOrigin(url) {
  try {
    const parsed = new URL(url)
    return SAFE_IMAGE_ORIGINS.some(origin => parsed.hostname === origin || parsed.hostname.endsWith("." + origin))
  } catch {
    return false
  }
}

// Route remote image hosts through the backend /proxy-image endpoint, which
// sets the Referer header Unsplash requires for hotlinked images and caches
// the response.
//
// Bypass logic (no proxy hop):
//   1. Local assets (start with "/" or "data:")
//   2. Wikimedia Commons images
//   3. Known-safe CDN origins (Unsplash, Future CDN, etc.)
//
// Everything else goes through the proxy (e.g., Wix, Google, custom CDNs
// that block direct hotlinking).
export const proxyImageUrl = (src, fallback = "/assets/placeholder-image.svg") => {
  if (!src) return fallback
  if (src.startsWith("/") || src.startsWith("data:")) return src
  if (src.includes("upload.wikimedia.org")) return src
  if (isSafeOrigin(src)) return src
  return `${apiUrl("/proxy-image")}?url=${encodeURIComponent(src)}`
}

export const apiFetch = async (path, options = {}) => {
  // FIX: was "token", must match what Login.jsx saves as "access_token"
  const token = localStorage.getItem("access_token")

  const res = await fetch(apiUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  })

  // FIX: auto-handle expired / invalid token — clear storage and send to login
  if (res.status === 401) {
    localStorage.removeItem("access_token")
    localStorage.removeItem("currentUser")
    window.location.href = "/login"
  }

  return res
}
