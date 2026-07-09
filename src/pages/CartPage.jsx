// CartPage.jsx
// Checkout flow: Cart → Checkout Drawer → Emails via EmailJS (shop + customer)

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";
import emailjs from "@emailjs/browser";

// ─── EmailJS configuration (from .env) ───────────────────────────────────────
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_SHOP = import.meta.env.VITE_EMAILJS_TEMPLATE_SHOP;
const EMAILJS_TEMPLATE_CUSTOMER = import.meta.env
  .VITE_EMAILJS_TEMPLATE_CUSTOMER;

// Initialize EmailJS once
emailjs.init(EMAILJS_PUBLIC_KEY);

const FREE_SHIPPING_THRESHOLD = 5000;
const SHIPPING_FEE = 300;
const SHOP_EMAIL = "orders@kiddle.com";

// ─── Cover colors (unchanged) ────────────────────────────────────────────────
function getCoverColor(book) {
  const colors = {
    "The Midnight Library": "#8aaccb",
    "Before the Coffee Gets Cold": "#e8d5b8",
    "Where the Crawdads Sing": "#a89060",
    "The Lion's Secret Garden": "#7ab080",
    "Klara and the Sun": "#c8b8a0",
    "Stars & Beyond": "#2a4a6a",
    "The Forest Alphabet": "#6a9a6a",
    "Wings of Tomorrow": "#c4a060",
    "The Starless Sea": "#4a6a8a",
    "Wildwood Whispers": "#5a8a6a",
    "Mathematics Grade 7": "#d4a050",
    "Colours of the Sky": "#8aaccb",
    "Things Fall Apart": "#a06030",
    "English Workbook Grade 4": "#6a9a8a",
    "Science & Tech Grade 6": "#4a7a6a",
    "Social Studies Grade 3": "#d4a060",
  };
  return colors[book.title] || "#e0a870";
}

// ─── Helpers (unchanged) ─────────────────────────────────────────────────────
function calculateCartTotals(items, promoCode = null) {
  const subtotal = items.reduce((sum, item) => {
    const price = item.salePrice ?? item.price;
    return sum + price * item.qty;
  }, 0);
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = subtotal * 0.08;
  let discount = 0;
  if (promoCode === "KIDDLE10") discount = subtotal * 0.1;
  if (promoCode === "SUNLIT") discount = subtotal * 0.15;
  const total = subtotal + shipping + tax - discount;
  return {
    subtotal: formatPrice(subtotal),
    subtotalRaw: subtotal,
    shipping: shipping === 0 ? "Free" : formatPrice(shipping),
    shippingRaw: shipping,
    tax: formatPrice(tax),
    taxRaw: tax,
    discount: formatPrice(discount),
    discountRaw: discount,
    total: formatPrice(total),
    totalRaw: total,
    itemCount,
    freeShipping: subtotal >= FREE_SHIPPING_THRESHOLD,
    promoApplied: discount > 0,
  };
}

/** Build a plain-text order summary for emails */
function buildOrderSummary(items, totals) {
  const lines = items.map(
    (item) =>
      `  • ${item.title} (${item.format || "Print"}) x${item.qty} — ${formatPrice((item.salePrice ?? item.price) * item.qty)}`,
  );
  return [
    "─────────────────────────────",
    "ORDER DETAILS",
    "─────────────────────────────",
    ...lines,
    "",
    `Subtotal : ${totals.subtotal}`,
    `Shipping : ${totals.shipping}`,
    `Tax (8%) : ${totals.tax}`,
    totals.promoApplied ? `Discount : -${totals.discount}` : null,
    `TOTAL    : ${totals.total}`,
    "─────────────────────────────",
  ]
    .filter((l) => l !== null)
    .join("\n");
}

