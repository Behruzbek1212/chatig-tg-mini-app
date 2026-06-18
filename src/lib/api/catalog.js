import { api } from './client.js'
import { mockCatalogApi } from './mock.js'

const base = (storeId) => `/mini-app/stores/${storeId}`

const realCatalogApi = {
  storeInfo: (storeId) => api.get(`${base(storeId)}/store`),
  list: (storeId, params) => api.get(`${base(storeId)}/products`, { params }),
  get: (storeId, id) => api.get(`${base(storeId)}/products/${id}`),
  createOrder: (storeId, payload) => api.post(`${base(storeId)}/orders`, payload),
}

// VITE_USE_MOCK=true bo'lsa backendsiz soxta ma'lumot ishlatiladi (UI sinash uchun).
export const catalogApi =
  import.meta.env.VITE_USE_MOCK === 'true' ? mockCatalogApi : realCatalogApi
