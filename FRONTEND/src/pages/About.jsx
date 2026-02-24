import React from 'react'

export default function About(){
  const currentFeatures = [
    'Interactive heritage map with monument details',
    'Explore flow with booking and payment support',
    'Virtual tours with image proxy support for smooth rendering',
    'AI chatbot for heritage and culture questions',
    'Community actions for discussions, likes, and comments',
    'Dark mode preference persistence and PWA-ready assets',
  ]

  const techStack = [
    { label: 'Frontend', value: 'React 18, Vite 5, TailwindCSS, React Router, Leaflet, Framer Motion, Zustand, i18next' },
    { label: 'Backend', value: 'FastAPI, Uvicorn, Python 3.11+, Motor/PyMongo, python-jose, google-genai' },
    { label: 'Architecture', value: 'Full-stack web app with API-first design and local/dev + deployment-ready setup' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 md:py-12">
      <section className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 shadow-2xl p-6 md:p-8 mb-8">
        <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-gold/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-earth/15 blur-3xl" />
        <div className="relative">
          <p className="text-xs tracking-[0.2em] uppercase text-gold/90 font-semibold mb-2">About</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Heritage & Culture Portal</h1>
          <p className="mt-3 text-sm md:text-base text-gray-300 max-w-3xl">
            A full-stack platform for discovering heritage, planning visits, and learning through immersive cultural experiences.
          </p>
        </div>
      </section>
      
      <section className="bg-gray-900/95 border border-gold/30 rounded-2xl shadow-xl p-6 md:p-7 mb-6">
        <h2 className="text-xl font-bold mb-2 text-gold">Our Mission</h2>
        <p className="text-gray-200 leading-relaxed">
          Preserve, celebrate, and make Indian heritage more accessible through immersive digital experiences that connect
          virtual exploration with real-world cultural visits.
        </p>
      </section>

      <section className="bg-gray-900/95 border border-gold/30 rounded-2xl shadow-xl p-6 md:p-7 mb-6">
        <h2 className="text-xl font-bold mb-4 text-gold">Current Platform Highlights</h2>
        <div className="grid md:grid-cols-2 gap-3.5">
          {currentFeatures.map((item) => (
            <div key={item} className="bg-gray-800/90 border border-gold/20 rounded-xl p-3.5 hover:border-gold/40 transition-colors">
              <p className="text-sm text-gray-100 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-900/95 border border-gold/30 rounded-2xl shadow-xl p-6 md:p-7 mb-6">
        <h2 className="text-xl font-bold mb-4 text-gold">Tech Stack (Current)</h2>
        <div className="space-y-3.5">
          {techStack.map((item) => (
            <div key={item.label} className="bg-gray-800/90 border border-gold/20 rounded-xl p-3.5 hover:border-gold/40 transition-colors">
              <p className="text-sm font-semibold text-gold tracking-wide">{item.label}</p>
              <p className="text-sm text-gray-200 mt-1.5 leading-relaxed">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-900/95 border border-gold/30 rounded-2xl shadow-xl p-6 md:p-7">
        <h2 className="text-xl font-bold mb-2 text-gold">Team & Direction</h2>
        <p className="text-gray-200 leading-relaxed">
          We are building this as a practical hackathon-ready platform that supports tourism discovery, cultural learning,
          and measurable engagement through AR/VR-first storytelling.
        </p>
      </section>
    </div>
  )
}