// ─── CartItem, QtyControl, RemoveBtn (completely unchanged) ──────────────────
function CartItem({ item, onUpdateQty, onRemove }) {
  const [removing, setRemoving] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const price = (item.salePrice ?? item.price) * item.qty;
  const coverColor = getCoverColor(item);

  function handleRemove() {
    setRemoving(true);
    setTimeout(() => onRemove(item._id, item.format), 350);
  }

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-start gap-4 p-4 bg-white/60 backdrop-blur-sm border border-[rgba(200,170,130,0.28)] rounded-xl transition-all duration-350 ${removing ? "opacity-0 translate-x-5" : "opacity-100 translate-x-0"}`}
    >
      <Link
        to={`/book/${item.slug}`}
        className="flex-shrink-0 self-center sm:self-start"
      >
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
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                className="opacity-60"
              >
                <path
                  d="M4 19V5a2 2 0 012-2h13a1 1 0 011 1v13"
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M4 19a2 2 0 002 2h14"
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </div>
      </Link>

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
            {item.format || "Print"}
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

        {/* Mobile layout */}
        <div className="flex flex-col sm:hidden gap-3">
          <div className="flex items-center justify-between">
            <div className="text-[17px] font-bold text-[#7a4e22] font-['DM_Sans',sans-serif]">
              {formatPrice(price)}
            </div>
            <QtyControl item={item} onUpdateQty={onUpdateQty} />
          </div>
          <RemoveBtn onClick={handleRemove} full />
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:flex items-center justify-between gap-3 flex-wrap">
          <div className="text-[17px] font-bold text-[#7a4e22] font-['DM_Sans',sans-serif]">
            {formatPrice(price)}
          </div>
          <div className="flex items-center gap-2">
            <QtyControl item={item} onUpdateQty={onUpdateQty} />
            <RemoveBtn onClick={handleRemove} />
          </div>
        </div>
      </div>
    </div>
  );
}

function QtyControl({ item, onUpdateQty }) {
  const btn =
    "w-[34px] h-[34px] bg-white/60 border border-[rgba(180,140,90,0.28)] cursor-pointer text-lg text-[#7a4e22] flex items-center justify-center hover:bg-white/80 transition";
  return (
    <div className="flex items-center">
      <button
        onClick={() => onUpdateQty(item._id, item.format, item.qty - 1)}
        className={`${btn} border-r-0 rounded-l-lg`}
      >
        −
      </button>
      <div className="w-11 h-[34px] bg-white/70 border border-[rgba(180,140,90,0.28)] flex items-center justify-center text-sm font-semibold text-[#3d2010] font-['DM_Sans',sans-serif]">
        {item.qty}
      </div>
      <button
        onClick={() => onUpdateQty(item._id, item.format, item.qty + 1)}
        className={`${btn} border-l-0 rounded-r-lg`}
      >
        +
      </button>
    </div>
  );
}

function RemoveBtn({ onClick, full }) {
  return (
    <button
      onClick={onClick}
      className={`bg-none border border-[rgba(180,140,90,0.28)] cursor-pointer text-[#c4a882] py-2.5 flex items-center justify-center gap-1.5 text-xs font-['DM_Sans',sans-serif] transition-colors hover:text-[#b43c1e] hover:border-[rgba(180,100,60,0.4)] rounded-lg ${full ? "w-full" : "px-3 border-none"}`}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M2 3.5h10M5.5 3.5V2.5a1 1 0 011-1h1a1 1 0 011 1v1M6 6v4M8 6v4M3 3.5l.7 7.5a1 1 0 001 .9h4.6a1 1 0 001-.9l.7-7.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>Remove</span>
    </button>
  );
}

// ─── Checkout Drawer (EmailJS integration) ────────────────────────────────────
const EMPTY_DETAILS = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  notes: "",
};

