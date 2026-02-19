// src/config/api.js

const PROD_URL = "https://delhi-heritage-api.onrender.com"

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || PROD_URL

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
