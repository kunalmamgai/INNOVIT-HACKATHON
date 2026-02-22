import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Carousel from '../shared/Carousel'

export default function Home(){
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[52vh] md:h-[60vh] flex items-center justify-center bg-earth/10">
        <video className="hero-video" autoPlay muted loop playsInline>
          <source src="/assets/hero.mp4" type="video/mp4" />
        </video>
        <div className="z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold">Explore India's Living Heritage</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">Discover sites, festivals, crafts and cuisines that shaped culture.</p>
        </div>
      </div>

      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="max-w-6xl mx-auto px-3 sm:px-4 py-8 md:py-14">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border-2 border-earth/60 bg-sand p-4 sm:p-6 md:p-12 text-gray-900 shadow-2xl">
          <img
            src="https://blog.emb.global/wp-content/uploads/2024/01/Virtual-Reality-Tool-for-Cultural-Heritage-Preservation.webp"
            alt="AR VR section background"
            className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-sand/80" />
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gold/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-earth/20 blur-3xl" />

          <div className="relative grid md:grid-cols-2 gap-6 md:gap-10 items-center md:min-h-[540px]">
            <div>
              <span className="inline-block px-3 py-1 text-xs uppercase tracking-widest rounded-full bg-earth/10 border border-earth/40 text-earth font-semibold">
                Main Highlight
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl md:text-6xl font-extrabold leading-[1.05] max-w-2xl">
                AR/VR is the Future of Cultural Discovery
              </h2>
              <p className="mt-4 md:mt-5 text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl">
                Step into heritage spaces from anywhere with cinematic storytelling, guided audio, and immersive walkthroughs. AR/VR is our primary direction to make culture accessible to every learner, traveler, and family.
              </p>

              <div className="mt-6 md:mt-7 flex flex-col sm:flex-row flex-wrap gap-3">
                <Link
                  to="/virtual-tour"
                  className="px-6 py-3 rounded-xl bg-earth text-white font-bold text-base hover:brightness-110 transition shadow-lg text-center w-full sm:w-auto"
                >
                  Start AR/VR Tour
                </Link>
                <a
                  href="/explore"
                  className="px-6 py-3 rounded-xl border-2 border-earth/60 text-earth font-bold text-base hover:bg-earth/10 transition text-center w-full sm:w-auto"
                >
                  Explore More
                </a>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/80 border border-earth/20">Interactive Overlays</span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/80 border border-earth/20">Guided Audio</span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/80 border border-earth/20">3D Heritage Walkthroughs</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="sm:col-span-2 rounded-2xl border border-earth/30 bg-white/80 p-2 shadow-md">
                <img
                  src="https://blog.emb.global/wp-content/uploads/2024/01/Virtual-Reality-Tool-for-Cultural-Heritage-Preservation.webp"
                  alt="AR VR immersive cultural preview"
                  className="w-full h-44 md:h-56 object-cover rounded-xl"
                />
              </div>
              <div className="sm:col-span-2 rounded-2xl border border-earth/30 bg-white/80 p-5 md:p-6 shadow-md">
                <p className="text-xs uppercase tracking-wider text-earth">Immersive Experience</p>
                <p className="mt-2 text-lg font-semibold">AR/VR narratives, multilingual guides, and curated cultural trails.</p>
              </div>
              <div className="rounded-2xl border border-earth/30 bg-white/80 p-2 shadow-md">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC5ZcSZOd2aqdRxaOX3kOXwbEOyaeQmPfS2A&s"
                  alt="Virtual heritage interaction"
                  className="w-full h-28 object-cover rounded-xl"
                />
              </div>
              <div className="rounded-2xl border border-earth/30 bg-white/80 p-5 shadow-md">
                <p className="text-3xl font-extrabold text-earth">24/7</p>
                <p className="text-sm text-gray-700">Always accessible AR/VR tours</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <h2 className="text-2xl font-semibold mb-4 text-blue">Featured Heritage Sites</h2>
          <Carousel />
        </div>

        <div className="md:grid md:grid-cols-3 md:gap-4 mt-8">
          <div className="mobile-side-scroll no-scrollbar md:contents flex gap-4 pb-2">
            <div className="min-w-[85%] md:min-w-0 p-6 bg-gray-800 rounded shadow hover:shadow-lg transition text-white border border-gold/30">
              <h3 className="font-bold text-gold">50+ Sites</h3>
              <p className="mt-2 text-sm text-gray-300">Mapped across India with detailed histories.</p>
            </div>
            <div className="min-w-[85%] md:min-w-0 p-6 bg-gray-800 rounded shadow hover:shadow-lg transition text-white border border-gold/30">
              <h3 className="font-bold text-gold">100+ Festivals</h3>
              <p className="mt-2 text-sm text-gray-300">Calendar with traditions and countdowns.</p>
            </div>
            <div className="min-w-[85%] md:min-w-0 p-6 bg-gray-800 rounded shadow hover:shadow-lg transition text-white border border-gold/30">
              <h3 className="font-bold text-gold">Artisans</h3>
              <p className="mt-2 text-sm text-gray-300">Stories from living craftspeople and galleries.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
