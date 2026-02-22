// src/config/api.js

const PROD_URL = "https://delhi-heritage-api.onrender.com"

// When developing locally use the backend running on port 8000 on the same
// host. In production fall back to `VITE_API_URL` or the PROD_URL.
let API_BASE_URL = import.meta.env.VITE_API_URL || PROD_URL
try {
  if (import.meta.env.DEV) {
    // build a dev backend base like "http://localhost:8000" using the current
    // page's protocol/host so the proxy points to the developer's local server.
    const devHost = `${location.protocol}//${location.hostname}:8000`
    API_BASE_URL = import.meta.env.VITE_API_URL || devHost
  }
} catch (e) {
  // ignore (location may be unavailable in some tooling)
}

export const apiUrl = (path = "/") => {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`

  return `${API_BASE_URL}${normalizedPath}`
}

export const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem("token")

  return fetch(apiUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {})
    }
  })
}
