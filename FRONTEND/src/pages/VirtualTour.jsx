import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { apiUrl } from '../config/api'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function VirtualTour() {
  const query = useQuery()
  const initialPlaceName = query.get('place') || ''
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isTourActive, setIsTourActive] = useState(false)
  const [tourMode, setTourMode] = useState('vr')

  const [panoramaLoaded, setPanoramaLoaded] = useState(false)
  const [isPanorama, setIsPanorama] = useState(false)
  const [forceShow, setForceShow] = useState(false)
  const [imageStatus, setImageStatus] = useState('idle') // 'idle' | 'loading' | 'ok' | 'error'
  const [imageError, setImageError] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await fetch(apiUrl('/places'))
        const data = await res.json()
        const list = Array.isArray(data) ? data : Object.values(data)
        if (!mounted) return
        setPlaces(list)
        if (initialPlaceName) {
          const idx = list.findIndex(p => (p.name || '').toLowerCase() === initialPlaceName.toLowerCase())
          setSelectedIndex(idx >= 0 ? idx : 0)
        }
      } catch (err) {
        setError('Failed to load places from API')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [initialPlaceName])

  const selected = places[selectedIndex]
  // Prefer a true equirectangular `panorama` URL if the place provides one.
  // Fallback to `image` (regular photo) if no panorama is available.
  const src = selected && (selected.panorama || selected.image) ? (selected.panorama || selected.image) : '/assets/panorama-placeholder.jpg'
  const proxiedImg = src && src.startsWith('/')
    ? src
    : src
      ? `${apiUrl('/proxy-image')}?url=${encodeURIComponent(src)}`
      : '/assets/panorama-placeholder.jpg'

  // preload image + aframe
  useEffect(() => {
    setPanoramaLoaded(false)
    setIsPanorama(false)
    if (!selected || !selected.image) return

    let mounted = true
    setImageStatus('loading')
    setImageError(null)
    const imgObj = new Image()
    imgObj.crossOrigin = 'anonymous'
    imgObj.src = proxiedImg
    imgObj.onload = () => {
      if (!mounted) return
      // mark image loaded and detect if it's a panorama by aspect ratio
      try {
        const w = imgObj.naturalWidth || imgObj.width || 0
        const h = imgObj.naturalHeight || imgObj.height || 1
        // heuristic: treat as panorama if width/height >= 2
        setIsPanorama((w / h) >= 2)
      } catch (e) {
        setIsPanorama(false)
      }
      setPanoramaLoaded(true)
      setImageStatus('ok')
      setImageError(null)
    }
    imgObj.onerror = (e) => {
      if (!mounted) return
      setPanoramaLoaded(false)
      setImageStatus('error')
      try { setImageError(String(e?.message || 'load error')) } catch { setImageError('load error') }
    }

    return () => {
      mounted = false
      imgObj.onload = null
      imgObj.onerror = null
    }

    try {
      if (!document.querySelector('link[data-aframe-preload]')) {
        const l = document.createElement('link')
        l.rel = 'preload'
        l.as = 'script'
        l.href = 'https://aframe.io/releases/1.4.2/aframe.min.js'
        l.setAttribute('data-aframe-preload', '1')
        document.head.appendChild(l)
      }
    } catch (e) {}

    return () => {
      imgObj.onload = null
      imgObj.onerror = null
      try { if (window.__vt_cleanup) { window.__vt_cleanup(); delete window.__vt_cleanup } } catch (e) {}
    }
  }, [selectedIndex, selected])

  useEffect(() => {
    if (panoramaLoaded) {
      try { if (window.__vt_cleanup) { window.__vt_cleanup(); delete window.__vt_cleanup } } catch (e) {}
      setForceShow(false)
    }
  }, [panoramaLoaded])

  const startTour = (mode = 'vr') => {
    setTourMode(mode)
    setIsTourActive(true)
    setForceShow(false)
    const t = setTimeout(() => setForceShow(true), 6000)
    window.__vt_cleanup = () => clearTimeout(t)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Virtual Tour</h1>
          <div className="flex gap-2">
            <button onClick={() => startTour('vr')} className="px-3 py-1 rounded bg-gold text-gray-900">▶️ Start VR Tour</button>
            <button onClick={() => startTour('ar')} className="px-3 py-1 rounded bg-gray-700 text-white">Start AR Tour</button>
            <Link to="/heritage" className="px-3 py-1 rounded bg-gray-700">← Back to Map</Link>
          </div>
        </div>

        {loading && <div>Loading monuments...</div>}
        {error && <div className="text-red-400">{error}</div>}

        {!loading && places.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 bg-gray-900 rounded p-3 h-[70vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gold mb-3">Monuments</h3>
              <div className="space-y-2">
                {places.map((p, idx) => (
                  <button
                    key={p.id || idx}
                    onClick={() => { setSelectedIndex(idx); setIsTourActive(false) }}
                    className={`w-full text-left p-3 rounded transition border-l-4 ${selectedIndex === idx ? 'border-gold bg-gold/10' : 'border-transparent hover:bg-gray-800'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-gold">{p.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{p.category || 'Monument'}</div>
                      </div>
                      <div className="text-xs text-gray-400">▶</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="bg-gradient-to-b from-gray-900 to-black p-4 rounded">
                  <div className="flex items-start gap-6">
                  <img src={proxiedImg} alt={selected?.name} className="w-48 h-32 object-cover rounded shadow-md" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gold">{selected?.name}</h2>
                    <p className="text-gray-300 mt-2">{selected?.description}</p>
                    <div className="mt-4 flex gap-3">
                      <button onClick={() => startTour('vr')} className="px-4 py-2 bg-gold text-gray-900 rounded font-medium">▶️ Start VR Tour</button>
                      <button onClick={() => startTour('ar')} className="px-4 py-2 bg-gray-700 text-white rounded">Start AR Tour</button>
                      <Link to={`/heritage`} className="px-4 py-2 bg-gray-700 text-white rounded">View on Map</Link>
                    </div>
                  </div>
                </div>
                  <div className="mt-3 text-sm text-gray-400">
                    Image status: <span className={imageStatus === 'ok' ? 'text-green-400' : imageStatus === 'loading' ? 'text-yellow-300' : 'text-red-400'}>{imageStatus}</span>
                    {imageError && <span className="ml-3 text-xs text-red-300">{imageError}</span>}
                  </div>

                <div className="mt-6">
                  {isTourActive ? (
                    // Always load the A-Frame iframe when the tour is started so users
                    // can view images in the immersive viewer even if they aren't
                    // true equirectangular panoramas. Show a small notice when the
                    // image is likely not a panorama.
                    <div className="w-full h-[60vh] bg-black rounded overflow-hidden relative">
                      {(!panoramaLoaded && !forceShow) && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
                            <div className="text-gray-200">Preparing virtual tour…</div>
                          </div>
                        </div>
                      )}

                      <iframe
                        title="aframe-scene"
                        // pass the original image URL (not already proxied) so the
                        // viewer can try direct load and only then ask the backend
                        // proxy. Also pass the backend proxy base so the iframe can
                        // call it directly (avoids double-proxying issues).
                        src={`/aframe-viewer.html?img=${encodeURIComponent(src)}&proxy=${encodeURIComponent(apiUrl('/proxy-image'))}&title=${encodeURIComponent(selected?.name||'')}&mode=${encodeURIComponent(tourMode)}`}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                      />

                      {/* hint removed by request */}

                      {/* fallback: if A-Frame didn't load within timeout, show the proxied image so user sees something */}
                      {(!panoramaLoaded && forceShow) && (
                        <div className="w-full h-[60vh] bg-black rounded overflow-hidden flex items-center justify-center">
                          <img src={selected?.image || proxiedImg} alt={selected?.name} className="max-h-[60vh] w-auto object-contain" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-[60vh] rounded bg-gray-900 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-gray-400 mb-3">Choose "Start VR Tour" or "Start AR Tour" to load the immersive viewer for this monument.</p>
                        <div className="flex gap-3 justify-center">
                          <button onClick={() => startTour('vr')} className="px-4 py-2 bg-gold text-gray-900 rounded">Start VR Tour</button>
                          <button onClick={() => startTour('ar')} className="px-4 py-2 bg-gray-700 text-white rounded">Start AR Tour</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

