import React, { lazy, useState, useEffect, Suspense } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useStore } from './store/useStore'
import ErrorBoundary from './components/ErrorBoundary'
import PrefetchLinks from './components/PrefetchLinks'
import './styles/main.css'

const Navbar = lazy(() => import('./components/Navbar'))
const Footer = lazy(() => import('./components/Footer'))
const ChatBot = lazy(() => import('./components/ChatBot'))

const Home = lazy(() => import('./pages/Home'))
const Heritage = lazy(() => import('./pages/Heritage'))
const Festivals = lazy(() => import('./pages/Festivals'))
const ArtCrafts = lazy(() => import('./pages/ArtCrafts'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Explore = lazy(() => import('./pages/Explore'))
const VirtualTour = lazy(() => import('./pages/VirtualTour'))
const ARChaelogist = lazy(() => import('./pages/AR-Chaelogist'))
const TourismEventCoPublishing = lazy(() => import('./pages/TourismEventCoPublishing'))
const Headset = lazy(() => import('./pages/Headset'))
const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()
  const dark = useStore(state => state.dark)

  useEffect(() => {
    // Restore logged-in user from localStorage on mount
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('currentUser')
      }
    }

    // Load dark mode preference
    useStore.getState().loadPrefs()

    // FIX: Listen for login event fired by Login.jsx so Navbar updates immediately
    const handler = (e) => {
      try {
        const user = e?.detail ?? null
        if (user) setCurrentUser(user)
      } catch { /* ignore */ }
    }
    window.addEventListener('user-logged-in', handler)
    return () => window.removeEventListener('user-logged-in', handler)
  }, [])

  // Apply dark mode class to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const handleLogout = () => {
    // FIX: clear BOTH keys that Login.jsx sets
    localStorage.removeItem('currentUser')
    localStorage.removeItem('access_token')
    setCurrentUser(null)
    navigate('/')
  }

  const navFallback = <div className="h-16 bg-white dark:bg-gray-900" />
  const pageFallback = <div className="flex items-center justify-center min-h-[40vh] text-gold text-xl">Loading...</div>

  return (
    <div className="min-h-screen flex flex-col motif">
      <Helmet>
        <title>AR-Chaelogist</title>
      </Helmet>
      <PrefetchLinks />
      <ErrorBoundary>
        <Suspense fallback={navFallback}>
          <Navbar currentUser={currentUser} onLogout={handleLogout} />
        </Suspense>
      </ErrorBoundary>
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={pageFallback}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/heritage" element={<Heritage />} />
              <Route path="/festivals" element={<Festivals />} />
              <Route path="/arts" element={<ArtCrafts />} />
              <Route path="/virtual-tour" element={<VirtualTour />} />
              <Route path="/ar-vr-tour" element={<ARChaelogist />} />
              <Route path="/tourism-event-co-publishing" element={<TourismEventCoPublishing />} />
              <Route path="/headset" element={<Headset />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              {/* Pass currentUser so Explore can use it without re-reading localStorage */}
              <Route path="/explore" element={<Explore currentUser={currentUser} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <ErrorBoundary>
        <Suspense fallback={null}>
          <Footer />
          <ChatBot />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
