import React from 'react'
import { Link } from 'react-router-dom'

const eventPillars = [
  {
    title: 'Official Trust Layer',
    detail: 'Events are published with partner attribution from tourism bodies and cultural agencies.',
  },
  {
    title: 'AR/VR-led Discovery',
    detail: 'Each event gets immersive previews that build confidence before real-world attendance.',
  },
  {
    title: 'Campaign Amplification',
    detail: 'Co-branded event campaigns improve discoverability across schools, travelers, and families.',
  },
  {
    title: 'Impact Measurement',
    detail: 'Track virtual engagement and real-visit conversion for event performance.',
  },
]

const featuredEvents = [
  {
    id: 1,
    title: 'Delhi Heritage Walk Week 2026',
    partner: 'Delhi Tourism + ASI',
    date: '2026-03-18',
    mode: 'Hybrid',
    reach: 'Citywide Schools + Travelers',
    focus: 'Monuments, routes, and guided storytelling circuits',
  },
  {
    id: 2,
    title: 'Festivals of India Digital Showcase',
    partner: 'State Tourism Boards',
    date: '2026-04-05',
    mode: 'Virtual-first',
    reach: 'National Audience',
    focus: 'Festival previews, history capsules, and travel planning links',
  },
  {
    id: 3,
    title: 'School Heritage Learning Month',
    partner: 'Education Dept + Tourism Dept',
    date: '2026-07-10',
    mode: 'Classroom + AR/VR Labs',
    reach: 'Class 6-12',
    focus: 'Curriculum-linked heritage immersion and assignments',
  },
]

const publishingFlow = [
  {
    step: '01',
    title: 'Proposal by Tourism Partner',
    detail: 'Government partner submits event brief, priority locations, and target audience.',
  },
  {
    step: '02',
    title: 'AR/VR Content Pack Creation',
    detail: 'Your platform prepares immersive previews, cultural facts, and event story cards.',
  },
  {
    step: '03',
    title: 'Joint Event Publishing',
    detail: 'Event is published with official attribution and verified metadata.',
  },
  {
    step: '04',
    title: 'Performance Tracking',
    detail: 'Measure virtual tours, registrations, and on-ground footfall conversion.',
  },
]

export default function TourismEventCoPublishing() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <section className="rounded-3xl border-2 border-gold/40 bg-gradient-to-br from-sand to-white text-gray-900 p-6 md:p-10 mb-8 shadow-2xl">
        <p className="text-xs uppercase tracking-wider text-earth font-bold mb-3">Tourism-Government Integration</p>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3">Tourism Event Co-Publishing Hub</h1>
        <p className="text-sm md:text-base text-gray-800 max-w-4xl">
          Publish official cultural events jointly with tourism departments and promote them through AR/VR-first event experiences.
          This creates trust, stronger public reach, and better conversion from virtual interest to real visits.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/virtual-tour" className="px-5 py-2.5 rounded-xl bg-earth text-white font-semibold hover:brightness-110 transition">
            Start Event Preview in AR/VR
          </Link>
          <Link to="/festivals" className="px-5 py-2.5 rounded-xl border-2 border-earth/60 text-earth font-semibold hover:bg-earth/10 transition">
            View Published Events
          </Link>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gold mb-4">Key Points</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {eventPillars.map((pillar) => (
            <div key={pillar.title} className="bg-gray-900 border border-gold/30 rounded-xl p-4">
              <p className="text-sm font-bold text-gold">{pillar.title}</p>
              <p className="text-sm text-gray-300 mt-2">{pillar.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border-2 border-gold/30 rounded-xl p-5">
          <p className="text-sm text-gray-400">Co-Published Events</p>
          <p className="text-3xl font-bold text-gold mt-1">{featuredEvents.length}</p>
        </div>
        <div className="bg-gray-900 border-2 border-gold/30 rounded-xl p-5">
          <p className="text-sm text-gray-400">Partner Institutions</p>
          <p className="text-3xl font-bold text-gold mt-1">3</p>
        </div>
        <div className="bg-gray-900 border-2 border-gold/30 rounded-xl p-5">
          <p className="text-sm text-gray-400">Primary Engagement</p>
          <p className="text-xl font-bold text-gold mt-1">AR/VR Campaign Discovery</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-gray-900 border-2 border-gold/30 rounded-xl p-5">
          <h2 className="text-xl font-semibold text-gold mb-4">Upcoming Co-Published Events</h2>
          <div className="space-y-3">
            {featuredEvents.map((event) => (
              <div key={event.id} className="bg-gray-800 border border-gold/20 rounded-xl p-4">
                <p className="font-semibold text-white">{event.title}</p>
                <p className="text-sm text-gray-300 mt-1">Partner: {event.partner}</p>
                <div className="mt-2 text-xs text-gray-400 flex flex-wrap gap-3">
                  <span>Date: {event.date}</span>
                  <span>Mode: {event.mode}</span>
                  <span>Audience: {event.reach}</span>
                </div>
                <p className="text-sm text-gray-300 mt-2">Focus: {event.focus}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gray-900 border-2 border-gold/30 rounded-xl p-5">
          <h2 className="text-xl font-semibold text-gold mb-4">Publishing Workflow</h2>
          <div className="space-y-3">
            {publishingFlow.map((item) => (
              <div key={item.step} className="bg-gray-800 border border-gold/20 rounded-xl p-4">
                <p className="text-xs font-bold text-gold mb-1">{item.step}</p>
                <p className="font-semibold text-white">{item.title}</p>
                <p className="text-sm text-gray-300 mt-1">{item.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 p-4 rounded-xl border border-gold/30 bg-gold/10">
            <p className="text-sm text-gray-200">
              Pitch line: this page demonstrates how government tourism campaigns can be co-published with immersive previews,
              making the platform a digital event partner instead of only an information portal.
            </p>
          </div>
        </section>
      </div>

      <div className="mt-8 rounded-xl border border-gold/30 bg-gray-900 p-5">
        <h3 className="text-lg font-semibold text-gold">Why this matters</h3>
        <p className="text-sm text-gray-300 mt-2">
          You get a clear government collaboration narrative, users get trusted event information, and tourism teams get measurable digital reach.
        </p>
      </div>
    </div>
  )
}
