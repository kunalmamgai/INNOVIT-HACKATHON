import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
};

const cardRise = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ARVRTour() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(192,154,75,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(12,26,45,0.35),_transparent_60%)]" />
      <div className="absolute -top-24 right-[-10%] h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute -bottom-32 left-[-5%] h-72 w-72 rounded-full bg-[#0f172a]/40 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center"
        >
          <div>
            <p className="text-gold font-semibold tracking-[0.25em] text-xs uppercase mb-4">AR/VR Tour</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
              Step inside history with immersive AR/VR heritage tours.
            </h1>
            <p className="mt-5 text-gray-300 text-lg">
              Walk through iconic monuments in a fully guided experience built for modern headsets. Switch between
              augmented overlays on-site or full virtual walkthroughs from home.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/explore"
                className="bg-gold text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition"
              >
                Book an AR/VR Tour
              </Link>
              <Link
                to="/headset"
                className="border border-gold/40 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gold/10 transition"
              >
                See Supported Headsets
              </Link>
            </div>
          </div>

          <motion.div
            variants={cardRise}
            className="bg-gradient-to-br from-[#0b1220]/90 to-[#111827]/90 border border-gold/20 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gold text-sm font-semibold">Experience Preview</p>
                <h2 className="text-2xl font-bold text-white">Immersive Heritage — AR/VR Preview</h2>
              </div>
              <span className="text-xs uppercase bg-gold/10 text-gold px-3 py-1 rounded-full">Live Guide</span>
            </div>
            <div className="h-40 rounded-xl overflow-hidden border border-gold/10">
              <img
                src="https://rihlattravelnews.com/wp-content/uploads/2025/01/woman-exploring-pyramids-with-vr-headset-historical-style_pkproject-960x538.jpg"
                alt="Traveler exploring heritage with a VR headset"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="bg-black/30 rounded-lg py-3">
                <p className="text-gold font-bold">4K</p>
                <p className="text-xs text-gray-400">Cinematic</p>
              </div>
              <div className="bg-black/30 rounded-lg py-3">
                <p className="text-gold font-bold">360°</p>
                <p className="text-xs text-gray-400">Immersive</p>
              </div>
              <div className="bg-black/30 rounded-lg py-3">
                <p className="text-gold font-bold">AI</p>
                <p className="text-xs text-gray-400">Narrator</p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Choose your tour mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0b1220]/80 border border-gold/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gold mb-3">AR/VR Guided Tour</h3>
              <p className="text-gray-300 mb-4">
                Visit on-site or remote with immersive visuals, spatial audio, and adaptive narration that responds to
                where you look.
              </p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Real-time annotations and cultural insights.</li>
                <li>• Multi-language narration with signpost prompts.</li>
                <li>• Optional live guide for group sessions.</li>
              </ul>
            </div>
            <div className="bg-[#111827]/80 border border-gold/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gold mb-3">Virtual Tour (No Headset)</h3>
              <p className="text-gray-300 mb-4">
                Explore at your own pace with cinematic walkthroughs and interactive hotspots optimized for desktop and
                mobile.
              </p>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Guided scenes with clickable deep-dive stories.</li>
                <li>• Shareable highlights for classrooms and groups.</li>
                <li>• Lower bandwidth mode for quick access.</li>
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-white mb-6">How the AR/VR tour works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Pick a monument", text: "Browse heritage sites and choose AR/VR as your tour type." },
              { title: "Pair your headset", text: "Connect your headset or mobile device for calibrated visuals." },
              { title: "Start the walkthrough", text: "Follow the guided path with live narration and overlays." }
            ].map((item) => (
              <div key={item.title} className="bg-black/40 border border-gold/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-300">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-[#0b1220]/90 to-[#162238]/90 border border-gold/20 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">What you need</h2>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• VR headset (Meta Quest 2/3, HTC Vive, or equivalent).</li>
                <li>• Stable Wi-Fi or 5G connection for live overlays.</li>
                <li>• 2 x 2 meter play area for room-scale mode.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Comfort & safety</h2>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Take breaks every 15 minutes during long sessions.</li>
                <li>• Enable seated mode for educational tours.</li>
                <li>• Adjust brightness and motion settings to reduce fatigue.</li>
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold text-white">Ready to tour?</h2>
          <p className="text-gray-300 mt-3">Choose AR/VR in Explore and launch your guided experience instantly.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/explore"
              className="bg-gold text-gray-900 px-7 py-3 rounded-lg font-semibold hover:bg-gold/90 transition"
            >
              Book Now!
            </Link>
            <Link
              to="/virtual-tour"
              className="border border-gold/40 text-white px-7 py-3 rounded-lg font-semibold hover:bg-gold/10 transition"
            >
              View Virtual Tour
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
