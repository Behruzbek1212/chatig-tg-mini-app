# ChatiG — Telegram Mini App (katalog)

Mijozlar uchun do'kon katalogi. Instagram'dagi AI sotuvchi mijozni shu Mini App'ga
yo'naltiradi (`t.me/<bot>/app?startapp=<store_public_id>`), mijoz mahsulotlarni
ko'radi, savatga qo'shadi va buyurtma beradi.

- Vue 3 + Vite + vue-router + Pinia + @tanstack/vue-query + Tailwind
- Telegram WebApp SDK (`index.html` da yuklanadi)
- Backend: `chatig` (`/api/v1/mini-app/...`), auth — Telegram `initData` (header `X-Telegram-Init-Data`)

## Ishga tushirish

```bash
npm install
cp .env.example .env   # VITE_API_URL ni backend (masalan http://localhost:8080) ga
npm run dev            # http://localhost:5174
```

Brauzerda sinash uchun (Telegram'siz): `http://localhost:5176/?store=<store_public_id>`.
E'tibor bering — backend baribir to'g'ri `initData` talab qiladi, shuning uchun real
test Telegram ilovasida tunnel orqali ochilganda bo'ladi.

## Tuzilma
- `src/lib/telegram.js` — WebApp SDK wrapper (initData, start_param, theme, MainButton/BackButton)
- `src/lib/api/` — API klient (initData header) + catalog endpointlari
- `src/store/` — `tenant` (store public_id), `cart` (localStorage)
- `src/features/` — catalog, cart, checkout sahifalari
