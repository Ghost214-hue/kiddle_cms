import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
  useState,
} from "react";

const LS_CART = "kiddle_cart";
const LS_WISHLIST = "kiddle_wishlist";

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.find(
        (i) => i._id === action.item._id && i.format === action.item.format,
      );
      if (existing) {
        return state.map((i) =>
          i._id === action.item._id && i.format === action.item.format
            ? { ...i, qty: i.qty + (action.qty ?? 1) }
            : i,
        );
      }
      return [...state, { ...action.item, qty: action.qty ?? 1 }];
    }

    case "REMOVE":
      return state.filter(
        (i) => !(i._id === action.id && i.format === action.format),
      );

    case "UPDATE_QTY":
      if (action.qty < 1) {
        return state.filter(
          (i) => !(i._id === action.id && i.format === action.format),
        );
      }
      return state.map((i) =>
        i._id === action.id && i.format === action.format
          ? { ...i, qty: action.qty }
          : i,
      );

    case "CLEAR":
      return [];

    case "HYDRATE":
      return action.payload;

    default:
      return state;
  }
}

// ─────────────────────────────────────────────
// Wishlist reducer
// ─────────────────────────────────────────────
function wishlistReducer(state, action) {
  switch (action.type) {
    case "TOGGLE": {
      const exists = state.find((i) => i._id === action.item._id);
      return exists
        ? state.filter((i) => i._id !== action.item._id)
        : [...state, action.item];
    }
    case "REMOVE":
      return state.filter((i) => i._id !== action.id);
    case "CLEAR":
      return [];
    case "HYDRATE":
      return action.payload;
    default:
      return state;
  }
}

let toastId = 0;

const CartContext = createContext(null);
const WishlistContext = createContext(null);
const ToastContext = createContext(null);

export function CartProvider({ children }) {
  // ── cart ──
  const [cart, cartDispatch] = useReducer(cartReducer, [], () =>
    readLS(LS_CART, []),
  );

  // ── wishlist ──
  const [wishlist, wishDispatch] = useReducer(wishlistReducer, [], () =>
    readLS(LS_WISHLIST, []),
  );

  // ── toasts ──
  const [toasts, setToasts] = useState([]);
  const timerMap = useRef({});

  // Persist cart
  useEffect(() => {
    writeLS(LS_CART, cart);
  }, [cart]);

  // Persist wishlist
  useEffect(() => {
    writeLS(LS_WISHLIST, wishlist);
  }, [wishlist]);

  // ── Toast helpers ──
  const pushToast = useCallback((message, type = "cart", duration = 2800) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    timerMap.current[id] = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      delete timerMap.current[id];
    }, duration);
  }, []);

  const dismissToast = useCallback((id) => {
    clearTimeout(timerMap.current[id]);
    delete timerMap.current[id];
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Cart actions ──
  const addToCart = useCallback(
    (item, qty = 1) => {
      cartDispatch({ type: "ADD", item, qty });
      pushToast(`"${item.title}" added to cart`, "cart");
    },
    [pushToast],
  );

  const removeFromCart = useCallback(
    (id, format) => {
      const item = cart.find((i) => i._id === id && i.format === format);
      cartDispatch({ type: "REMOVE", id, format });
      if (item) pushToast(`"${item.title}" removed`, "remove");
    },
    [cart, pushToast],
  );

  const updateQty = useCallback((id, format, qty) => {
    cartDispatch({ type: "UPDATE_QTY", id, format, qty });
  }, []);

  const clearCart = useCallback(() => {
    cartDispatch({ type: "CLEAR" });
    pushToast("Cart cleared", "remove");
  }, [pushToast]);

  // ── Wishlist actions ──
  const toggleWishlist = useCallback(
    (item) => {
      const exists = wishlist.find((i) => i._id === item._id);
      wishDispatch({ type: "TOGGLE", item });
      pushToast(
        exists
          ? `"${item.title}" removed from wishlist`
          : `"${item.title}" saved to wishlist`,
        "wishlist",
      );
    },
    [wishlist, pushToast],
  );

  const isWishlisted = useCallback(
    (id) => wishlist.some((i) => i._id === id),
    [wishlist],
  );

  const removeFromWishlist = useCallback((id) => {
    wishDispatch({ type: "REMOVE", id });
  }, []);

  // ── Derived cart values ──
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const subtotal = cart.reduce(
    (sum, i) => sum + (i.salePrice ?? i.price) * i.qty,
    0,
  );

  const savings = cart.reduce((sum, i) => {
    const original = i.originalPrice ?? i.price;
    const sale = i.salePrice ?? i.price;
    return sum + (original - sale) * i.qty;
  }, 0);

  const isEmpty = cart.length === 0;

  return (
    <ToastContext.Provider value={{ toasts, pushToast, dismissToast }}>
      <WishlistContext.Provider
        value={{
          wishlist,
          toggleWishlist,
          isWishlisted,
          removeFromWishlist,
        }}
      >
        <CartContext.Provider
          value={{
            cart,
            addToCart,
            removeFromCart,
            updateQty,
            clearCart,
            itemCount,
            subtotal,
            savings,
            isEmpty,
          }}
        >
          {children}
          <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </CartContext.Provider>
      </WishlistContext.Provider>
    </ToastContext.Provider>
  );
}

const TOAST_ICONS = {
  cart: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className="flex-shrink-0"
    >
      <path
        d="M2 2H3.5L5.5 10H12L13.5 5H4.5"
        stroke="#a0693a"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="12.5" r="1" fill="#a0693a" />
      <circle cx="11.5" cy="12.5" r="1" fill="#a0693a" />
    </svg>
  ),
  wishlist: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className="flex-shrink-0"
    >
      <path
        d="M8 13.5C8 13.5 1.5 9.5 1.5 5.5C1.5 3.5 3 2 5 2C6.2 2 7.2 2.7 8 3.5C8.8 2.7 9.8 2 11 2C13 2 14.5 3.5 14.5 5.5C14.5 9.5 8 13.5 8 13.5Z"
        fill="#a0693a"
        stroke="#a0693a"
        strokeWidth="1.2"
      />
    </svg>
  ),
  remove: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className="flex-shrink-0"
    >
      <circle cx="8" cy="8" r="6.5" stroke="#9a7a5a" strokeWidth="1.3" />
      <path
        d="M5.5 8h5"
        stroke="#9a7a5a"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
};

