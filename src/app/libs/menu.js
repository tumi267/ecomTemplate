// /libs/menuStore.js
import { create } from 'zustand'

export const useMenuStore = create((set) => ({
  isOpen: false,

  openMenu: () => set({ isOpen: true }),
  closeMenu: () => set({ isOpen: false }),
  toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),
}))
