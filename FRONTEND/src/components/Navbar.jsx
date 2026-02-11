import React from 'react'
import { NavLink } from 'react-router-dom'
 
import DarkModeToggle from './DarkModeToggle'

export default function Navbar({ currentUser, onLogout }){
  return (
    <header className="sticky top-0 z-40">
      <div className="bg-white dark:bg-gradient-to-r dark:from-[#0b1220] dark:via-[#102030] dark:to-[#0b1220] border-b border-gray-200 dark:border-gold/20 dark:backdrop-blur shadow-sm dark:shadow-none transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-4 no-underline hover:opacity-90 transition-opacity">
            <div className="w-16 h-20 flex-shrink-0 bg-gradient-to-br from-gold/10 to-gold/5 dark:from-gold/10 dark:to-gold/5 rounded-lg border border-gold/30 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
              <img src="/assets/logo.svg" alt="Heritage & Culture Portal Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-0">
              <div className="text-gold font-extrabold text-base md:text-lg leading-tight">Heritage & Culture</div>
              <div className="text-gold/80 text-xs md:text-sm font-semibold tracking-wider">PORTAL</div>
            </div>
          </NavLink>

          <nav className="hidden xl:flex items-center gap-1.5 flex-1 justify-center">
            <NavLink to="https://heritage-and-cultue-portal.vercel.app/heritage" className="text-gray-700 dark:text-gray-200 hover:text-gold dark:hover:text-gold transition-colors duration-200 font-semibold text-xs px-2.5 py-1 rounded hover:bg-gold/10 dark:hover:bg-gold/10">Heritage Sites</NavLink>
            <NavLink to="https://heritage-and-cultue-portal.vercel.app/festivals" className="text-gray-700 dark:text-gray-200 hover:text-gold dark:hover:text-gold transition-colors duration-200 font-semibold text-xs px-2.5 py-1 rounded hover:bg-gold/10 dark:hover:bg-gold/10 whitespace-nowrap">Festivals & Traditions</NavLink>
            <NavLink to="/arts" className="text-gray-700 dark:text-gray-200 hover:text-gold dark:hover:text-gold transition-colors duration-200 font-semibold text-xs px-2.5 py-1 rounded hover:bg-gold/10 dark:hover:bg-gold/10">Art & Crafts</NavLink>
            <NavLink to="https://heritage-and-cultue-portal.vercel.app/cuisine" className="text-gray-700 dark:text-gray-200 hover:text-gold dark:hover:text-gold transition-colors duration-200 font-semibold text-xs px-2.5 py-1 rounded hover:bg-gold/10 dark:hover:bg-gold/10">Cuisine</NavLink>
            <NavLink to="https://heritage-and-cultue-portal.vercel.app/languages" className="text-gray-700 dark:text-gray-200 hover:text-gold dark:hover:text-gold transition-colors duration-200 font-semibold text-xs px-2.5 py-1 rounded hover:bg-gold/10 dark:hover:bg-gold/10 whitespace-nowrap">Languages & Literature</NavLink>
            <NavLink to="/explore" className="text-gray-700 dark:text-gray-200 hover:text-gold dark:hover:text-gold transition-colors duration-200 font-semibold text-xs px-2.5 py-1 rounded hover:bg-gold/10 dark:hover:bg-gold/10">Explore</NavLink>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <NavLink to="/" className="text-gray-700 dark:text-gray-200 hover:text-gold dark:hover:text-gold transition-colors duration-200 font-medium text-xs px-2 py-1 rounded hover:bg-gold/10 dark:hover:bg-gold/10">Home</NavLink>
              <NavLink to="/about" className="text-gray-700 dark:text-gray-200 hover:text-gold dark:hover:text-gold transition-colors duration-200 font-medium text-xs px-2 py-1 rounded hover:bg-gold/10 dark:hover:bg-gold/10">About</NavLink>
              <NavLink to="/contact" className="text-gray-700 dark:text-gray-200 hover:text-gold dark:hover:text-gold transition-colors duration-200 font-medium text-xs px-2 py-1 rounded hover:bg-gold/10 dark:hover:bg-gold/10">Contact</NavLink>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-gold font-medium text-sm">{currentUser.name}</span>
                <button onClick={onLogout} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition">Logout</button>
              </div>
            ) : (
              <NavLink to="/login" className="bg-gold text-gray-900 px-4 py-2 rounded font-semibold hover:bg-gold/90 transition text-sm">Login</NavLink>
            )}

            <div className="flex items-center gap-2 pl-3">
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