const TOAST_STYLES = {
  cart: {
    bg: "bg-[rgba(245,240,232,0.97)]",
    border: "border-[rgba(160,105,58,0.30)]",
    text: "text-[#5c3d1e]",
  },
  wishlist: {
    bg: "bg-[rgba(245,240,232,0.97)]",
    border: "border-[rgba(160,105,58,0.30)]",
    text: "text-[#5c3d1e]",
  },
  remove: {
    bg: "bg-[rgba(245,240,232,0.97)]",
    border: "border-[rgba(180,140,90,0.22)]",
    text: "text-[#7a5c3a]",
  },
};

function ToastContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;

  return (
    <>
      <style>{`
        @keyframes ks-toast-in {
          from { opacity: 0; transform: translateY(12px) scale(0.96) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }
        @keyframes ks-toast-out {
          from { opacity: 1; transform: translateY(0) scale(1) }
          to   { opacity: 0; transform: translateY(8px) scale(0.96) }
        }
        .ks-toast {
          animation: ks-toast-in 0.28s cubic-bezier(0.34,1.56,0.64,1) both;
        }
      `}</style>

      <div
        role="region"
        aria-label="Notifications"
        className="fixed bottom-6 right-5 z-[9999] flex flex-col gap-2 pointer-events-none max-w-[320px]"
      >
        {toasts.map((t) => {
          const styles = TOAST_STYLES[t.type] || TOAST_STYLES.cart;
          return (
            <div
              key={t.id}
              className={`ks-toast flex items-center gap-2.5 py-3 px-3.5 rounded-xl backdrop-blur-[16px] pointer-events-auto cursor-pointer ${styles.bg} ${styles.border} border shadow-[0_6px_24px_rgba(100,60,20,0.14)]`}
              onClick={() => onDismiss(t.id)}
            >
              <span className="flex-shrink-0">{TOAST_ICONS[t.type]}</span>
              <span
                className={`text-[12.5px] font-dm-sans font-medium flex-1 leading-[1.4] ${styles.text}`}
              >
                {t.message}
              </span>
              <button
                className="bg-none border-none cursor-pointer text-[#b09070] text-[13px] px-0 py-0 leading-none flex-shrink-0 hover:text-[#8a6a4a] transition-colors"
                aria-label="Dismiss"
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss(t.id);
                }}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <CartProvider>");
  return ctx;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <CartProvider>");
  return ctx;
}
