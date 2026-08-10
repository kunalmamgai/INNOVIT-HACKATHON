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

// Route remote image hosts through the backend /proxy-image endpoint, which
// sets the Referer header Unsplash requires for hotlinked images and caches
// the response. Local assets, data: URIs, and Wikimedia Commons images pass
// through unchanged — Wikimedia is hotlink-friendly and CORS-enabled, so
// proxying it would only add a hop and risk rate-limit bursts.
export const proxyImageUrl = (src, fallback = "/assets/placeholder-image.svg") => {
  if (!src) return fallback
  if (src.startsWith("/") || src.startsWith("data:") || src.includes("upload.wikimedia.org")) return src
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
