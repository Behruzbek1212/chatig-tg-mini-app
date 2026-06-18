// Mock ma'lumot — backendsiz UI'ni sinash uchun.
// .env da VITE_USE_MOCK=true bo'lsa, api klient real so'rov o'rniga shu
// ma'lumotni qaytaradi. Real backendga o'tish uchun VITE_USE_MOCK ni o'chiring.

const store = { name: 'CHATIG Demo', facts: [] }

const products = [
  {
    id: 1,
    name: 'Oq futbolka (Premium paxta)',
    price: 120000,
    images: [{ url: 'https://picsum.photos/seed/tshirt/500' }],
    low_stock: false,
    out_of_stock: false,
    description: 'Yumshoq, nafas oladigan paxtadan tikilgan klassik oq futbolka.',
  },
  {
    id: 2,
    name: 'Jinsi shim (slim fit)',
    price: 290000,
    images: [{ url: 'https://picsum.photos/seed/jeans/500' }],
    low_stock: true,
    out_of_stock: false,
    description: 'Zamonaviy slim-fit jinsi shim, kundalik kiyim uchun ideal.',
  },
  {
    id: 3,
    name: 'Krossovka (sport)',
    price: 540000,
    images: [{ url: 'https://picsum.photos/seed/sneaker/500' }],
    low_stock: false,
    out_of_stock: false,
    description: 'Yengil va qulay sport krossovkasi.',
  },
  {
    id: 4,
    name: 'Charm sumka',
    price: 380000,
    images: [{ url: 'https://picsum.photos/seed/bag/500' }],
    low_stock: false,
    out_of_stock: true,
    description: 'Tabiiy charmdan qo\'lda tikilgan sumka.',
  },
  {
    id: 5,
    name: 'Quyosh ko\'zoynagi',
    price: 95000,
    images: [{ url: 'https://picsum.photos/seed/glasses/500' }],
    low_stock: false,
    out_of_stock: false,
    description: 'UV himoyali zamonaviy quyosh ko\'zoynagi.',
  },
  {
    id: 6,
    name: 'Qo\'l soati',
    price: 720000,
    images: [{ url: 'https://picsum.photos/seed/watch/500' }],
    low_stock: true,
    out_of_stock: false,
    description: 'Klassik dizaynli analog qo\'l soati.',
  },
]

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms))

// Real catalogApi bilan bir xil shaklda javob qaytaradi.
export const mockCatalogApi = {
  async storeInfo() {
    await delay()
    return { data: store }
  },
  async list(_storeId, params = {}) {
    await delay()
    const q = (params.q || '').toLowerCase()
    const filtered = q
      ? products.filter((p) => p.name.toLowerCase().includes(q))
      : products
    return { data: filtered }
  },
  async get(_storeId, id) {
    await delay()
    const p = products.find((x) => String(x.id) === String(id))
    return { data: p || null }
  },
  async createOrder(_storeId, payload) {
    await delay(400)
    return { data: { id: Math.floor(Math.random() * 100000), ...payload } }
  },
}
