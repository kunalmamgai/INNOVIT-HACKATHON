import React from 'react'
import { motion } from 'framer-motion'
import Carousel from '../shared/Carousel'

export default function Home(){
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[60vh] flex items-center justify-center bg-earth/10">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>
        <div className="z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold">Explore India's Living Heritage</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">Discover sites, festivals, crafts and cuisines that shaped culture.</p>
        </div>
      </div>

      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue">Featured Heritage Sites</h2>
        <Carousel />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="p-6 bg-gray-800 rounded shadow hover:shadow-lg transition text-white border border-gold/30"> <h3 className="font-bold text-gold">50+ Sites</h3><p className="mt-2 text-sm text-gray-300">Mapped across India with detailed histories.</p></div>
          <div className="p-6 bg-gray-800 rounded shadow hover:shadow-lg transition text-white border border-gold/30"> <h3 className="font-bold text-gold">100+ Festivals</h3><p className="mt-2 text-sm text-gray-300">Calendar with traditions and countdowns.</p></div>
          <div className="p-6 bg-gray-800 rounded shadow hover:shadow-lg transition text-white border border-gold/30"> <h3 className="font-bold text-gold">Artisans</h3><p className="mt-2 text-sm text-gray-300">Stories from living craftspeople and galleries.</p></div>
        </div>
      </motion.div>
    </section>
  )
}
