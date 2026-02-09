import React, { useEffect } from 'react'
import { useStore } from '../store/useStore'

export default function DarkModeToggle(){
  const dark = useStore(state => state.dark)
  const setDark = useStore(state => state.setDark)
  
  useEffect(()=>{ 
    useStore.getState().loadPrefs()
    // Apply dark mode to document on mount
    if (useStore.getState().dark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  return (
    <button
      aria-label="toggle dark mode"
      onClick={()=> setDark(!dark)}
      className="p-2 rounded-lg border border-gold/30 bg-gold/5 hover:bg-gold/15 text-gold transition-all duration-200 flex items-center justify-center"
      title={dark ? 'Light Mode' : 'Dark Mode'}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