function CheckoutDrawer({ open, onClose, items, totals, onSuccess }) {
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [status, setStatus] = useState("idle");
  const [errMsg, setErrMsg] = useState("");
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handler(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const set = (field) => (e) =>
    setDetails((p) => ({ ...p, [field]: e.target.value }));

  const ready =
    details.name.trim() &&
    details.email.trim() &&
    details.phone.trim() &&
    details.address.trim() &&
    details.city.trim();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setErrMsg("");

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(details.email)) {
      setErrMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    const orderSummary = buildOrderSummary(items, totals);
    const orderId = `KDL-${Date.now().toString(36).toUpperCase()}`;
    const firstName = details.name.split(" ")[0];

    const shopParams = {
      order_id: orderId,
      customer_name: details.name,
      customer_email: details.email,
      customer_phone: details.phone,
      customer_address: details.address,
      customer_city: details.city,
      customer_notes: details.notes || "",
      order_summary: orderSummary,
    };

    const customerParams = {
      order_id: orderId,
      customer_first_name: firstName,
      customer_name: details.name,
      customer_email: details.email,
      customer_phone: details.phone,
      customer_address: details.address,
      customer_city: details.city,
      customer_notes: details.notes || "",
      order_summary: orderSummary,
      order_total: totals.total.toString(),
    };

    try {
      // Send shop email
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_SHOP, shopParams);
      // Send customer email
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_CUSTOMER,
        customerParams,
      );

      setStatus("idle");
      setDetails(EMPTY_DETAILS);
      onSuccess(orderId);
    } catch (err) {
      console.error("EmailJS error:", err);
      let userMessage = "Failed to send order confirmation. ";
      if (err.text) userMessage += err.text;
      else if (err.message) userMessage += err.message;
      setErrMsg(userMessage);
      setStatus("error");
    }
  }
  const input = `w-full px-3.5 py-2.5 text-[13.5px] text-[#3d2010] font-['DM_Sans',sans-serif]
    bg-white/70 border border-[rgba(180,140,90,0.30)] rounded-xl outline-none
    transition-all duration-200 placeholder:text-[#c4a882]
    focus:border-[rgba(160,105,58,0.55)] focus:shadow-[0_0_0_3px_rgba(160,105,58,0.08)]`;

  const label = `block text-[10.5px] font-bold text-[#a0693a] font-['DM_Sans',sans-serif] tracking-[0.07em] uppercase mb-1.5`;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-[#3d2010]/40 backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-[520px] bg-[#faf6ef] shadow-2xl transition-transform duration-400 ease-in-out flex flex-col ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header (unchanged) */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(200,170,130,0.25)] flex-shrink-0">
          <div>
            <h2 className="font-['Playfair_Display',serif] text-[20px] font-bold text-[#3d2010]">
              Checkout
            </h2>
            <p className="text-[11.5px] text-[#9a7a5a] font-['DM_Sans',sans-serif] mt-0.5">
              {totals.itemCount} item{totals.itemCount !== 1 ? "s" : ""} ·{" "}
              {totals.total}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-[rgba(180,140,90,0.28)] bg-white/60 flex items-center justify-center text-[#9a7a5a] hover:text-[#3d2010] hover:bg-white/90 transition cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 2l10 10M12 2L2 12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Mini order summary strip */}
        <div className="px-6 py-3 bg-[rgba(160,105,58,0.06)] border-b border-[rgba(200,170,130,0.2)] flex-shrink-0 overflow-x-auto">
          <div className="flex gap-2.5 min-w-max">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 bg-white/70 rounded-lg px-2.5 py-1.5 border border-[rgba(200,170,130,0.25)]"
              >
                <span className="text-[11.5px] text-[#3d2010] font-['DM_Sans',sans-serif] font-medium max-w-[120px] truncate">
                  {item.title}
                </span>
                <span className="text-[10px] text-[#a0693a] bg-[rgba(160,105,58,0.1)] rounded px-1.5 py-0.5 font-bold">
                  ×{item.qty}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form (unchanged except error display) */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {status === "error" && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-[rgba(200,60,40,0.08)] border border-[rgba(200,60,40,0.22)] text-[12.5px] text-[#b03020] font-['DM_Sans',sans-serif]">
              {errMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Step 1 */}
            <div className="flex items-center gap-3 mb-1">
              <div className="w-6 h-6 rounded-full bg-[#a0693a] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                1
              </div>
              <span className="text-[12px] font-bold text-[#3d2010] font-['DM_Sans',sans-serif] tracking-wide uppercase">
                Your Details
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Full Name</label>
                <input
                  type="text"
                  value={details.name}
                  onChange={set("name")}
                  placeholder="Jane Mwangi"
                  required
                  className={input}
                />
              </div>
              <div>
                <label className={label}>Email Address</label>
                <input
                  type="email"
                  value={details.email}
                  onChange={set("email")}
                  placeholder="jane@email.com"
                  required
                  className={input}
                />
              </div>
            </div>

            <div>
              <label className={label}>Phone Number</label>
              <input
                type="tel"
                value={details.phone}
                onChange={set("phone")}
                placeholder="+254 7XX XXX XXX"
                required
                className={input}
              />
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-3 mt-1">
              <div className="w-6 h-6 rounded-full bg-[#a0693a] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                2
              </div>
              <span className="text-[12px] font-bold text-[#3d2010] font-['DM_Sans',sans-serif] tracking-wide uppercase">
                Delivery Address
              </span>
            </div>

            <div>
              <label className={label}>Street / Estate</label>
              <input
                type="text"
                value={details.address}
                onChange={set("address")}
                placeholder="12 Mombasa Rd, Westlands"
                required
                className={input}
              />
            </div>

            <div>
              <label className={label}>Town / City</label>
              <input
                type="text"
                value={details.city}
                onChange={set("city")}
                placeholder="Nairobi"
                required
                className={input}
              />
            </div>

            <div>
              <label className={label}>
                Delivery Notes{" "}
                <span className="text-[#c4a882] font-normal normal-case tracking-normal">
                  (optional)
                </span>
              </label>
              <textarea
                value={details.notes}
                onChange={set("notes")}
                placeholder="Any special instructions for delivery…"
                rows={3}
                className={`${input} resize-none`}
              />
            </div>

            {/* Order total recap */}
            <div className="bg-white/60 border border-[rgba(200,170,130,0.28)] rounded-xl p-4 flex flex-col gap-2">
              {[
                { label: "Subtotal", value: totals.subtotal },
                { label: "Shipping", value: totals.shipping },
                { label: "Tax (8%)", value: totals.tax },
                ...(totals.promoApplied
                  ? [
                      {
                        label: "Discount",
                        value: `-${totals.discount}`,
                        green: true,
                      },
                    ]
                  : []),
              ].map(({ label: l, value, green }) => (
                <div key={l} className="flex justify-between text-[12.5px]">
                  <span
                    className={`font-['DM_Sans',sans-serif] ${green ? "text-[#2d7a45]" : "text-[#9a7a5a]"}`}
                  >
                    {l}
                  </span>
                  <span
                    className={`font-['DM_Sans',sans-serif] font-medium ${green ? "text-[#2d7a45]" : "text-[#3d2010]"}`}
                  >
                    {value}
                  </span>
                </div>
              ))}
              <div className="border-t border-[rgba(180,140,90,0.2)] pt-2 mt-1 flex justify-between">
                <span className="font-['DM_Sans',sans-serif] font-bold text-[#3d2010] text-[14px]">
                  Total
                </span>
                <span className="font-['DM_Sans',sans-serif] font-bold text-[#a0693a] text-[14px]">
                  {totals.total}
                </span>
              </div>
            </div>

            {/* M-Pesa instructions (unchanged) */}
            <div className="bg-[rgba(39,174,96,0.06)] border border-[rgba(39,174,96,0.22)] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-[rgba(39,174,96,0.15)] flex items-center justify-center flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"
                      fill="#27ae60"
                    />
                  </svg>
                </div>
                <span className="text-[11.5px] font-bold text-[#1a7a40] font-['DM_Sans',sans-serif] tracking-[0.06em] uppercase">
                  Pay via M-Pesa
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Paybill", value: "516600" },
                  { label: "Account", value: "440441" },
                  { label: "Amount", value: totals.total },
                  { label: "Ref", value: "Your order ID (sent by email)" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-white/70 rounded-lg px-3 py-2 border border-[rgba(39,174,96,0.15)]"
                  >
                    <div className="text-[9.5px] font-bold text-[#27ae60] font-['DM_Sans',sans-serif] tracking-[0.07em] uppercase mb-0.5">
                      {label}
                    </div>
                    <div className="text-[13px] font-bold text-[#1a3a28] font-['DM_Sans',sans-serif]">
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#2d7a45] font-['DM_Sans',sans-serif] mt-2.5 leading-relaxed">
                Place your order first — your unique reference will be emailed
                to you. Use it as the M-Pesa account number.
              </p>
            </div>

            <button
              type="submit"
              disabled={!ready || status === "sending"}
              className={`w-full py-4 rounded-xl text-[14px] font-bold font-['DM_Sans',sans-serif] tracking-[0.03em] border-none transition-all duration-200 flex items-center justify-center gap-2
                ${
                  ready && status !== "sending"
                    ? "bg-[#a0693a] text-white shadow-[0_6px_22px_rgba(160,105,58,0.28)] cursor-pointer hover:bg-[#8a5830] hover:-translate-y-px"
                    : "bg-[rgba(160,105,58,0.3)] text-[rgba(255,255,255,0.65)] cursor-not-allowed"
                }`}
            >
              {status === "sending" ? (
                <>
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="3"
                    />
                    <path
                      d="M12 2a10 10 0 0110 10"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                  Placing Order…
                </>
              ) : (
                <>Place Order · {totals.total}</>
              )}
            </button>

            <p className="text-[11px] text-[#b09070] font-['DM_Sans',sans-serif] text-center leading-relaxed -mt-2">
              A confirmation email with M-Pesa payment details will be sent to
              you.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

// ─── Main CartPage (unchanged except EmailJS import) ──────────────────────────
export default function CartPage() {
  const navigate = useNavigate();
  const { cart, updateQty, removeFromCart, clearCart } = useCart();
  const [items, setItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [totals, setTotals] = useState(calculateCartTotals([]));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (cart) setItems(cart);
    setTotals(calculateCartTotals(cart || [], promoCode));
  }, [cart, promoCode]);

  function handleUpdateQty(id, format, qty) {
    if (qty < 1) {
      removeFromCart(id, format);
      return;
    }
    updateQty(id, format, qty);
  }

  function applyPromo() {
    const VALID = ["KIDDLE10", "SUNLIT", "BOOKCLUB"];
    if (VALID.includes(promoInput.toUpperCase())) {
      setPromoCode(promoInput.toUpperCase());
      setPromoError("");
    } else {
      setPromoError("Invalid code. Try KIDDLE10 or SUNLIT.");
    }
  }

  function handleOrderSuccess(id) {
    setDrawerOpen(false);
    setOrderId(id);
    clearCart();
  }

  // Success screen (unchanged)
  if (orderId) {
    return (
      <div className="bg-[#f5f0e8] min-h-screen pt-[68px] flex items-center justify-center p-5">
        <div className="text-center max-w-[90%] w-[420px] p-8 bg-white/60 border border-[rgba(200,170,130,0.28)] rounded-3xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-full bg-[rgba(160,105,58,0.12)] border-2 border-[rgba(160,105,58,0.3)] flex items-center justify-center text-3xl mx-auto mb-4">
            📦
          </div>
          <h2 className="font-['Playfair_Display',serif] text-2xl text-[#3d2010] mb-1">
            Order Placed!
          </h2>
          <p className="text-[11.5px] text-[#a0693a] font-['DM_Sans',sans-serif] font-bold tracking-widest mb-3">
            {orderId}
          </p>
          <p className="text-[13.5px] text-[#7a5c3a] font-['DM_Sans',sans-serif] leading-relaxed mb-6">
            We've emailed your order confirmation. Our team will reach out
            shortly with delivery details.
          </p>
          <button
            onClick={() => navigate("/books")}
            className="inline-flex items-center gap-2 bg-[#a0693a] text-white px-7 py-3 rounded-2xl text-[13px] font-semibold font-['DM_Sans',sans-serif] border-none cursor-pointer hover:bg-[#8a5830] transition"
          >
            Continue Shopping →
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#f5f0e8] min-h-screen pt-[68px]">
        <div className="px-[clamp(48px,6vw,100px)] py-5 pb-10">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 bg-none border-none cursor-pointer text-sm text-[#a0693a] font-medium font-['DM_Sans',sans-serif] py-2 mb-5 lg:mb-8 hover:text-[#8a5830] transition"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 12L6 8l4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>

          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <h1 className="font-['Playfair_Display',serif] text-[28px] font-bold text-[#3d2010] mb-2">
              Your Reading List
            </h1>
            <p className="text-[13px] text-[#9a7a5a] font-['DM_Sans',sans-serif]">
              {items.length === 0
                ? "Your cart is empty."
                : `${totals.itemCount} item${totals.itemCount !== 1 ? "s" : ""} ready for checkout`}
            </p>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-[60px] px-5 bg-white/60 border border-[rgba(200,170,130,0.25)] rounded-2xl">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="font-['Playfair_Display',serif] text-xl text-[#3d2010] mb-2">
                Your list is empty
              </h3>
              <p className="text-[13px] text-[#9a7a5a] mb-6">
                Discover books that will spark your imagination.
              </p>
              <button
                onClick={() => navigate("/books")}
                className="inline-flex gap-2 items-center bg-[#a0693a] text-white px-7 py-3 rounded-2xl text-[13px] font-semibold font-['DM_Sans',sans-serif] border-none cursor-pointer hover:bg-[#8a5830] transition"
              >
                Discover Books →
              </button>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-6 lg:flex-row lg:gap-8 lg:items-start">
                {/* Left column – items */}
                <div className="w-full lg:flex-[2]">
                  <div className="flex flex-col gap-3">
                    {items.map((item, index) => (
                      <CartItem
                        key={`${item._id}-${item.format || "print"}-${index}`}
                        item={item}
                        onUpdateQty={handleUpdateQty}
                        onRemove={removeFromCart}
                      />
                    ))}
                  </div>
                  <PromoSection
                    promoInput={promoInput}
                    setPromoInput={setPromoInput}
                    applyPromo={applyPromo}
                    promoError={promoError}
                    totals={totals}
                    mobile
                  />
                </div>

                {/* Right column – summary */}
                <div className="w-full lg:flex-1 lg:sticky lg:top-[100px]">
                  <div className="bg-white/60 border border-[rgba(200,170,130,0.28)] rounded-xl p-5">
                    <h3 className="font-['Playfair_Display',serif] text-lg font-semibold text-[#3d2010] mb-4">
                      Order Summary
                    </h3>

                    <PromoSection
                      promoInput={promoInput}
                      setPromoInput={setPromoInput}
                      applyPromo={applyPromo}
                      promoError={promoError}
                      totals={totals}
                    />

                    <div className="mb-4">
                      {[
                        { label: "Subtotal", value: totals.subtotal },
                        { label: "Shipping", value: totals.shipping },
                        { label: "Tax (8%)", value: totals.tax },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="flex justify-between mb-2.5 text-[13px] text-[#7a5c3a]"
                        >
                          <span>{label}</span>
                          <span>{value}</span>
                        </div>
                      ))}
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

                    {!totals.freeShipping && (
                      <div className="bg-[rgba(160,105,58,0.08)] p-2.5 rounded-lg mb-4 text-center text-xs text-[#7a4e22]">
                        🚚 Add{" "}
                        {formatPrice(
                          FREE_SHIPPING_THRESHOLD - totals.subtotalRaw,
                        )}{" "}
                        more for FREE shipping
                      </div>
                    )}

                    <button
                      onClick={() => setDrawerOpen(true)}
                      className="w-full py-3.5 rounded-xl text-[15px] font-bold font-['DM_Sans',sans-serif] bg-[#a0693a] text-white border-none cursor-pointer hover:bg-[#8a5830] transition shadow-[0_6px_22px_rgba(160,105,58,0.22)]"
                    >
                      Proceed to Checkout →
                    </button>

                    <button
                      onClick={() => navigate("/books")}
                      className="hidden lg:block w-full text-center text-[#a0693a] text-xs font-medium font-['DM_Sans',sans-serif] bg-none border-none cursor-pointer py-3 mt-3 hover:text-[#8a5830] transition"
                    >
                      ← Continue Shopping
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/books")}
                className="lg:hidden text-center text-[#a0693a] text-[13px] font-medium font-['DM_Sans',sans-serif] bg-none border-none cursor-pointer py-3 mt-3 hover:text-[#8a5830] transition"
              >
                ← Continue Shopping
              </button>
            </>
          )}
        </div>
      </div>

      <CheckoutDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        items={items}
        totals={totals}
        onSuccess={handleOrderSuccess}
      />
    </>
  );
}

// ─── Promo section (unchanged) ───────────────────────────────────────────────
function PromoSection({
  promoInput,
  setPromoInput,
  applyPromo,
  promoError,
  totals,
  mobile,
}) {
  const wrapper = mobile
    ? "block lg:hidden bg-white/60 border border-[rgba(200,170,130,0.25)] rounded-xl p-4 mt-5"
    : "hidden lg:block mb-5";

  return (
    <div className={wrapper}>
      <div className="flex gap-2 flex-wrap">
        <input
          value={promoInput}
          onChange={(e) => setPromoInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyPromo()}
          placeholder="Discount Code"
          className={`flex-1 text-[13px] bg-white/70 border border-[rgba(180,140,90,0.28)] rounded-${mobile ? "xl" : "lg"} outline-none font-['DM_Sans',sans-serif] px-3 py-${mobile ? "3" : "2.5"}`}
        />
        <button
          onClick={applyPromo}
          className={`px-${mobile ? "5" : "4"} py-${mobile ? "3" : "2.5"} bg-[#a0693a] text-white border-none rounded-${mobile ? "xl" : "lg"} cursor-pointer text-[13px] font-semibold font-['DM_Sans',sans-serif] hover:bg-[#8a5830] transition`}
        >
          Apply
        </button>
      </div>
      {promoError && (
        <p className={`text-[${mobile ? "12" : "11"}px] text-[#b43c1e] mt-2`}>
          {promoError}
        </p>
      )}
      {totals.promoApplied && (
        <div className="flex items-center gap-1.5 bg-[rgba(60,140,80,0.10)] rounded-lg p-2 mt-2.5 text-[11px] text-[#2d7a45]">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="#2d7a45" strokeWidth="1.2" />
            <path
              d="M4.5 7l2 2 3-3"
              stroke="#2d7a45"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          {totals.discount} off applied
        </div>
      )}
    </div>
  );
}
