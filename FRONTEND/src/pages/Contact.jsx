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
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6 text-red">Contact Us</h1>

      <h2 className="text-lg font-bold mb-4 text-red-200">Get in Touch</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <label className="block mb-1 text-red-300">Name</label>
          <input
            {...register('name', { required: 'Name required' })}
            className="w-full border px-3 py-2 rounded  text-black"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-red-300">Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email required' })}
            className="w-full border px-3 py-2 rounded bg-white text-black"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-red-300">Message</label>
          <textarea
            rows="5"
            {...register('message', { required: 'Message required' })}
            className="w-full border px-3 py-2 rounded bg-white text-red"
          />
          {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded transition ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-earth text-white hover:opacity-90'
            }`}
        >
          {loading ? 'Sending…' : 'Send'}
        </button>
      </form>

      {submitted && (
        <div className="fixed top-6 right-6 bg-green-600 text-red px-5 py-3 rounded shadow-lg z-50">
          Thank you for contacting us!
        </div>
      )}
    </div>
  )
}
