import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      cartId: null, // to track guest carts
      user: null, // { id, firstName, lastName, email, phone, ... }

      // --- USER ---
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),

      // --- CART SYNC HELPERS ---
      updateTotals: () => {
        const items = get().items
        const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
        set({ total })
      },

      // --- CRUD ---
      // loadCart: async () => {
      //   const { user, cartId } = get()
      //   try {
      //     // change routes to match api/lib
      //     const res = await fetch('/api/cart', {
      //       method: 'POST',
      //       headers: { 'Content-Type': 'application/json' },
      //       body: JSON.stringify({ cartId }),
      //     })
      //     const data = await res.json()
      //     if (data?.cart) {
      //       set({ items: JSON.parse(data.cart.productJSON || '[]'), cartId: data.cart.id })
      //       get().updateTotals()
      //     }
      //   } catch (err) {
      //     console.error('Failed to load cart', err)
      //   }
      // },

      addItem: async (item) => {
        const state = get()
        const itemId = item.variantId || item.productId
     
        let items = []
        const existingItem = state.items.find((i) => i.id === itemId)
        if (existingItem) {
          items = state.items.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity + item.quantity } : i
          )
        } else {
          items = [...state.items, { ...item, id: itemId }]
        }

        set({ items })
        get().updateTotals()

        // Sync to backend
        try {
          const res = await fetch('/api/cart/getCartOrder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cartId: state.cartId,
              userId: state.user?.id,
              items,
            }),
          })
          const data = await res.json()
          console.log(data)
      
          if (data) set({ cartId: data.id,paymentStatus:data.paymentStatus })
        } catch (err) {
          console.error('Failed to sync cart', err)
        }
      },

      removeItem: async (id) => {
        const state = get()
        const items = state.items.filter((i) => i.id !== id)
        set({ items })
        get().updateTotals()

        try {
          await fetch('/api/cart', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartId: state.cartId, items }),
          })
        } catch (err) {
          console.error('Failed to sync remove', err)
        }
      },

      clearCart: async () => {
        set({ items: [], total: 0 })

        try {
          const { cartId } = get()
          if (cartId) {
            await fetch('/api/cart/clear', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cartId }),
            })
          }
        } catch (err) {
          console.error('Failed to clear cart', err)
        }
      },

      incrementItem: async (id) => {
        const state = get()
        const items = state.items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i
        )
        set({ items })
        get().updateTotals()

        try {
          await fetch('/api/cart', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartId: state.cartId, items }),
          })
        } catch (err) {
          console.error('Failed to sync increment', err)
        }
      },

      decrementItem: async (id) => {
        const state = get()
        const items = state.items
          .map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0)

        set({ items })
        get().updateTotals()

        try {
          await fetch('/api/cart', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cartId: state.cartId, items }),
          })
        } catch (err) {
          console.error('Failed to sync decrement', err)
        }
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)