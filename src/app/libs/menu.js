// /libs/menuStore.js
import { create } from 'zustand'

export const useMenuStore = create((set) => ({
  isOpen: false,
  categories: [],
  loading: false,
  error: null,

  openMenu: () => set({ isOpen: true }),
  closeMenu: () => set({ isOpen: false }),
  toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),

  fetchCategories: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/getcategories') // Adjust to your correct API endpoint
      if (!res.ok) throw new Error('Failed to fetch categories')
      const data = await res.json()
      set({ categories: data, loading: false })
    } catch (err) {
      set({ error: err.message, loading: false })
    }
  },
}))

