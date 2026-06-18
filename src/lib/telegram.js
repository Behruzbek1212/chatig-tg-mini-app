// Telegram WebApp SDK wrapper. Safe to import in a plain browser (tg is null);
// in that case the app falls back to a ?store= query param for local dev.

export const tg = window.Telegram?.WebApp ?? null

export function rawInitData() {
  return tg?.initData ?? ''
}

// The store public_id passed via t.me/<bot>/app?startapp=<public_id>.
// Telegram exposes it inconsistently, so check every known source:
//  1) tg.initDataUnsafe.start_param  (primary)
//  2) the raw initData string's start_param=
//  3) tgWebAppStartParam in the URL query OR hash (Telegram puts it in #...)
//  4) ?store= fallback for plain-browser dev
export function startParam() {
  const fromTg = tg?.initDataUnsafe?.start_param
  if (fromTg) return fromTg

  // From raw initData (key=value&...)
  const raw = tg?.initData
  if (raw) {
    const sp = new URLSearchParams(raw).get('start_param')
    if (sp) return sp
  }

  // From URL query and hash. Telegram launches the WebApp with the launch
  // params in the URL fragment, e.g.
  //   #tgWebAppData=<url-encoded initData>&tgWebAppStartParam=<param>&...
  // so check both the direct hash param AND start_param nested inside the
  // tgWebAppData blob.
  const fromQuery = new URLSearchParams(window.location.search)
  const hash = new URLSearchParams((window.location.hash || '').replace(/^#/, ''))

  const direct =
    fromQuery.get('tgWebAppStartParam') || hash.get('tgWebAppStartParam')
  if (direct) return direct

  const webAppData = hash.get('tgWebAppData')
  if (webAppData) {
    const sp = new URLSearchParams(webAppData).get('start_param')
    if (sp) return sp
  }

  return fromQuery.get('store') || ''
}

export function tgUser() {
  return tg?.initDataUnsafe?.user ?? null
}

// Map Telegram theme params to the CSS vars used by tailwind.config.js.
function applyTheme() {
  const p = tg?.themeParams
  if (!p) return
  const root = document.documentElement.style
  const set = (cssVar, value) => value && root.setProperty(cssVar, value)
  set('--tg-bg', p.bg_color)
  set('--tg-bg-secondary', p.secondary_bg_color)
  set('--tg-text', p.text_color)
  set('--tg-hint', p.hint_color)
  set('--tg-link', p.link_color)
  set('--tg-button', p.button_color)
  set('--tg-button-text', p.button_text_color)
}

export function initTelegram() {
  if (!tg) return
  tg.ready()
  tg.expand()
  applyTheme()
  tg.onEvent?.('themeChanged', applyTheme)
}

// --- MainButton helper ---
export function setMainButton(text, onClick, { enabled = true } = {}) {
  if (!tg?.MainButton) return () => {}
  const btn = tg.MainButton
  btn.setText(text)
  enabled ? btn.enable() : btn.disable()
  btn.show()
  btn.offClick?.()
  btn.onClick(onClick)
  return () => {
    btn.offClick?.(onClick)
    btn.hide()
  }
}

export function hideMainButton() {
  tg?.MainButton?.hide()
}

// --- BackButton helper ---
export function showBackButton(onClick) {
  if (!tg?.BackButton) return () => {}
  const btn = tg.BackButton
  btn.show()
  btn.offClick?.()
  btn.onClick(onClick)
  return () => {
    btn.offClick?.(onClick)
    btn.hide()
  }
}

export function haptic(type = 'light') {
  tg?.HapticFeedback?.impactOccurred?.(type)
}

export function closeApp() {
  tg?.close?.()
}

// Telegram's native "share contact" — resolves with a phone string or null.
export function requestContact() {
  return new Promise((resolve) => {
    if (!tg?.requestContact) {
      resolve(null)
      return
    }
    tg.requestContact((ok, event) => {
      const phone = event?.responseUnsafe?.contact?.phone_number
      resolve(ok && phone ? phone : null)
    })
  })
}
