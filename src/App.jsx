import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy-load pages to reduce initial JS payload
const HomePage = lazy(() => import("./pages/HomePage"));
const CollectionPage = lazy(() => import("./pages/CollectionPage"));
const BookDetailPage = lazy(() => import("./pages/BookDetailPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const WishlistPage = lazy(() => import("./pages/WishlistPage"));

export default function App() {
  return (
    <CartProvider>
      <HelmetProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Navbar />

            {/* Centralized page container to restore centered, constrained layout */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Suspense
                fallback={<div className="py-20 text-center">Loading…</div>}
              >
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/books" element={<CollectionPage />} />
                  <Route path="/category/:slug" element={<CollectionPage />} />
                  <Route path="/book/:slug" element={<BookDetailPage />} />
                  <Route path="/product/:slug" element={<BookDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/contact" element={<ContactUs />} />
                </Routes>
              </Suspense>
            </main>

            <Footer />
          </ErrorBoundary>
        </BrowserRouter>
      </HelmetProvider>
    </CartProvider>
  );
}
