
import { useState } from 'react'
import { useCart }  from '../context/CartContext'
import { formatCartTotal, formatPrice, clamp } from '../utils/formatPrice'

const MOCK_CART_ITEMS = [
  { _id:'b1', title:'The Architecture of Light', author:'Julian Thorne',  price:42.50, salePrice:42.50, format:'Hardcover', qty:1, coverColor:'#c8d8e8' },
  { _id:'b2', title:'Wildwood Whispers',          author:'Elena Rosewood', price:28.00, salePrice:28.00, format:'Hardcover', qty:2, coverColor:'#d8e8c0' },
  { _id:'b3', title:'Sunlit Memories',            author:'Marcus Aurelius', price:19.99, salePrice:19.99, format:'Hardcover', qty:1, coverColor:'#f5d5a8' },
]

const PAYMENT_METHODS = ['CARD', 'PAYPAL']

function CartItem({ item, onUpdateQty, onRemove }) {
  const [removing, setRemoving] = useState(false)

  function handleRemove() {
    setRemoving(true)
    setTimeout(() => onRemove(item._id, item.format), 350)
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '16px',
      padding: '18px 20px',
      background: 'rgba(255,255,255,0.58)',
      border: '1px solid rgba(200,170,130,0.28)',
      borderRadius: '18px',
      backdropFilter: 'blur(12px)',
      transition: 'opacity 0.35s ease, transform 0.35s ease',
      opacity: removing ? 0 : 1,
      transform: removing ? 'translateX(20px)' : 'none',
    }}>
      {/* Cover */}
      <div style={{
        width: '64px', height: '90px', borderRadius: '10px', flexShrink: 0,
        background: item.coverColor || 'linear-gradient(145deg,#f5d5a8,#e0a870)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '3px 4px 12px rgba(100,60,20,0.18)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '8px',
          background: 'rgba(0,0,0,0.14)', borderRadius: '4px 0 0 4px',
        }}/>
        {item.coverImage ? (
          <img src={item.coverImage} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.6, marginLeft: '4px' }}>
            <path d="M4 19V5a2 2 0 012-2h13a1 1 0 011 1v13" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M4 19a2 2 0 002 2h14" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Playfair Display',serif",
          fontSize: '14.5px', fontWeight: '600', color: '#3d2010',
          marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {item.title}
        </div>
        <div style={{ fontSize: '12px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif", marginBottom: '8px' }}>
          by {item.author}
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: 'rgba(160,105,58,0.09)', borderRadius: '10px',
          padding: '2px 9px', fontSize: '10.5px', color: '#9a6030',
          fontFamily: "'DM Sans',sans-serif", fontWeight: '500',
        }}>
          {item.format}
        </div>
      </div>

      {/* Price */}
      <div style={{
        fontSize: '15px', fontWeight: '700', color: '#7a4e22',
        fontFamily: "'DM Sans',sans-serif", flexShrink: 0,
        textAlign: 'right', minWidth: '60px',
      }}>
        {formatPrice((item.salePrice ?? item.price) * item.qty)}
      </div>

      {/* Qty stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', flexShrink: 0 }}>
        <button
          onClick={() => onUpdateQty(item._id, item.format, item.qty - 1)}
          style={{
            width: '30px', height: '30px',
            background: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(180,140,90,0.28)', borderRight: 'none',
            borderRadius: '8px 0 0 8px', cursor: 'pointer',
            fontSize: '15px', color: '#7a4e22',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          −
        </button>
        <div style={{
          width: '36px', height: '30px',
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(180,140,90,0.28)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: '600', color: '#3d2010',
          fontFamily: "'DM Sans',sans-serif",
        }}>
          {item.qty}
        </div>
        <button
          onClick={() => onUpdateQty(item._id, item.format, item.qty + 1)}
          style={{
            width: '30px', height: '30px',
            background: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(180,140,90,0.28)', borderLeft: 'none',
            borderRadius: '0 8px 8px 0', cursor: 'pointer',
            fontSize: '15px', color: '#7a4e22',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          +
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={handleRemove}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#c4a882', flexShrink: 0, padding: '4px',
          display: 'flex', alignItems: 'center', gap: '4px',
          fontSize: '12px', fontFamily: "'DM Sans',sans-serif",
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#b43c1e'}
        onMouseLeave={e => e.currentTarget.style.color = '#c4a882'}
      >
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <path d="M2 3.5h10M5.5 3.5V2.5a1 1 0 011-1h1a1 1 0 011 1v1M6 6v4M8 6v4M3 3.5l.7 7.5a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Remove
      </button>
    </div>
  )
}

export default function CartPage() {
  const { cart: ctxCart, updateQty, removeFromCart, clearCart } = useCart()
  const [items, setItems] = useState(MOCK_CART_ITEMS) // use ctxCart in production
  const [promoCode, setPromoCode]     = useState('')
  const [promoInput, setPromoInput]   = useState('')
  const [promoError, setPromoError]   = useState('')
  const [payMethod, setPayMethod]     = useState('CARD')
  const [ordered, setOrdered]         = useState(false)
  const [ordering, setOrdering]       = useState(false)

  const totals = formatCartTotal(items, promoCode)

  function handleUpdateQty(id, format, qty) {
    if (qty < 1) { handleRemove(id, format); return }
    setItems(prev => prev.map(i => i._id === id && i.format === format ? { ...i, qty } : i))
  }

  function handleRemove(id, format) {
    setItems(prev => prev.filter(i => !(i._id === id && i.format === format)))
  }

  function applyPromo() {
    const VALID = ['KIDDLE10','SUNLIT','BOOKCLUB']
    if (VALID.includes(promoInput.toUpperCase())) {
      setPromoCode(promoInput.toUpperCase())
      setPromoError('')
    } else {
      setPromoError('Invalid promo code. Try KIDDLE10 or SUNLIT.')
    }
  }

  function handleOrder() {
    setOrdering(true)
    setTimeout(() => { setOrdering(false); setOrdered(true) }, 2000)
  }

  if (ordered) {
    return (
      <div style={{
        background: '#f5f0e8', minHeight: '100vh', paddingTop: '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          textAlign: 'center', maxWidth: '440px', padding: '40px',
          background: 'rgba(255,255,255,0.6)',
          border: '1px solid rgba(200,170,130,0.28)',
          borderRadius: '28px', backdropFilter: 'blur(16px)',
          boxShadow: '0 20px 60px rgba(100,60,20,0.12)',
        }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>📦</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '26px', color: '#3d2010', marginBottom: '10px' }}>
            Order Placed!
          </h2>
          <p style={{ fontSize: '13.5px', color: '#7a5c3a', fontFamily: "'DM Sans',sans-serif", lineHeight: 1.7, marginBottom: '24px' }}>
            Your books are on their way. We'll send a confirmation to your email shortly. Happy reading!
          </p>
          <a href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#a0693a', color: '#fff',
            padding: '12px 28px', borderRadius: '24px',
            fontSize: '13px', fontWeight: '600',
            fontFamily: "'DM Sans',sans-serif", textDecoration: 'none',
          }}>
            Continue Shopping →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh', paddingTop: '68px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 40px' }}>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '12px',
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 'clamp(24px,3.5vw,34px)', fontWeight: '700',
              color: '#3d2010', marginBottom: '6px',
            }}>
              Your Reading List
            </h1>
            <p style={{ fontSize: '13px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif" }}>
              {items.length === 0
                ? 'Your cart is empty.'
                : `You have ${totals.itemCount} item${totals.itemCount !== 1 ? 's' : ''} ready for checkout.`}
            </p>
          </div>
          <a href="/books" style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontSize: '12.5px', color: '#a0693a', fontWeight: '600',
            fontFamily: "'DM Sans',sans-serif", textDecoration: 'none',
          }}>
            ← Back to Shop
          </a>
        </div>

        {items.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 20px',
            background: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(200,170,130,0.25)',
            borderRadius: '24px', backdropFilter: 'blur(12px)',
          }}>
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>📚</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '22px', color: '#3d2010', marginBottom: '8px' }}>Your list is empty</h3>
            <p style={{ fontSize: '13.5px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif", marginBottom: '24px' }}>
              Discover books that will spark your imagination.
            </p>
            <a href="/books" style={{
              display: 'inline-flex', gap: '8px', alignItems: 'center',
              background: '#a0693a', color: '#fff',
              padding: '12px 28px', borderRadius: '24px',
              fontSize: '13px', fontWeight: '600',
              fontFamily: "'DM Sans',sans-serif", textDecoration: 'none',
            }}>
              Discover Books →
            </a>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}
            className="cart-grid"
          >
            {/* Left — items */}
            <div>
              {/* Free shipping notice */}
              {totals.freeShipping ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: 'rgba(60,140,80,0.10)',
                  border: '1px solid rgba(60,140,80,0.25)',
                  borderRadius: '14px', padding: '12px 16px', marginBottom: '18px',
                }}>
                  <span style={{ fontSize: '16px' }}>🚚</span>
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: '600', color: '#2d7a45', fontFamily: "'DM Sans',sans-serif" }}>
                      Free Express Shipping
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#5a9060', fontFamily: "'DM Sans',sans-serif" }}>
                      Apply the code <strong>SUNLIT</strong> at checkout for an extra 15% off.
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      value={promoInput}
                      onChange={e => setPromoInput(e.target.value)}
                      placeholder="Discount Code"
                      style={{
                        padding: '7px 12px', fontSize: '12px',
                        background: 'rgba(255,255,255,0.7)',
                        border: '1px solid rgba(180,140,90,0.28)',
                        borderRadius: '10px', outline: 'none',
                        fontFamily: "'DM Sans',sans-serif", color: '#3d2f1f',
                        width: '130px',
                      }}
                    />
                    <button onClick={applyPromo} style={{
                      padding: '7px 14px', background: 'rgba(255,255,255,0.7)',
                      border: '1px solid rgba(180,140,90,0.35)',
                      borderRadius: '10px', cursor: 'pointer',
                      fontSize: '12px', fontWeight: '600', color: '#7a4e22',
                      fontFamily: "'DM Sans',sans-serif",
                    }}>
                      Apply
                    </button>
                  </div>
                </div>
              ) : null}
              {promoError && (
                <p style={{ fontSize: '11.5px', color: '#b43c1e', fontFamily: "'DM Sans',sans-serif", marginBottom: '12px' }}>
                  {promoError}
                </p>
              )}
              {totals.promoApplied && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(60,140,80,0.10)', borderRadius: '12px',
                  padding: '8px 14px', marginBottom: '14px', fontSize: '12px', color: '#2d7a45',
                  fontFamily: "'DM Sans',sans-serif",
                }}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#2d7a45" strokeWidth="1.2"/><path d="M4.5 7l2 2 3-3" stroke="#2d7a45" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Promo code <strong>{promoCode}</strong> applied — {totals.promoDiscount}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {items.map(item => (
                  <CartItem
                    key={`${item._id}-${item.format}`}
                    item={item}
                    onUpdateQty={handleUpdateQty}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </div>

            {/* Right — order summary */}
            <div style={{
              background: 'rgba(255,255,255,0.58)',
              border: '1px solid rgba(200,170,130,0.28)',
              borderRadius: '22px', padding: '24px',
              backdropFilter: 'blur(14px)',
              position: 'sticky', top: '84px',
              boxShadow: '0 8px 32px rgba(100,60,20,0.10)',
            }}>
              {/* Delivery address */}
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(180,140,90,0.15)' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '14px',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    fontSize: '13px', fontWeight: '600', color: '#3d2010',
                    fontFamily: "'DM Sans',sans-serif",
                  }}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1C4.8 1 3 2.8 3 5c0 3.3 4 8 4 8s4-4.7 4-8c0-2.2-1.8-4-4-4Z" stroke="#a0693a" strokeWidth="1.3"/>
                      <circle cx="7" cy="5" r="1.3" fill="#a0693a"/>
                    </svg>
                    Delivery Address
                  </div>
                  <button style={{
                    fontSize: '11.5px', color: '#a0693a', background: 'none', border: 'none',
                    cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontWeight: '600',
                  }}>
                    Edit
                  </button>
                </div>
                {[
                  { placeholder: 'Full Name',    val: 'Eleanor Vance' },
                  { placeholder: 'Street',       val: '42 Nightingale Lane, Apt 4B' },
                ].map(({ placeholder, val }) => (
                  <input key={placeholder} defaultValue={val} placeholder={placeholder} style={{
                    width: '100%', padding: '9px 13px', marginBottom: '8px',
                    background: 'rgba(255,255,255,0.65)',
                    border: '1px solid rgba(180,140,90,0.25)',
                    borderRadius: '10px', fontSize: '12.5px', color: '#3d2f1f',
                    fontFamily: "'DM Sans',sans-serif", outline: 'none',
                    display: 'block',
                  }}/>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[{ val: 'London' }, { val: 'SW1A 1AA' }].map(({ val }, i) => (
                    <input key={i} defaultValue={val} style={{
                      padding: '9px 13px',
                      background: 'rgba(255,255,255,0.65)',
                      border: '1px solid rgba(180,140,90,0.25)',
                      borderRadius: '10px', fontSize: '12.5px', color: '#3d2f1f',
                      fontFamily: "'DM Sans',sans-serif", outline: 'none',
                    }}/>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(180,140,90,0.15)' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  fontSize: '13px', fontWeight: '600', color: '#3d2010',
                  fontFamily: "'DM Sans',sans-serif", marginBottom: '14px',
                }}>
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="#a0693a" strokeWidth="1.3"/>
                    <path d="M1 6h12" stroke="#a0693a" strokeWidth="1.3"/>
                  </svg>
                  Payment Method
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  {PAYMENT_METHODS.map(m => (
                    <button key={m} onClick={() => setPayMethod(m)} style={{
                      flex: 1, padding: '8px',
                      background: payMethod === m ? 'rgba(160,105,58,0.14)' : 'rgba(255,255,255,0.6)',
                      border: `1.5px solid ${payMethod === m ? '#a0693a' : 'rgba(180,140,90,0.28)'}`,
                      borderRadius: '10px', cursor: 'pointer',
                      fontSize: '12px', fontWeight: payMethod === m ? '700' : '400',
                      color: payMethod === m ? '#5c3520' : '#7a5c3a',
                      fontFamily: "'DM Sans',sans-serif",
                    }}>
                      {m}
                    </button>
                  ))}
                </div>
                {payMethod === 'CARD' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '9px 13px',
                      background: 'rgba(255,255,255,0.65)',
                      border: '1px solid rgba(180,140,90,0.25)',
                      borderRadius: '10px', fontSize: '12.5px', color: '#9a7a5a',
                      fontFamily: "'DM Sans',sans-serif",
                    }}>
                      <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="8" rx="1.5" stroke="#9a7a5a" strokeWidth="1.2"/><path d="M1 6h12" stroke="#9a7a5a" strokeWidth="1.2"/></svg>
                      **** **** **** 4821
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <input defaultValue="12/26" placeholder="MM/YY" style={{ padding: '9px 13px', background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(180,140,90,0.25)', borderRadius: '10px', fontSize: '12.5px', color: '#3d2f1f', fontFamily: "'DM Sans',sans-serif", outline: 'none' }}/>
                      <input defaultValue="***" placeholder="CVV" style={{ padding: '9px 13px', background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(180,140,90,0.25)', borderRadius: '10px', fontSize: '12.5px', color: '#3d2f1f', fontFamily: "'DM Sans',sans-serif", outline: 'none' }}/>
                    </div>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div style={{ marginBottom: '20px' }}>
                {[
                  { label: 'Items Subtotal',         val: totals.subtotal },
                  { label: 'Shipping & Handling',    val: totals.shipping },
                  { label: `Estimated Tax (8%)`,     val: totals.tax      },
                  totals.promoApplied ? { label: 'Promo Discount', val: `-${totals.promoDiscount.split('-')[1]?.trim() || ''}`, green: true } : null,
                ].filter(Boolean).map(({ label, val, green }) => (
                  <div key={label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: '12.5px', fontFamily: "'DM Sans',sans-serif",
                    color: green ? '#2d7a45' : '#7a5c3a',
                    marginBottom: '8px',
                  }}>
                    <span>{label}</span>
                    <span style={{ fontWeight: '500' }}>{val}</span>
                  </div>
                ))}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  borderTop: '1px solid rgba(180,140,90,0.2)',
                  paddingTop: '12px', marginTop: '4px',
                  fontSize: '15px', fontWeight: '700', color: '#3d2010',
                  fontFamily: "'DM Sans',sans-serif",
                }}>
                  <span>Total Order</span>
                  <span style={{ color: '#a0693a' }}>{totals.total}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleOrder}
                disabled={ordering}
                style={{
                  width: '100%', padding: '15px',
                  background: ordering ? 'rgba(160,105,58,0.5)' : '#a0693a',
                  color: '#fff', border: 'none', borderRadius: '16px',
                  fontSize: '14px', fontWeight: '700',
                  fontFamily: "'DM Sans',sans-serif",
                  cursor: ordering ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  transition: 'all 0.2s', marginBottom: '12px',
                  boxShadow: ordering ? 'none' : '0 6px 20px rgba(160,105,58,0.35)',
                }}
              >
                {ordering ? 'Processing…' : 'Complete Purchase'}
              </button>

              <p style={{
                fontSize: '10.5px', color: '#b09070',
                fontFamily: "'DM Sans',sans-serif",
                textAlign: 'center', lineHeight: 1.6,
              }}>
                By completing your purchase, you agree to Kiddle Bookshop's Terms of Service and Privacy Policy. Secure payment handled by SunlitPay.
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr !important }
        }
      `}</style>
    </div>
  )
}