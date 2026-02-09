import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import Modal from '../shared/Modal'
import { motion } from 'framer-motion'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/assets/marker-icon-2x.png',
  iconUrl: '/assets/marker-icon.png',
  shadowUrl: '/assets/marker-shadow.png'
})

// Create image icon using Leaflet L.icon (more reliable than divIcon for external images)
const createImageIcon = (imageUrl) => {
  return L.icon({
    iconUrl: imageUrl,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
    className: 'rounded-full border-gold',
  })
}

export default function Heritage(){
  const [selected, setSelected] = useState(null)
  const [places, setPlaces] = useState([])
  const [icons, setIcons] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showList, setShowList] = useState(false)
  const center = [28.6139, 77.2090] // Delhi center

  useEffect(() => {
    fetchPlaces()
  }, [])

  // Build Leaflet icons for each place after places load
  useEffect(() => {
    let active = true
    const objectUrls = []

    const buildIcons = async () => {
      const map = {}
      await Promise.all(
        places.map(async (site, idx) => {
          const name = site.name || site.title || 'monument'
          // Always use local asset if path starts with /assets/
          const imageUrl = (site.image && site.image.startsWith('/assets/'))
            ? site.image
            : (site.image || `https://source.unsplash.com/80x80/?${name.split(' ').join('%20')}`)
          try {
            const resp = await fetch(imageUrl, { mode: 'cors' })
            if (!resp.ok) throw new Error('fetch failed')
            const blob = await resp.blob()
            const objUrl = URL.createObjectURL(blob)
            objectUrls.push(objUrl)
            map[site.id || idx] = L.icon({ iconUrl: objUrl, iconSize: [50, 50], iconAnchor: [25, 50], popupAnchor: [0, -50] })
          } catch (err) {
            map[site.id || idx] = undefined
          }
        })
      )
      if (active) setIcons(map)
    }

    if (places && places.length) buildIcons()

    return () => {
      active = false
      objectUrls.forEach(u => URL.revokeObjectURL(u))
    }
  }, [places])

  const fetchPlaces = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/places')
      if (!response.ok) throw new Error('Failed to fetch places')
      const data = await response.json()
      setPlaces(Array.isArray(data) ? data : Object.values(data))
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching places:', err)
    } finally {
      setLoading(false)
    }
  }

  const validPlaces = places.filter(site => 
    (site.lat || site.latitude) && (site.lon || site.longitude)
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">🏛️ Heritage Monuments Map</h1>
          <p className="text-gray-400">Explore {validPlaces.length} historic monuments across Delhi</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={fetchPlaces}
            className="bg-gold text-gray-800 px-4 py-2 rounded font-medium hover:bg-gold/90 transition"
          >
            🔄 Refresh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setShowList(!showList)}
            className="bg-gold text-gray-800 px-4 py-2 rounded font-medium hover:bg-gold/90 transition"
          >
            📋 {showList ? 'Hide' : 'Show'} List
          </motion.button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="h-[60vh] rounded overflow-hidden shadow flex items-center justify-center bg-gray-800">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
                <p className="text-white">Loading live heritage monuments...</p>
              </div>
            </div>
          ) : (
            <div className="h-[60vh] rounded overflow-hidden shadow">
              <MapContainer center={center} zoom={11} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {validPlaces.map((site, idx) => {
                  const lat = site.lat || site.latitude
                  const lng = site.lon || site.longitude
                  const name = site.name || site.title
                  const image = site.image || `https://source.unsplash.com/80x80/?${(name || 'monument').split(' ').join('%20')}`
                  const iconFor = icons[site.id || idx] || createImageIcon(image)

                  return (
                    <Marker
                      key={site.id || idx}
                      position={[lat, lng]}
                      icon={iconFor}
                      eventHandlers={{ click: () => setSelected(site) }}
                    >
                      <Popup className="custom-popup">{name}</Popup>
                    </Marker>
                  )
                })}
              </MapContainer>
            </div>
          )}
        </div>

        {/* Monument List Sidebar */}
        {showList && (
          <div className="lg:col-span-1 bg-gray-800 rounded-lg p-4 h-[60vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gold mb-4">All Monuments</h3>
            <div className="space-y-2">
              {validPlaces.map((site, idx) => (
                <motion.button
                  key={site.id || idx}
                  whileHover={{ x: 5 }}
                  onClick={() => setSelected(site)}
                  className="w-full text-left p-3 bg-gray-700 hover:bg-gold/20 rounded transition border-l-4 border-gold"
                >
                  <p className="text-gold font-bold text-sm">{site.name || site.title}</p>
                  <p className="text-gray-400 text-xs mt-1">{site.category || 'Monument'}</p>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Monument Details Modal */}
      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div className="bg-gradient-to-b from-gray-900 to-black text-white">
            {/* Image */}
            <div className="mb-6">
              <img 
                src={(selected.image && selected.image.startsWith('/assets/'))
                  ? selected.image
                  : (selected.image || `https://source.unsplash.com/800x600/?${(selected.name || selected.title).split(' ').join('%20')}`)}
                alt={selected.name}
                className="w-full h-80 object-cover rounded-lg shadow-xl"
              />
            </div>

            {/* Title and Category */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gold mb-2">{selected.name || selected.title}</h2>
              <p className="text-gray-400">{selected.category || 'Historic Monument'}</p>
              <div className="h-1 w-20 bg-gold mt-3 rounded"></div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gold mb-2">About</h3>
              <p className="text-gray-300 leading-relaxed">
                {selected.description || selected.desc || 'No description available'}
              </p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {selected.year_built && (
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                  <p className="text-gold font-bold text-sm">📅 Built</p>
                  <p className="text-gray-300">{selected.year_built}</p>
                </div>
              )}
              {selected.architect && (
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                  <p className="text-gold font-bold text-sm">👨‍🏫 Architect</p>
                  <p className="text-gray-300">{selected.architect}</p>
                </div>
              )}
              {selected.height && (
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                  <p className="text-gold font-bold text-sm">📏 Height</p>
                  <p className="text-gray-300">{selected.height}</p>
                </div>
              )}
              {selected.cluster && (
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                  <p className="text-gold font-bold text-sm">📍 Cluster</p>
                  <p className="text-gray-300">{selected.cluster}</p>
                </div>
              )}
            </div>

            {/* Coordinates */}
            {(selected.lat || selected.latitude) && (selected.lon || selected.longitude) && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                  <p className="text-gold font-bold text-sm">🧭 Latitude</p>
                  <p className="text-gray-300 text-sm">{(selected.lat || selected.latitude).toFixed(4)}</p>
                </div>
                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                  <p className="text-gold font-bold text-sm">🌐 Longitude</p>
                  <p className="text-gray-300 text-sm">{(selected.lon || selected.longitude).toFixed(4)}</p>
                </div>
              </div>
            )}

            {/* Tags */}
            {selected.tags && selected.tags.length > 0 && (
              <div className="mb-4">
                <p className="text-gold font-bold text-sm mb-2">🏷️ Tags</p>
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gold/20 text-gold px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Timings */}
            {selected.timings && (
              <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                <p className="text-gold font-bold text-sm">⏰ Timings</p>
                <p className="text-gray-300 text-sm">{selected.timings}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
