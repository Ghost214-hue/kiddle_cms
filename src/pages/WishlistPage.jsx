import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useWishlist, useCart } from '../context/CartContext'

function Stars({ rating }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`text-[11px] ${i <= Math.round(rating) ? 'text-[#a0693a]' : 'text-gray-300'}`}>★</span>
      ))}
    </span>
  )
}

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [removingId, setRemovingId] = useState(null)

  const handleRemoveFromWishlist = async (book) => {
    setRemovingId(book._id)
    await toggleWishlist(book)
    setTimeout(() => setRemovingId(null), 300)
  }

  const handleAddToCart = (book) => {
    addToCart(book)
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="bg-[#f5f0e8] min-h-screen pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-7xl mb-6">💔</div>
          <h1 className="font-['Playfair_Display',serif] text-3xl text-[#3d2010] mb-4">
            Your wishlist is empty
          </h1>
          <p className="text-[#9a7a5a] font-['DM_Sans',sans-serif] mb-8">
            Save your favorite books here to buy them later
          </p>
          <Link 
            to="/books" 
            className="inline-block bg-[#a0693a] text-white px-8 py-3 rounded-full font-['DM_Sans',sans-serif] font-semibold hover:bg-[#8a5830] transition-colors"
          >
            Browse Books
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f5f0e8] min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-['Playfair_Display',serif] text-3xl md:text-4xl text-[#3d2010] mb-3">
            My Wishlist
          </h1>
          <p className="text-[#9a7a5a] font-['DM_Sans',sans-serif]">
            {wishlist.length} {wishlist.length === 1 ? 'book' : 'books'} saved for later
          </p>
        </div>

        {/* Wishlist Items */}
        <div className="space-y-4">
          {wishlist.map((book) => (
            <div 
              key={book._id}
              className={`bg-white rounded-2xl p-6 shadow-sm border border-[rgba(200,170,130,0.2)] transition-all duration-300 ${
                removingId === book._id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* Book Image */}
                <Link to={`/book/${book.slug}`} className="md:w-32 flex-shrink-0">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-[#f5e8d5] to-[#e8d5b8]">
                    {book.img ? (
                      <img 
                        src={book.img} 
                        alt={book.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📖</div>
                    )}
                  </div>
                </Link>

                {/* Book Info */}
                <div className="flex-1">
                  <Link to={`/book/${book.slug}`} className="hover:no-underline">
                    <h2 className="font-['Playfair_Display',serif] text-xl font-bold text-[#3d2010] mb-2 hover:text-[#a0693a] transition-colors">
                      {book.title}
                    </h2>
                  </Link>
                  <p className="text-[#9a7a5a] font-['DM_Sans',sans-serif] mb-2">
                    by {book.author}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Stars rating={book.rating} />
                    <span className="text-xs text-[#b09070]">
                      ({book.reviewCount?.toLocaleString()} reviews)
                    </span>
                  </div>

                  {book.ageRange && (
                    <span className="inline-block text-[10px] font-bold bg-[rgba(160,105,58,0.09)] text-[#9a6030] py-1 px-3 rounded-full font-['DM_Sans',sans-serif] mb-3">
                      {book.ageRange}
                    </span>
                  )}

                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <div>
                      <span className="text-xl font-bold text-[#7a4e22]">
                        ${(book.salePrice ?? book.price).toFixed(2)}
                      </span>
                      {book.salePrice && (
                        <span className="text-sm text-[#b09070] line-through ml-2">
                          ${book.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(book)}
                      className="bg-[#a0693a] text-white px-6 py-2 rounded-full font-['DM_Sans',sans-serif] font-semibold hover:bg-[#8a5830] transition-colors"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={() => handleRemoveFromWishlist(book)}
                      className="text-[#b09070] hover:text-red-500 px-4 py-2 rounded-full font-['DM_Sans',sans-serif] transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping Button */}
        <div className="text-center mt-12">
          <Link 
            to="/books" 
            className="inline-flex items-center gap-2 text-[#a0693a] hover:text-[#8a5830] font-['DM_Sans',sans-serif] font-semibold transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 10H5M5 10L8 7M5 10L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}