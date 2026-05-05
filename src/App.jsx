import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import CollectionPage from './pages/CollectionPage'
import BookDetailPage from './pages/BookDetailPage'
import CartPage from './pages/CartPage'
import ContactUs from './pages/ContactUs'
import WishlistPage from './pages/WishlistPage'

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"                  element={<HomePage />} />
          <Route path="/books"             element={<CollectionPage />} />
          <Route path="/category/:slug"    element={<CollectionPage />} />
          <Route path="/book/:slug"        element={<BookDetailPage />} />
          <Route path="/cart"              element={<CartPage />} />
          <Route path="/wishlist"          element={<WishlistPage />} />
          <Route path="/contact"             element={<ContactUs />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  )
}