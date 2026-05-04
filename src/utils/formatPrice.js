
export function formatPrice(amount, currency = 'USD', locale = 'en-US') {
  if (amount == null || isNaN(amount)) return '—'
  return new Intl.NumberFormat(locale, {
    style:                 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format price without the currency symbol — useful for split layouts.
 * @param {number} amount
 * @returns {string}  e.g. "12.50"
 */
export function formatPriceRaw(amount) {
  if (amount == null || isNaN(amount)) return '—'
  return Number(amount).toFixed(2)
}

// ─────────────────────────────────────────────
// Discount helpers
// ─────────────────────────────────────────────

/**
 * Calculate and format the discount percentage between two prices.
 * @param {number} original
 * @param {number} sale
 * @returns {string}  e.g. "30%" — or '' if no discount
 */
export function formatDiscount(original, sale) {
  if (!Number.isFinite(original) || !Number.isFinite(sale) || sale >= original) return ''
  const pct = Math.round((1 - sale / original) * 100)
  return `${pct}%`
}

/**
 * Return the raw discount percentage as a number.
 * @param {number} original
 * @param {number} sale
 * @returns {number}  e.g. 30
 */
export function calcDiscountPct(original, sale) {
  if (!Number.isFinite(original) || !Number.isFinite(sale) || sale >= original) return 0
  return Math.round((1 - sale / original) * 100)
}

/**
 * Format the absolute saving amount.
 * @param {number} original
 * @param {number} sale
 * @param {string} currency
 * @returns {string}  e.g. "Save $7.50"
 */
export function formatSavings(original, sale, currency = 'USD') {
  if (!Number.isFinite(original) || !Number.isFinite(sale) || sale >= original) return ''
  const saved = original - sale
  return `Save ${formatPrice(saved, currency)}`
}

/**
 * Check if an item is on sale.
 * @param {number} original
 * @param {number} sale
 * @returns {boolean}
 */
export function isOnSale(original, sale) {
  return Number.isFinite(original) && Number.isFinite(sale) && sale < original
}

// ─────────────────────────────────────────────
// Range & display helpers
// ─────────────────────────────────────────────

/**
 * Format a price range for a category or collection.
 * @param {number} min
 * @param {number} max
 * @param {string} currency
 * @returns {string}  e.g. "$8.99 – $24.99"
 */
export function formatPriceRange(min, max, currency = 'USD') {
  if (min == null || max == null) return '—'
  if (min === max) return formatPrice(min, currency)
  return `${formatPrice(min, currency)} – ${formatPrice(max, currency)}`
}

/**
 * Format a review count with label.
 * @param {number}  count
 * @param {boolean} short  — true returns "1.2k reviews"
 * @returns {string}  e.g. "1,240 reviews" or "1.2k reviews"
 */
export function formatReviewCount(count, short = false) {
  if (!count && count !== 0) return ''
  if (count === 0) return 'No reviews yet'
  if (count === 1) return '1 review'

  if (short && count >= 1000) {
    const k = (count / 1000).toFixed(count < 10000 ? 1 : 0)
    return `${k}k reviews`
  }

  return `${count.toLocaleString('en-US')} reviews`
}

/**
 * Format a rating number to 1 decimal place.
 * @param {number} rating
 * @returns {string}  e.g. "4.3"
 */
export function formatRating(rating) {
  if (rating == null || isNaN(rating)) return '—'
  return Number(rating).toFixed(1)
}

// ─────────────────────────────────────────────
// Cart total calculations
// ─────────────────────────────────────────────

const SHIPPING_THRESHOLD = 35   // free shipping above this
const SHIPPING_FLAT      = 5.99
const TAX_RATE           = 0.08 // 8%

/**
 * Calculate full cart totals from an array of cart items.
 *
 * Each item must have: { price, salePrice?, originalPrice?, qty }
 *
 * @param {Array}   items
 * @param {string}  promoCode  — optional promo code
 * @param {string}  currency
 * @returns {{
 *   subtotal:      string,
 *   subtotalRaw:   number,
 *   savings:       string,
 *   savingsRaw:    number,
 *   shipping:      string,
 *   shippingRaw:   number,
 *   freeShipping:  boolean,
 *   tax:           string,
 *   taxRaw:        number,
 *   total:         string,
 *   totalRaw:      number,
 *   itemCount:     number,
 *   promoApplied:  boolean,
 *   promoDiscount: string,
 * }}
 */
export function formatCartTotal(items = [], promoCode = '', currency = 'USD') {
  const subtotalRaw = items.reduce((sum, i) => {
    return sum + (i.salePrice ?? i.price) * i.qty
  }, 0)

  const savingsRaw = items.reduce((sum, i) => {
    const orig = i.originalPrice ?? i.price
    const sale = i.salePrice     ?? i.price
    return sum + (orig - sale) * i.qty
  }, 0)

  const freeShipping = subtotalRaw >= SHIPPING_THRESHOLD
  const shippingRaw  = freeShipping ? 0 : SHIPPING_FLAT

  // Promo codes
  const PROMOS = {
    'KIDDLE10': 0.10,
    'SUNLIT':   0.15,
    'BOOKCLUB': 0.20,
  }
  const promoRate     = PROMOS[promoCode?.toUpperCase()] ?? 0
  const promoAmountRaw = subtotalRaw * promoRate
  const promoApplied  = promoRate > 0

  const afterPromo = subtotalRaw - promoAmountRaw
  const taxRaw     = afterPromo * TAX_RATE
  const totalRaw   = afterPromo + shippingRaw + taxRaw

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0)

  return {
    subtotal:      formatPrice(subtotalRaw,    currency),
    subtotalRaw,
    savings:       savingsRaw > 0 ? formatSavings(subtotalRaw + savingsRaw, subtotalRaw, currency) : '',
    savingsRaw,
    shipping:      freeShipping ? 'Free' : formatPrice(shippingRaw, currency),
    shippingRaw,
    freeShipping,
    tax:           formatPrice(taxRaw, currency),
    taxRaw,
    total:         formatPrice(totalRaw, currency),
    totalRaw,
    itemCount,
    promoApplied,
    promoDiscount: promoApplied
      ? `${(promoRate * 100).toFixed(0)}% off · -${formatPrice(promoAmountRaw, currency)}`
      : '',
  }
}

// ─────────────────────────────────────────────
// Stripe / payment helpers
// ─────────────────────────────────────────────

/**
 * Convert a decimal price to integer cents for Stripe.
 * @param {number} price  e.g. 12.50
 * @returns {number}       e.g. 1250
 */
export function stripeCents(price) {
  return Math.round(price * 100)
}

// ─────────────────────────────────────────────
// Countdown / offer helpers
// ─────────────────────────────────────────────

/**
 * Check if an offer is still valid.
 * @param {string|Date} expiresAt
 * @returns {boolean}
 */
export function isOfferActive(expiresAt) {
  if (!expiresAt) return true
  return new Date(expiresAt) > new Date()
}

/**
 * Get time remaining until expiry as a human-friendly string.
 * @param {string|Date} expiresAt
 * @returns {string}  e.g. "2 days left" | "3 hours left" | "Expired"
 */
export function formatTimeLeft(expiresAt) {
  if (!expiresAt) return ''
  const timestamp = new Date(expiresAt).getTime()
  if (!isFinite(timestamp)) return ''
  
  const diff = timestamp - Date.now()
  if (diff <= 0) return 'Expired'

  const days    = Math.floor(diff / 86400000)
  const hours   = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000)  / 60000)

  if (days > 1)    return `${days} days left`
  if (days === 1)  return `1 day left`
  if (hours > 1)   return `${hours} hours left`
  if (hours === 1) return `1 hour left`
  return `${minutes}m left`
}

/**
 * Returns true if an offer expires within the next `withinMs` milliseconds.
 * Default: 1 hour — used to trigger "urgent" red styling.
 * @param {string|Date} expiresAt
 * @param {number}      withinMs
 * @returns {boolean}
 */
export function isOfferUrgent(expiresAt, withinMs = 3600000) {
  if (!expiresAt) return false
  const diff = new Date(expiresAt) - Date.now()
  return diff > 0 && diff <= withinMs
}

// ─────────────────────────────────────────────
// Misc
// ─────────────────────────────────────────────

/**
 * Clamp a number between min and max.
 * Useful for quantity steppers.
 */
export function clamp(value, min = 1, max = 99) {
  return Math.min(max, Math.max(min, value))
}

/**
 * Truncate a book title for display in tight spaces.
 * @param {string} title
 * @param {number} maxWords
 * @returns {string}
 */
export function shortTitle(title, maxWords = 5) {
  if (!title) return ''
  const words = title.split(' ')
  if (words.length <= maxWords) return title
  return words.slice(0, maxWords).join(' ') + '…'
}