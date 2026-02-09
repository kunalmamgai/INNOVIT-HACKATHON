import React from 'react'
import { motion } from 'framer-motion'

export default function Modal({ children, onClose }){
  return (
    <motion.div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      
      {/* Modal Content */}
      <motion.div 
        className="relative z-[10000] bg-gray-900 border border-gold/30 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      > 
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="sticky top-0 right-0 m-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex ml-auto"
        >
          ✕ Close
        </button>
        
        {/* Content */}
        <div className="px-6 pb-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}
