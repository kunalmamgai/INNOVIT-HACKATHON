import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Detect environment and set API base URL
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? '/'
  : 'https://delhi-heritage-api.onrender.com/'

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI guide to Delhi's heritage and culture. Ask me anything about monuments, festivals, cuisine, or local traditions!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const [backendAvailable, setBackendAvailable] = useState(true)
  const [backendError, setBackendError] = useState('')

  // Restore persisted open state so the widget doesn't disappear
  useEffect(() => {
    try {
      const v = localStorage.getItem('chatbot:isOpen')
      if (v === 'true') setIsOpen(true)
    } catch (e) {
      // ignore localStorage errors
    }
  }, [])

  // Persist open state so it survives route changes / reloads
  useEffect(() => {
    try {
      localStorage.setItem('chatbot:isOpen', isOpen ? 'true' : 'false')
    } catch (e) {
      // ignore localStorage errors
    }
  }, [isOpen])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check backend health on mount
  useEffect(() => {
    let cancelled = false
    const ping = async () => {
      try {
        const url = API_BASE_URL === '/' ? '/' : `${API_BASE_URL}`
        const res = await fetch(url)
        if (!cancelled) {
          setBackendAvailable(res.ok)
          setBackendError('')
        }
      } catch (err) {
        if (!cancelled) {
          setBackendAvailable(false)
          setBackendError('Backend unreachable')
        }
      }
    }
    ping()
    return () => { cancelled = true }
  }, [])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Send to backend API
      const chatUrl = API_BASE_URL === '/' ? '/chat' : `${API_BASE_URL}chat`
      const response = await fetch(chatUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          conversation_history: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      })

      // Try to parse JSON body even when response is not OK to surface errors
      let data = null
      try {
        data = await response.json()
      } catch (e) {
        // ignore JSON parse errors
      }

      const botText = (data && data.response) ? data.response : (response.ok ? 'Sorry, I could not process that request.' : `Error: ${response.status} ${response.statusText}`)

      // Update backend status based on response
      if (response.ok) {
        setBackendAvailable(true)
        setBackendError('')
      } else {
        setBackendAvailable(false)
        setBackendError(botText)
      }

      // Add bot response
      const botMessage = {
        id: messages.length + 2,
        text: botText,
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      setBackendAvailable(false)
      setBackendError('Network error')
      const errorMessage = {
        id: messages.length + 2,
        text: 'Sorry, I encountered a network error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:scale-110 transition-transform z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        💬
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Heritage Guide AI</h3>
                <p className="text-xs opacity-90">Ask about Delhi's culture</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl hover:opacity-80 transition"
              >
                ✕
              </button>
            </div>
            {/* Backend status banner */}
            {backendError && (
              <div className="px-4 py-2 bg-red-50 text-red-700 text-sm border-t border-red-100">
                {backendError}
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-white rounded-br-none'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg rounded-bl-none">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSendMessage}
              className="border-t border-gray-200 dark:border-gray-700 p-4 flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-800 dark:text-white"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
