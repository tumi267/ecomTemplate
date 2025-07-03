import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      total: 0,

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          let items = []

          if (existingItem) {
            items = state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          } else {
            items = [...state.items, item]
          }

          const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return { items, total }
        }),

      removeItem: (id) =>
        set((state) => {
          const items = state.items.filter((i) => i.id !== id)
          const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return { items, total }
        }),

      incrementItem: (id) =>
        set((state) => {
          const items = state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          )
          const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return { items, total }
        }),

      decrementItem: (id) =>
        set((state) => {
          let items = state.items
            .map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            )
            .filter((i) => i.quantity > 0) // remove item if quantity drops to 0

          const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
          return { items, total }
        }),

      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
