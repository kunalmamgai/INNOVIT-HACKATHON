export const API_BASE_URL = 'https://delhi-heritage-api.onrender.com'

export const apiUrl = (path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}