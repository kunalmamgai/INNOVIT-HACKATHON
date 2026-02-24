import React, { lazy, useState, useEffect, Suspense } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useStore } from './store/useStore'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'
import './styles/main.css'

const Home = lazy(() => import('./pages/Home'))
const Heritage = lazy(() => import('./pages/Heritage'))
const Festivals = lazy(() => import('./pages/Festivals'))
const ArtCrafts = lazy(() => import('./pages/ArtCrafts'))
const Cuisine = lazy(() => import('./pages/Cuisine'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Explore = lazy(() => import('./pages/Explore'))
const VirtualTour = lazy(() => import('./pages/VirtualTour'))
const TourismEventCoPublishing = lazy(() => import('./pages/TourismEventCoPublishing'))
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

  return (
    <div className="min-h-screen flex flex-col motif">
      <Helmet>
        <title>Heritage & Culture Portal</title>
      </Helmet>
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      <main className="flex-1">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[40vh] text-gold text-xl">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/heritage" element={<Heritage />} />
            <Route path="/festivals" element={<Festivals />} />
            <Route path="/arts" element={<ArtCrafts />} />
            <Route path="/cuisine" element={<Cuisine />} />
            <Route path="/community" element={<VirtualTour />} />
            <Route path="/virtual-tour" element={<VirtualTour />} />
            <Route path="/tourism-event-co-publishing" element={<TourismEventCoPublishing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* Pass currentUser so Explore can use it without re-reading localStorage */}
            <Route path="/explore" element={<Explore currentUser={currentUser} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
}