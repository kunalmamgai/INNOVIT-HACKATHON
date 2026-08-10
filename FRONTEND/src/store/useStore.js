import create from 'zustand'

export const useStore = create(set => ({
  dark: false,
  filters: {},
  setDark: (val) => {
    set({ dark: val })
    try { localStorage.setItem('hc_dark', val ? '1' : '0') } catch (e) { /* ignore */ }
  },
  loadPrefs: () => {
    try { const v = localStorage.getItem('hc_dark'); if(v !== null) set({ dark: v === '1' }) } catch (e) { /* ignore */ }
  },
  setFilters: (filters) => set({ filters })
}))
