// 4200000 -> "4 200 000 so'm"
export function formatMoney(value, withSuffix = true) {
  const n = Number(value || 0)
  const grouped = n.toLocaleString('ru-RU').replace(/ /g, ' ')
  return withSuffix ? `${grouped} so'm` : grouped
}

export function isPhoneComplete(raw) {
  const d = String(raw || '').replace(/\D/g, '')
  const local = d.startsWith('998') ? d.slice(3) : d
  return local.length === 9
}

// Input qiymatdan toza telefon: "+998901234567"
export function phoneDigits(raw) {
  const d = String(raw || '').replace(/\D/g, '')
  const local = d.startsWith('998') ? d.slice(3) : d
  return '+998' + local.slice(0, 9)
}
