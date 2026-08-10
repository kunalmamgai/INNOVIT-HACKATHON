import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiFetch } from '../config/api'

const SpeechRecognition = typeof window !== 'undefined'
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI guide to India\u2019s heritage and culture. Ask me anything about monuments, festivals, crafts, or local traditions!",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [backendError, setBackendError] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // ----------------------------
  // Voice assistant (Web Speech API)
  // ----------------------------

  const toggleListening = () => {
    if (!SpeechRecognition) return
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }
    try {
      const recognition = new SpeechRecognition()
      recognition.lang = 'en-IN'
      recognition.interimResults = false
      recognition.maxAlternatives = 1
      recognition.onresult = (event) => {
        const transcript = event.results[0][0]?.transcript || ''
        setInputValue(transcript)
      }
      recognition.onend = () => setIsListening(false)
      recognition.onerror = () => setIsListening(false)
      recognitionRef.current = recognition
      recognition.start()
      setIsListening(true)
    } catch (err) {
      console.error('Voice input error:', err)
      setIsListening(false)
    }
  }

  const speak = (text) => {
    if (!text || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-IN'
    utterance.rate = 1
    window.speechSynthesis.speak(utterance)
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const newUserMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await apiFetch("/chat", {
        method: "POST",
        body: JSON.stringify({
          message: inputValue,
          conversation_history: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
      })

      let data = null
      try {
        data = await response.json()
      } catch (err) {
        // ignore
      }

      const botText =
        data && data.response
          ? data.response
          : response.ok
            ? "Sorry, I couldn't generate a response."
            : `Error: ${data?.detail || "Something went wrong."}`

      const newBotMessage = {
        id: Date.now() + 1,
        text: botText,
        sender: 'assistant',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, newBotMessage])

      if (response.ok) {
        setBackendError('')
      } else {
        setBackendError(botText)
      }

    } catch (error) {
      console.error("Chat error:", error)

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          text: "I'm having trouble connecting to the AI service. Please try again.",
          sender: 'assistant',
          timestamp: new Date(),
        },
      ])

      setBackendError("Network error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full shadow-lg flex items-center justify-center text-white text-2xl z-50"
      >
        💬
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col z-50"
          >
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Heritage Guide AI</h3>
                <p className="text-xs opacity-90">Ask about India&apos;s culture</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-2xl">
                ✕
              </button>
            </div>

            {backendError && (
              <div className="px-4 py-2 bg-red-50 text-red-700 text-sm">
                {backendError}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'user'
                        ? 'bg-amber-500 text-white rounded-br-none'
                        : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'
                      }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <span className="text-xs opacity-70 block mt-1 flex items-center justify-between gap-2">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {msg.sender === 'assistant' && (
                        <button
                          type="button"
                          onClick={() => speak(msg.text)}
                          title="Read aloud"
                          aria-label="Read response aloud"
                          className="opacity-70 hover:opacity-100 hover:bg-gray-300 dark:hover:bg-gray-600 rounded px-1 transition"
                        >
                          🔊
                        </button>
                      )}
                    </span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">
                    Typing...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="border-t p-4 flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border rounded-lg"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={toggleListening}
                disabled={!SpeechRecognition || isLoading}
                title={SpeechRecognition ? (isListening ? 'Stop listening' : 'Speak your question') : 'Voice input not supported'}
                aria-label="Voice input"
                className={`px-3 py-2 rounded-lg border ${isListening
                    ? 'bg-red-500 border-red-500 text-white animate-pulse'
                    : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition'
                  }`}
              >
                🎤
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg"
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

