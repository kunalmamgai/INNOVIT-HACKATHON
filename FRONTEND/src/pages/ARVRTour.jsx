import React from 'react'

const experiences = [
  {
    title: 'Monuments in 360°',
    description: 'Walk through iconic heritage spaces with interactive hotspots and guided context.',
  },
  {
    title: 'Live Cultural Replays',
    description: 'Relive key festivals and rituals with immersive storytelling and bilingual narration.',
  },
  {
    title: 'Hands-on Learning Mode',
    description: 'Use AR overlays to inspect motifs, architecture, and craft techniques in detail.',
  },
]

export default function ARVRTour() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10 md:py-14">
      <div className="relative overflow-hidden rounded-3xl border-2 border-earth/40 bg-gradient-to-br from-sand via-white to-sand p-6 md:p-10 shadow-2xl">
        <div className="absolute -right-20 -top-16 w-72 h-72 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-16 w-72 h-72 rounded-full bg-earth/20 blur-3xl" />

        <div className="relative grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border border-earth/40 bg-earth/10 text-earth">
              New Main Experience
            </span>
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight text-gray-900">
              AR/VR Tour
            </h1>
            <p className="mt-4 text-base md:text-lg text-gray-700 max-w-xl">
              Explore heritage in a next-generation way through immersive AR/VR journeys. This is the primary interactive direction of our platform.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/heritage"
                className="px-6 py-3 rounded-xl bg-earth text-white font-bold hover:brightness-110 transition"
              >
                Launch AR/VR Experience
              </a>
              <a
                href="/explore"
                className="px-6 py-3 rounded-xl border-2 border-earth/50 text-earth font-bold hover:bg-earth/10 transition"
              >
                See Destinations
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 rounded-2xl border border-earth/30 bg-white/80 p-2 shadow-md">
              <img src="/assets/hero-placeholder.svg" alt="AR VR tour preview" className="w-full h-48 md:h-56 object-cover rounded-xl" />
            </div>
            <div className="rounded-2xl border border-earth/30 bg-white/80 p-2 shadow-md">
              <img src="/assets/placeholder-image.svg" alt="Immersive AR overlay" className="w-full h-28 object-cover rounded-xl" />
            </div>
            <div className="rounded-2xl border border-earth/30 bg-white/80 p-4 shadow-md">
              <p className="text-3xl font-extrabold text-earth">24/7</p>
              <p className="text-sm text-gray-700">Always available immersive access</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-8">
        {experiences.map((item) => (
          <article key={item.title} className="p-5 rounded-xl border border-gold/30 bg-gray-900 text-white shadow-md">
            <h2 className="text-lg font-bold text-gold">{item.title}</h2>
            <p className="mt-2 text-sm text-gray-300">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
