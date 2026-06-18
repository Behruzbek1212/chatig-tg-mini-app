import { defineStore } from 'pinia'
import { startParam } from '../lib/telegram.js'

// The resolved store public_id for this Mini App session. Comes from the
// Telegram deep link start_param (or ?store= in browser dev). Every API path
// is scoped by it.
export const useTenant = defineStore('tenant', {
  state: () => ({
    // Resolve eagerly, but allow re-resolution in case Telegram's SDK populated
    // start_param slightly after store init. In mock mode (VITE_USE_MOCK) fall
    // back to a demo id so the UI works without a Telegram deep link.
    storeId:
      startParam() ||
      (import.meta.env.VITE_USE_MOCK === 'true' ? 'demo' : ''),
  }),
  getters: {
    hasStore: (s) => !!s.storeId,
  },
  actions: {
    resolve() {
      if (!this.storeId) this.storeId = startParam()
      return this.storeId
    },
  },
})
