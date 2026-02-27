import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Footer(){
  return (
    <footer className="bg-gradient-to-r from-earth via-gray-800 to-earth text-white border-t-2 border-gold mt-12 py-8 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="text-gold font-bold text-lg mb-2 drop-shadow">Heritage Portal</h3>
            <p className="text-gray-200 text-sm">Preserving and celebrating cultural heritage.</p>
          </div>
          <div>
            <h3 className="text-gold font-bold text-lg mb-3 drop-shadow">Explore</h3>
            <ul className="space-y-1 text-sm">
              <li><NavLink to="/heritage" className="text-gray-200 hover:text-gold transition-colors">Heritage Sites</NavLink></li>
              <li><NavLink to="/virtual-tour" className="text-gray-200 hover:text-gold transition-colors">Virtual Tour</NavLink></li>
              <li><NavLink to="/ar-vr-tour" className="text-gray-200 hover:text-gold transition-colors">AR/VR Tour</NavLink></li>
              <li><NavLink to="/explore" className="text-gray-200 hover:text-gold transition-colors">Explore</NavLink></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gold font-bold text-lg mb-3 drop-shadow">Navigate</h3>
            <ul className="space-y-1 text-sm">
              <li><NavLink to="/" className="text-gray-200 hover:text-gold transition-colors">Home</NavLink></li>
              <li><NavLink to="/about" className="text-gray-200 hover:text-gold transition-colors">About</NavLink></li>
              <li><NavLink to="/contact" className="text-gray-200 hover:text-gold transition-colors">Contact</NavLink></li>
              <li><NavLink to="/login" className="text-gray-200 hover:text-gold transition-colors">Login</NavLink></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gold/30 pt-4 text-center text-gray-300 text-sm">
          <p>&copy; {new Date().getFullYear()} Heritage & Culture Portal — Built for preservation and education.</p>
        </div>
      </div>
    </footer>
  )
}
