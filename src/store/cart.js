import { defineStore } from 'pinia'
import { startParam } from '../lib/telegram.js'

// Cart persisted per store public_id so a reload (or reopening the Mini App)
// keeps items for the same shop without leaking across shops.
const storageKey = () => `chatig_cart_${startParam() || 'default'}`

function load() {
  try {
    return JSON.parse(localStorage.getItem(storageKey()) || '[]')
  } catch {
    return []
  }
}

export const useCart = defineStore('cart', {
  state: () => ({
    // items: { product_id, name, price, image, quantity }
    items: load(),
  }),
  getters: {
    count: (s) => s.items.reduce((n, i) => n + i.quantity, 0),
    total: (s) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    isEmpty: (s) => s.items.length === 0,
    qtyOf: (s) => (id) => s.items.find((i) => i.product_id === id)?.quantity || 0,
  },
  actions: {
    persist() {
      localStorage.setItem(storageKey(), JSON.stringify(this.items))
    },
    add(product, quantity = 1) {
      const existing = this.items.find((i) => i.product_id === product.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        this.items.push({
          product_id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url || null,
          quantity,
        })
      }
      this.persist()
    },
    setQty(id, quantity) {
      const item = this.items.find((i) => i.product_id === id)
      if (!item) return
      item.quantity = quantity
      if (item.quantity <= 0) this.remove(id)
      else this.persist()
    },
    remove(id) {
      this.items = this.items.filter((i) => i.product_id !== id)
      this.persist()
    },
    clear() {
      this.items = []
      this.persist()
    },
    // Payload the order API expects (product_id + quantity only).
    orderItems() {
      return this.items.map((i) => ({ product_id: i.product_id, quantity: i.quantity }))
    },
  },
})
