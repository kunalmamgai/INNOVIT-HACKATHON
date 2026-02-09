import React from 'react'

export default function About() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About Heritage & Culture Portal</h1>

      <section className="bg-gray-800 rounded shadow p-8 text-white border border-gold/30">
        <h2 className="text-gold text-xl font-bold mb-2">Our Mission</h2>
        <p className="text-white-700 ">To preserve, celebrate, and share India's rich cultural heritage with the world through interactive digital experiences.</p>
      </section>

      <section className="bg-gray-800 rounded shadow p-9 text-white border border-gold/30">
        <h2 className="text-xl text-gold font-bold mb-4">Preservation Stats</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center"><div className="text-3xl font-bold text-gold">50+</div><p>Heritage Sites Documented</p></div>
          <div className="text-center"><div className="text-3xl font-bold text-gold">100+</div><p>Festivals Catalogued</p></div>
          <div className="text-center"><div className="text-3xl font-bold text-gold">200+</div><p>Artisans Supported</p></div>
        </div>
      </section>

      <section className="bg-gray-800 rounded shadow p-8 text-white border border-gold/30">
        <h2 className="text-xl text-gold font-bold mb-2">Our Team</h2>
        <p className="text-white-500">A dedicated team of historians, technologists, and cultural ambassadors working toward sustainable heritage preservation.</p>
      </section>
    </div>
  )
}
