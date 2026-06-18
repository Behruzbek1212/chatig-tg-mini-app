/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,vue}'],
  theme: {
    extend: {
      colors: {
        // Telegram theme params (see src/lib/telegram.js) drive these CSS vars,
        // with sensible light-mode fallbacks so the app also works in a browser.
        tg: {
          bg: 'var(--tg-bg, #ffffff)',
          'bg-secondary': 'var(--tg-bg-secondary, #f3f4f6)',
          text: 'var(--tg-text, #111827)',
          hint: 'var(--tg-hint, #8b95a1)',
          link: 'var(--tg-link, #2563EB)',
          button: 'var(--tg-button, #2563EB)',
          'button-text': 'var(--tg-button-text, #ffffff)',
        },
        primary: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        success: { DEFAULT: '#16A34A', 50: '#F0FDF4', 700: '#15803D' },
        danger: { DEFAULT: '#DC2626', 50: '#FEF2F2', 700: '#B91C1C' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(16,24,40,0.06), 0 1px 2px rgba(16,24,40,0.04)',
        card: '0 2px 8px rgba(16,24,40,0.06)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
