import React, { lazy, useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useStore } from './store/useStore'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'
import { apiUrl } from './config/api'
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
const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const dark = useStore(state => state.dark);

  useEffect(() => {
    fetch(apiUrl('/places'))
      .then((res) => res.json())
      .then((data) => {
        console.log("PLACES FROM BACKEND:", data);
      })
      .catch((err) => {
        console.error("FETCH ERROR:", err);
      });

    // Check if user is already logged in
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // Load dark mode preferences
    useStore.getState().loadPrefs();

    // Listen for login events from the Login page so currentUser updates immediately
    const handler = (e) => {
      try {
        const user = e && e.detail ? e.detail : null;
        if (user) setCurrentUser(user);
      } catch (err) { /* ignore */ }
    };
    window.addEventListener('user-logged-in', handler);

    return () => {
      window.removeEventListener('user-logged-in', handler);
    };
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col motif">
      <Helmet>
        <title>Heritage & Culture Portal</title>
      </Helmet>
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/heritage" element={<Heritage />} />
          <Route path="/festivals" element={<Festivals />} />
          <Route path="/arts" element={<ArtCrafts />} />
          <Route path="/cuisine" element={<Cuisine />} />
          <Route path="/community" element={<VirtualTour />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/explore" element={<Explore currentUser={currentUser} />} />
          <Route path="/virtual-tour" element={<VirtualTour />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ChatBot />
    </div>
  )
}
