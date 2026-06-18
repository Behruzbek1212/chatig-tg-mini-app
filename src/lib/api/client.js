// Mini App API klient. Sanctum token o'rniga har so'rovda Telegram initData'ni
// X-Telegram-Init-Data header'da yuboradi (backend uni HMAC bilan tekshiradi).

import { rawInitData } from '../telegram.js'

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')
const API_PREFIX = '/api/v1'

export class ApiError extends Error {
  constructor(status, payload) {
    super(payload?.message || 'Xatolik yuz berdi')
    this.name = 'ApiError'
    this.status = status
    this.message = payload?.message || defaultMessage(status)
    this.errors = payload?.errors || null
    this.payload = payload
  }
}

function defaultMessage(status) {
  if (status === 0) return "Serverga ulanib bo'lmadi. Internetni tekshiring."
  if (status === 403) return 'Sessiya tasdiqlanmadi. Mini app’ni qaytadan oching.'
  if (status === 404) return 'Maʼlumot topilmadi.'
  if (status === 422) return 'Maʼlumotlarni tekshiring.'
  if (status >= 500) return 'Serverda xatolik. Keyinroq urinib koʻring.'
  return 'Xatolik yuz berdi.'
}

async function request(method, path, { body, params } = {}) {
  const url = new URL(BASE_URL + API_PREFIX + path)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
    })
  }

  const headers = {
    Accept: 'application/json',
    'X-Telegram-Init-Data': rawInitData(),
    // Skip ngrok's free-plan interstitial HTML page, which otherwise replaces
    // the JSON response (and strips CORS headers -> "CORS error" in the browser).
    'ngrok-skip-browser-warning': 'true',
  }

  let payloadBody
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    payloadBody = JSON.stringify(body)
  }

  let res
  try {
    res = await fetch(url.toString(), { method, headers, body: payloadBody })
  } catch {
    throw new ApiError(0, null)
  }

  if (res.status === 204) return { data: null }

  let data = null
  const text = await res.text()
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = null
    }
  }

  if (!res.ok) throw new ApiError(res.status, data)

  return data && Object.prototype.hasOwnProperty.call(data, 'data') ? data : { data }
}

export const api = {
  get: (path, opts) => request('GET', path, opts),
  post: (path, body, opts) => request('POST', path, { ...opts, body }),
}
