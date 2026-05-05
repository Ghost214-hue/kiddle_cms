import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatPrice'

const PAYMENT_METHODS = ['CARD', 'PAYPAL']

// Helper to get cover color based on book title/genre
function getCoverColor(book) {
  const colors = {
    'The Midnight Library': '#8aaccb',
    'Before the Coffee Gets Cold': '#e8d5b8',
    'Where the Crawdads Sing': '#a89060',
    "The Lion's Secret Garden": '#7ab080',
    'Klara and the Sun': '#c8b8a0',
    'Stars & Beyond': '#2a4a6a',
    'The Forest Alphabet': '#6a9a6a',
    'Wings of Tomorrow': '#c4a060',
    'The Starless Sea': '#4a6a8a',
    'Wildwood Whispers': '#5a8a6a',
    'Mathematics Grade 7': '#d4a050',
    'Colours of the Sky': '#8aaccb',
    'Things Fall Apart': '#a06030',
    'English Workbook Grade 4': '#6a9a8a',
    'Science & Tech Grade 6': '#4a7a6a',
    'Social Studies Grade 3': '#d4a060',
  }
  return colors[book.title] || '#e0a870'
}

function CartItem({ item, onUpdateQty, onRemove }) {
  const [removing, setRemoving] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const price = (item.salePrice ?? item.price) * item.qty
  const coverColor = getCoverColor(item)

  function handleRemove() {
    setRemoving(true)
    setTimeout(() => onRemove(item._id, item.format), 350)
  }

  return (
    <div className={`
      flex flex-col sm:flex-row sm:items-start gap-4 p-4
      bg-white/60 backdrop-blur-sm
      border border-[rgba(200,170,130,0.28)] rounded-xl
      transition-all duration-350
      ${removing ? 'opacity-0 translate-x-5' : 'opacity-100 translate-x-0'}
    `}>
      {/* Cover */}
      <Link to={`/book/${item.slug}`} className="flex-shrink-0 self-center sm:self-start">
        <div 
          className="w-[80px] h-[110px] rounded-lg relative overflow-hidden shadow-md"
          style={{
            background: `linear-gradient(145deg, ${coverColor}, ${coverColor}80)`,
          }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/15 rounded-l-lg" />
          {!imgErr && item.img ? (
            <img 
              src={item.img} 
              alt={item.title} 
              onError={() => setImgErr(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="opacity-60">
                <path d="M4 19V5a2 2 0 012-2h13a1 1 0 011 1v13" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M4 19a2 2 0 002 2h14" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Info Section */}
      <div className="flex-1 min-w-0">
        <Link to={`/book/${item.slug}`} className="no-underline">
          <h3 className="font-['Playfair_Display',serif] text-[15px] font-semibold text-[#3d2010] mb-1 leading-tight line-clamp-2">
            {item.title}
          </h3>
        </Link>
        <p className="text-xs text-[#9a7a5a] font-['DM_Sans',sans-serif] mb-2">
          by {item.author}
        </p>
        <div className="inline-flex items-center gap-1.5 bg-[rgba(160,105,58,0.09)] rounded-lg px-2.5 py-0.5 mb-3">
          <span className="text-[11px] text-[#9a6030] font-['DM_Sans',sans-serif] font-medium">
            {item.format || 'Print'}
          </span>
          {item.ageRange && (
            <>
              <span className="text-[#c4a882]">•</span>
              <span className="text-[11px] text-[#9a6030] font-['DM_Sans',sans-serif] font-medium">
                {item.ageRange}
              </span>
            </>
          )}
        </div>

        {/* Price and Actions - Mobile Layout */}
        <div className="flex flex-col sm:hidden gap-3">
          <div className="flex items-center justify-between">
            <div className="text-[17px] font-bold text-[#7a4e22] font-['DM_Sans',sans-serif]">
              {formatPrice(price)}
            </div>
            <div className="flex items-center">
              <button
                onClick={() => onUpdateQty(item._id, item.format, item.qty - 1)}
                className="w-[34px] h-[34px] bg-white/60 border border-[rgba(180,140,90,0.28)] border-r-0 rounded-l-lg cursor-pointer text-lg text-[#7a4e22] flex items-center justify-center hover:bg-white/80 transition"
              >
                −
              </button>
              <div className="w-11 h-[34px] bg-white/70 border border-[rgba(180,140,90,0.28)] flex items-center justify-center text-sm font-semibold text-[#3d2010] font-['DM_Sans',sans-serif]">
                {item.qty}
              </div>
              <button
                onClick={() => onUpdateQty(item._id, item.format, item.qty + 1)}
                className="w-[34px] h-[34px] bg-white/60 border border-[rgba(180,140,90,0.28)] border-l-0 rounded-r-lg cursor-pointer text-lg text-[#7a4e22] flex items-center justify-center hover:bg-white/80 transition"
              >
                +
              </button>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="w-full bg-none border border-[rgba(180,140,90,0.28)] cursor-pointer text-[#c4a882] py-2.5 flex items-center justify-center gap-1.5 text-xs font-['DM_Sans',sans-serif] transition-colors hover:text-[#b43c1e] hover:border-[rgba(180,100,60,0.4)] rounded-lg"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5h10M5.5 3.5V2.5a1 1 0 011-1h1a1 1 0 011 1v1M6 6v4M8 6v4M3 3.5l.7 7.5a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Remove</span>
          </button>
        </div>

        {/* Price and Actions - Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between gap-3 flex-wrap">
          <div className="text-[17px] font-bold text-[#7a4e22] font-['DM_Sans',sans-serif]">
            {formatPrice(price)}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <button
                onClick={() => onUpdateQty(item._id, item.format, item.qty - 1)}
                className="w-[34px] h-[34px] bg-white/60 border border-[rgba(180,140,90,0.28)] border-r-0 rounded-l-lg cursor-pointer text-lg text-[#7a4e22] flex items-center justify-center hover:bg-white/80 transition"
              >
                −
              </button>
              <div className="w-11 h-[34px] bg-white/70 border border-[rgba(180,140,90,0.28)] flex items-center justify-center text-sm font-semibold text-[#3d2010] font-['DM_Sans',sans-serif]">
                {item.qty}
              </div>
              <button
                onClick={() => onUpdateQty(item._id, item.format, item.qty + 1)}
                className="w-[34px] h-[34px] bg-white/60 border border-[rgba(180,140,90,0.28)] border-l-0 rounded-r-lg cursor-pointer text-lg text-[#7a4e22] flex items-center justify-center hover:bg-white/80 transition"
              >
                +
              </button>
            </div>
            <button
              onClick={handleRemove}
              className="bg-none border-none cursor-pointer text-[#c4a882] px-3 py-1.5 flex items-center gap-1.5 text-xs font-['DM_Sans',sans-serif] transition-colors hover:text-[#b43c1e] rounded-lg"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 3.5h10M5.5 3.5V2.5a1 1 0 011-1h1a1 1 0 011 1v1M6 6v4M8 6v4M3 3.5l.7 7.5a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Function to calculate cart totals
function calculateCartTotals(items, promoCode = null) {
  const subtotal = items.reduce((sum, item) => {
    const price = item.salePrice ?? item.price
    return sum + (price * item.qty)
  }, 0)
  
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0)
  const shipping = subtotal > 50 ? 0 : 5.99
  const tax = subtotal * 0.08
  let discount = 0
  
  if (promoCode === 'KIDDLE10') discount = subtotal * 0.10
  if (promoCode === 'SUNLIT') discount = subtotal * 0.15
  
  const total = subtotal + shipping + tax - discount
  
  return {
    subtotal: formatPrice(subtotal),
    subtotalRaw: subtotal,
    shipping: shipping === 0 ? 'Free' : formatPrice(shipping),
    shippingRaw: shipping,
    tax: formatPrice(tax),
    taxRaw: tax,
    discount: formatPrice(discount),
    discountRaw: discount,
    total: formatPrice(total),
    totalRaw: total,
    itemCount,
    freeShipping: subtotal > 50,
    promoApplied: discount > 0,
  }
}

export default function CartPage() {
  const navigate = useNavigate()
  const { cart, updateQty, removeFromCart, clearCart } = useCart()
  const [items, setItems] = useState([])
  const [promoCode, setPromoCode] = useState('')
  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')
  const [ordered, setOrdered] = useState(false)
  const [ordering, setOrdering] = useState(false)
  const [totals, setTotals] = useState({
    subtotal: '$0',
    subtotalRaw: 0,
    shipping: '$0',
    shippingRaw: 0,
    tax: '$0',
    taxRaw: 0,
    discount: '$0',
    discountRaw: 0,
    total: '$0',
    totalRaw: 0,
    itemCount: 0,
    freeShipping: false,
    promoApplied: false,
  })

  useEffect(() => {
    setItems(cart || [])
    setTotals(calculateCartTotals(cart || [], promoCode))
  }, [cart, promoCode])

  function handleUpdateQty(id, format, qty) {
    if (qty < 1) {
      handleRemove(id, format)
      return
    }
    updateQty(id, format, qty)
  }

  function handleRemove(id, format) {
    removeFromCart(id, format)
  }

  function applyPromo() {
    const VALID = ['KIDDLE10', 'SUNLIT', 'BOOKCLUB']
    if (VALID.includes(promoInput.toUpperCase())) {
      setPromoCode(promoInput.toUpperCase())
      setPromoError('')
    } else {
      setPromoError('Invalid promo code. Try KIDDLE10, SUNLIT, or BOOKCLUB.')
    }
  }

  function handleOrder() {
    setOrdering(true)
    setTimeout(() => {
      setOrdering(false)
      setOrdered(true)
      clearCart()
    }, 2000)
  }

  if (ordered) {
    return (
      <div className="bg-[#f5f0e8] min-h-screen pt-[68px] flex items-center justify-center p-5">
        <div className="text-center max-w-[90%] w-[400px] p-8 bg-white/60 border border-[rgba(200,170,130,0.28)] rounded-3xl backdrop-blur-md">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="font-['Playfair_Display',serif] text-2xl text-[#3d2010] mb-2.5">Order Placed!</h2>
          <p className="text-[13.5px] text-[#7a5c3a] font-['DM_Sans',sans-serif] leading-relaxed mb-6">
            Your books are on their way. We'll send a confirmation to your email shortly.
          </p>
          <button
            onClick={() => navigate('/books')}
            className="inline-flex items-center gap-2 bg-[#a0693a] text-white px-7 py-3 rounded-2xl text-[13px] font-semibold font-['DM_Sans',sans-serif] border-none cursor-pointer hover:bg-[#8a5830] transition"
          >
            Continue Shopping →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f5f0e8] min-h-screen pt-[68px]">
      <div className="cart-container px-4 py-5 pb-10 md:px-6 lg:px-8 lg:max-w-[1280px] lg:mx-auto">
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="back-button inline-flex items-center gap-1.5 bg-none border-none cursor-pointer text-sm text-[#a0693a] font-medium font-['DM_Sans',sans-serif] py-2 mb-5 lg:mb-8 hover:text-[#8a5830] transition"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        {/* Header */}
        <div className="cart-header mb-6 lg:mb-8">
          <h1 className="font-['Playfair_Display',serif] text-[28px] font-bold text-[#3d2010] mb-2">
            Your Reading List
          </h1>
          <p className="text-[13px] text-[#9a7a5a] font-['DM_Sans',sans-serif]">
            {items.length === 0
              ? 'Your cart is empty.'
              : `${totals.itemCount} item${totals.itemCount !== 1 ? 's' : ''} ready for checkout`}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="empty-cart text-center py-[60px] px-5 bg-white/60 border border-[rgba(200,170,130,0.25)] rounded-2xl">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="font-['Playfair_Display',serif] text-xl text-[#3d2010] mb-2">Your list is empty</h3>
            <p className="text-[13px] text-[#9a7a5a] mb-6">Discover books that will spark your imagination.</p>
            <button
              onClick={() => navigate('/books')}
              className="inline-flex gap-2 items-center bg-[#a0693a] text-white px-7 py-3 rounded-2xl text-[13px] font-semibold font-['DM_Sans',sans-serif] border-none cursor-pointer hover:bg-[#8a5830] transition"
            >
              Discover Books →
            </button>
          </div>
        ) : (
          <>
            {/* Desktop 2-column layout, mobile stacked */}
            <div className="cart-layout flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-start">
              {/* Left Column - Cart Items */}
              <div className="cart-items-section w-full lg:flex-[2]">
                {/* Cart Items List */}
                <div className="flex flex-col gap-3">
                  {items.map((item, index) => (
                    <CartItem
                      key={`${item._id}-${item.format || 'print'}-${index}`}
                      item={item}
                      onUpdateQty={handleUpdateQty}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>

                {/* Promo Code Section - Mobile only */}
                <div className="promo-mobile block lg:hidden bg-white/60 border border-[rgba(200,170,130,0.25)] rounded-xl p-4 mt-5">
                  <div className="flex gap-2 flex-wrap">
                    <input
                      value={promoInput}
                      onChange={e => setPromoInput(e.target.value)}
                      placeholder="Discount Code"
                      className="flex-1 p-3 text-sm bg-white/70 border border-[rgba(180,140,90,0.28)] rounded-xl outline-none font-['DM_Sans',sans-serif]"
                    />
                    <button
                      onClick={applyPromo}
                      className="px-5 py-3 bg-[#a0693a] text-white border-none rounded-xl cursor-pointer text-[13px] font-semibold font-['DM_Sans',sans-serif] hover:bg-[#8a5830] transition"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-xs text-[#b43c1e] mt-2">{promoError}</p>
                  )}
                  {totals.promoApplied && (
                    <div className="flex items-center gap-2 bg-[rgba(60,140,80,0.10)] rounded-lg p-2.5 mt-3 text-xs text-[#2d7a45]">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6" stroke="#2d7a45" strokeWidth="1.2"/>
                        <path d="M4.5 7l2 2 3-3" stroke="#2d7a45" strokeWidth="1.3" strokeLinecap="round"/>
                      </svg>
                      Promo code applied — {totals.discount} off
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Order Summary */}
              <div className="order-summary-section w-full lg:flex-1 lg:sticky lg:top-[100px]">
                <div className="bg-white/60 border border-[rgba(200,170,130,0.28)] rounded-xl p-5">
                  <h3 className="font-['Playfair_Display',serif] text-lg font-semibold text-[#3d2010] mb-4">
                    Order Summary
                  </h3>

                  {/* Promo Code Section - Desktop only */}
                  <div className="promo-desktop hidden lg:block mb-5">
                    <div className="flex gap-2 flex-wrap">
                      <input
                        value={promoInput}
                        onChange={e => setPromoInput(e.target.value)}
                        placeholder="Discount Code"
                        className="flex-1 p-2.5 text-[13px] bg-white/70 border border-[rgba(180,140,90,0.28)] rounded-lg outline-none font-['DM_Sans',sans-serif]"
                      />
                      <button
                        onClick={applyPromo}
                        className="px-4 py-2.5 bg-[#a0693a] text-white border-none rounded-lg cursor-pointer text-xs font-semibold font-['DM_Sans',sans-serif] hover:bg-[#8a5830] transition"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-[11px] text-[#b43c1e] mt-2">{promoError}</p>
                    )}
                    {totals.promoApplied && (
                      <div className="flex items-center gap-1.5 bg-[rgba(60,140,80,0.10)] rounded-lg p-2 mt-2.5 text-[11px] text-[#2d7a45]">
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6" stroke="#2d7a45" strokeWidth="1.2"/>
                          <path d="M4.5 7l2 2 3-3" stroke="#2d7a45" strokeWidth="1.3" strokeLinecap="round"/>
                        </svg>
                        {totals.discount} off applied
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between mb-2.5 text-[13px] text-[#7a5c3a]">
                      <span>Subtotal</span>
                      <span>{totals.subtotal}</span>
                    </div>
                    <div className="flex justify-between mb-2.5 text-[13px] text-[#7a5c3a]">
                      <span>Shipping</span>
                      <span>{totals.shipping}</span>
                    </div>
                    <div className="flex justify-between mb-2.5 text-[13px] text-[#7a5c3a]">
                      <span>Tax (8%)</span>
                      <span>{totals.tax}</span>
                    </div>
                    {totals.promoApplied && (
                      <div className="flex justify-between mb-2.5 text-[13px] text-[#2d7a45]">
                        <span>Discount</span>
                        <span>-{totals.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-[rgba(180,140,90,0.2)] pt-3 mt-2 text-base font-bold text-[#3d2010]">
                      <span>Total</span>
                      <span className="text-[#a0693a]">{totals.total}</span>
                    </div>
                  </div>

                  {!totals.freeShipping && totals.subtotalRaw < 50 && (
                    <div className="bg-[rgba(160,105,58,0.08)] p-2.5 rounded-lg mb-4 text-center text-xs text-[#7a4e22]">
                      🚚 Add ${(50 - totals.subtotalRaw).toFixed(2)} more for FREE shipping
                    </div>
                  )}

                  <button
                    onClick={handleOrder}
                    disabled={ordering}
                    className={`
                      w-full py-3.5 rounded-xl text-[15px] font-bold font-['DM_Sans',sans-serif] transition
                      ${ordering 
                        ? 'bg-[rgba(160,105,58,0.5)] cursor-not-allowed' 
                        : 'bg-[#a0693a] cursor-pointer hover:bg-[#8a5830]'}
                      text-white border-none
                    `}
                  >
                    {ordering ? 'Processing...' : 'Complete Purchase'}
                  </button>

                  {/* Continue Shopping - Desktop only */}
                  <button
                    onClick={() => navigate('/books')}
                    className="continue-shopping hidden lg:block w-full text-center text-[#a0693a] text-xs font-medium font-['DM_Sans',sans-serif] bg-none border-none cursor-pointer py-3 mt-3 hover:text-[#8a5830] transition"
                  >
                    ← Continue Shopping
                  </button>
                </div>
              </div>
            </div>

            {/* Continue Shopping - Mobile only */}
            <button
              onClick={() => navigate('/books')}
              className="continue-shopping-mobile lg:hidden text-center text-[#a0693a] text-[13px] font-medium font-['DM_Sans',sans-serif] bg-none border-none cursor-pointer py-3 mt-3 hover:text-[#8a5830] transition"
            >
              ← Continue Shopping
            </button>
          </>
        )}
      </div>
    </div>
  )
}