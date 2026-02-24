import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)

    // simulate sending (later this becomes backend/email)
    setTimeout(() => {
      console.log('Form data:', data)
      setSubmitted(true)
      setLoading(false)
      reset()

      setTimeout(() => setSubmitted(false), 2500)
    }, 800)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 md:py-12">
      <section className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 shadow-2xl p-6 md:p-8 mb-6">
        <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-gold/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-earth/15 blur-3xl" />
        <div className="relative">
          <p className="text-xs tracking-[0.2em] uppercase text-gold/90 font-semibold mb-2">Contact</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Get in Touch</h1>
          <p className="mt-3 text-sm md:text-base text-gray-300 max-w-2xl">
            Share your queries, feedback, or collaboration ideas. We’ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      <section className="bg-gray-900/95 border border-gold/30 rounded-2xl shadow-xl p-6 md:p-7">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <label className="block mb-1 text-sm font-semibold text-gold">Name</label>
          <input
            {...register('name', { required: 'Name required' })}
            className="dark-form-field w-full border border-gold/25 bg-gray-800 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
          {errors.name && <p className="text-red-300 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-gold">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email required' })}
            className="dark-form-field w-full border border-gold/25 bg-gray-800 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
          {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-semibold text-gold">Message</label>
          <textarea
            rows="5"
            {...register('message', { required: 'Message required' })}
            className="dark-form-field w-full border border-gold/25 bg-gray-800 text-white px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
          {errors.message && <p className="text-red-300 text-sm mt-1">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 rounded-lg font-semibold transition ${loading
              ? 'bg-gray-500 text-gray-200 cursor-not-allowed'
              : 'bg-gold text-gray-900 hover:bg-gold/90'
            }`}
        >
          {loading ? 'Sending…' : 'Send'}
        </button>
      </form>
      </section>

      {submitted && (
        <div className="fixed top-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-lg z-50 border border-emerald-300/30">
          Thank you for contacting us!
        </div>
      )}
    </div>
  )
}
