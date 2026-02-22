import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-gradient-to-r from-earth via-gray-800 to-earth text-white border-t-2 border-gold mt-12 py-8 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="text-gold font-bold text-lg mb-2 drop-shadow">🏛️ Heritage Portal</h3>
            <p className="text-gray-200 text-sm">Preserving and celebrating cultural heritage</p>
          </div>
          <div>
            <h3 className="text-gold font-bold text-lg mb-3 drop-shadow">Explore</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="heritage" className="text-gray-200 hover:text-gold transition-colors">Heritage Sites</a></li>
              <li><a href="festivals" className="text-gray-200 hover:text-gold transition-colors">Festivals</a></li>
              <li><a href="cuisine" className="text-gray-200 hover:text-gold transition-colors">Cuisine</a></li>
              <li><a href="community" className="text-gray-200 hover:text-gold transition-colors">Community</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gold font-bold text-lg mb-3 drop-shadow">About</h3>
            <p className="text-gray-200 text-sm">Protecting our cultural heritage for future generations</p>
          </div>
        </div>
        <div className="border-t border-gold/30 pt-4 text-center text-gray-300 text-sm">
          <p>&copy; {new Date().getFullYear()} Heritage & Culture Portal — Built for preservation and education.</p>
        </div>
      </div>
    </footer>
  )
}
