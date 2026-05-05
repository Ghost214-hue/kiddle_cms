import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import StarRating from '../components/ui/StarRating'
import FeaturedCarousel from '../components/carousel/FeaturedCarousel'
import CountdownTimer from '../components/ui/CountdownTimer'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/CartContext'
import { formatPrice, formatReviewCount } from '../utils/formatPrice'

// Import the book data from CollectionPage
const ALL_BOOKS = [
  {
    _id: 'b1', title: 'The Midnight Library', author: 'Matt Haig',
    price: 24.99, salePrice: null, rating: 4.4, reviewCount: 1240,
    ageRange: 'Young Adult', badge: '#1 Bestseller', badgeColor: '#8a6030',
    slug: 'the-midnight-library',
    categories: ['fiction', 'young-adults', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80',
    description: `Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices...

Would you have done anything different, if you had the chance to undo your regrets?

Nora Seed finds herself in the Midnight Library. Until she decides to live the life of her dreams, she will keep visiting this magical realm of possibilities. She must ask herself what is truly fulfilling in life, and what makes it worth living in the first place.`,
    pageCount: 304, publisher: 'Viking', publishedDate: 'August 13, 2020',
    isbn: '978-0-525-55947-4', language: 'English',
    formats: ['Hardcover', 'Paperback', 'E-book', 'Audiobook'],
  },
  {
    _id: 'b2', title: 'Before the Coffee Gets Cold', author: 'Toshikazu Kawaguchi',
    price: 18.99, salePrice: null, rating: 4.8, reviewCount: 876,
    ageRange: 'Adult', badge: 'New', badgeColor: '#2d7a4f',
    slug: 'before-the-coffee-gets-cold',
    categories: ['fiction', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
    description: `In a small back alley in Tokyo, there is a café which has been serving carefully brewed coffee for more than one hundred years. But this coffee shop offers its customers a unique experience: the chance to travel back in time.`,
    pageCount: 213, publisher: 'Hanover Square Press', publishedDate: 'November 17, 2020',
    isbn: '978-1-335-43198-7', language: 'English',
    formats: ['Hardcover', 'Paperback', 'E-book'],
  },
  {
    _id: 'b3', title: 'Where the Crawdads Sing', author: 'Delia Owens',
    price: 23.00, salePrice: null, rating: 4.7, reviewCount: 2100,
    ageRange: 'Adult', badge: null, badgeColor: null,
    slug: 'where-the-crawdads-sing',
    categories: ['fiction', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80',
    description: `For years, rumors of the "Marsh Girl" have haunted Barkley Cove, a quiet town on the North Carolina coast. So in late 1969, when handsome Chase Andrews is found dead, the locals immediately suspect Kya Clark, the so-called Marsh Girl.`,
    pageCount: 368, publisher: 'G.P. Putnam\'s Sons', publishedDate: 'August 14, 2018',
    isbn: '978-0-735-21909-0', language: 'English',
    formats: ['Hardcover', 'Paperback', 'E-book', 'Audiobook'],
  },
  {
    _id: 'b4', title: "The Lion's Secret Garden", author: 'Clara Moss',
    price: 12.99, salePrice: null, rating: 4.6, reviewCount: 580,
    ageRange: '4-8 Years', badge: 'New', badgeColor: '#2d7a4f',
    slug: 'lions-secret-garden',
    categories: ['storybooks', 'lower-primary'],
    img: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&q=80',
    description: `Join Leo the Lion on a magical adventure through his secret garden, where he discovers the true meaning of friendship and courage.`,
    pageCount: 32, publisher: 'Kids Press', publishedDate: 'March 15, 2023',
    isbn: '978-1-234-56789-0', language: 'English',
    formats: ['Hardcover', 'Paperback'],
  },
  {
    _id: 'b5', title: 'Klara and the Sun', author: 'Kazuo Ishiguro',
    price: 20.00, salePrice: null, rating: 4.6, reviewCount: 940,
    ageRange: 'Adult', badge: null, badgeColor: null,
    slug: 'klara-and-the-sun',
    categories: ['fiction'],
    img: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=500&q=80',
    description: `From her place in the store, Klara, an Artificial Friend with outstanding observational qualities, watches carefully the behavior of those who come in to browse, and of those who pass on the street outside.`,
    pageCount: 303, publisher: 'Knopf', publishedDate: 'March 2, 2021',
    isbn: '978-0-593-31817-1', language: 'English',
    formats: ['Hardcover', 'Paperback', 'E-book', 'Audiobook'],
  },
  {
    _id: 'b6', title: 'Stars & Beyond', author: 'J. Hartley',
    price: 9.50, salePrice: 7.50, rating: 4.2, reviewCount: 310,
    ageRange: '9-12 Years', badge: 'Sale', badgeColor: '#b03030',
    slug: 'stars-and-beyond',
    categories: ['storybooks', 'upper-primary', 'science-nature'],
    img: 'https://images.unsplash.com/photo-1532094349884-543559059a95?w=500&q=80',
    description: `Embark on an incredible journey through our solar system and beyond. Learn about the stars, planets, and the mysteries of the universe.`,
    pageCount: 96, publisher: 'Space Books', publishedDate: 'January 10, 2023',
    isbn: '978-1-234-56790-6', language: 'English',
    formats: ['Paperback', 'E-book'],
  },
  {
    _id: 'b7', title: 'The Forest Alphabet', author: 'Nora Fynn',
    price: 8.99, salePrice: null, rating: 4.9, reviewCount: 430,
    ageRange: '0-3 Years', badge: null, badgeColor: null,
    slug: 'forest-alphabet',
    categories: ['storybooks', 'pp1-pp2'],
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80',
    description: `A beautiful ABC book featuring animals and plants from the forest. Perfect for early learners.`,
    pageCount: 28, publisher: 'Early Learning Press', publishedDate: 'May 20, 2023',
    isbn: '978-1-234-56791-3', language: 'English',
    formats: ['Hardcover'],
  },
  {
    _id: 'b8', title: 'Wings of Tomorrow', author: 'Sol Rivera',
    price: 11.00, salePrice: null, rating: 4.3, reviewCount: 195,
    ageRange: '9-12 Years', badge: null, badgeColor: null,
    slug: 'wings-of-tomorrow',
    categories: ['storybooks', 'upper-primary'],
    img: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=500&q=80',
    description: `A story of hope, friendship, and discovering your true potential. Follow Maya as she learns to spread her wings and fly.`,
    pageCount: 156, publisher: 'Young Readers Press', publishedDate: 'July 8, 2023',
    isbn: '978-1-234-56792-0', language: 'English',
    formats: ['Paperback', 'E-book'],
  },
  {
    _id: 'b9', title: 'The Starless Sea', author: 'Erin Morgenstern',
    price: 22.50, salePrice: null, rating: 4.9, reviewCount: 1540,
    ageRange: 'Adult', badge: 'Bestseller', badgeColor: '#8a6030',
    slug: 'the-starless-sea',
    categories: ['fiction', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=500&q=80',
    description: `A timeless love story set in a secret underground world—a place of pirates, painters, lovers, liars, and ships that sail upon a starless sea.`,
    pageCount: 498, publisher: 'Doubleday', publishedDate: 'November 5, 2019',
    isbn: '978-0-385-54470-4', language: 'English',
    formats: ['Hardcover', 'Paperback', 'E-book', 'Audiobook'],
  },
  {
    _id: 'b10', title: 'Wildwood Whispers', author: 'Elena Rosewood',
    price: 16.99, salePrice: null, rating: 4.5, reviewCount: 268,
    ageRange: 'Young Adult', badge: null, badgeColor: null,
    slug: 'wildwood-whispers',
    categories: ['fiction', 'young-adults', 'african-writers'],
    img: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=500&q=80',
    description: `Deep in the heart of an African forest, ancient secrets whisper through the trees. A young girl discovers her destiny intertwined with the magic of Wildwood.`,
    pageCount: 278, publisher: 'African Voices Press', publishedDate: 'September 12, 2023',
    isbn: '978-1-234-56793-7', language: 'English',
    formats: ['Paperback', 'E-book'],
  },
  {
    _id: 'b11', title: 'Mathematics Grade 7', author: 'KIE Press',
    price: 14.00, salePrice: null, rating: 4.7, reviewCount: 88,
    ageRange: '12-15 Years', badge: null, badgeColor: null,
    slug: 'mathematics-grade-7',
    categories: ['cbc-education', 'junior-secondary', 'mathematics'],
    img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&q=80',
    description: `Complete coverage of the Grade 7 mathematics curriculum with clear explanations, examples, and practice exercises aligned with CBC requirements.`,
    pageCount: 342, publisher: 'Kenya Institute of Education', publishedDate: 'January 2023',
    isbn: '978-9966-34-567-8', language: 'English',
    formats: ['Paperback'],
  },
  {
    _id: 'b12', title: 'Colours of the Sky', author: 'A. Linden',
    price: 11.00, salePrice: 8.50, rating: 4.8, reviewCount: 340,
    ageRange: '4-8 Years', badge: 'Sale', badgeColor: '#b03030',
    slug: 'colours-of-the-sky',
    categories: ['storybooks', 'lower-primary'],
    img: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&q=80',
    description: `A vibrant story about a little artist who discovers that the sky can be any color she imagines, teaching children about creativity and self-expression.`,
    pageCount: 40, publisher: 'Creative Kids', publishedDate: 'March 8, 2023',
    isbn: '978-1-234-56794-4', language: 'English',
    formats: ['Hardcover', 'Paperback'],
  },
  {
    _id: 'b13', title: 'Things Fall Apart', author: 'Chinua Achebe',
    price: 19.99, salePrice: null, rating: 4.9, reviewCount: 3200,
    ageRange: 'Adult', badge: '#1 Bestseller', badgeColor: '#8a6030',
    slug: 'things-fall-apart',
    categories: ['fiction', 'african-writers', 'bestsellers'],
    img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80',
    description: `A classic novel that depicts the life of Okonkwo, a leader and local wrestling champion in Umuofia—one of a group of nine villages in Nigeria. It explores the clash between traditional Igbo culture and the forces of European colonialism.`,
    pageCount: 209, publisher: 'Heinemann', publishedDate: '1958',
    isbn: '978-0-385-47454-2', language: 'English',
    formats: ['Paperback', 'E-book', 'Audiobook'],
  },
  {
    _id: 'b14', title: 'English Workbook Grade 4', author: 'KICD',
    price: 10.00, salePrice: null, rating: 4.4, reviewCount: 210,
    ageRange: '9-12 Years', badge: null, badgeColor: null,
    slug: 'english-workbook-grade-4',
    categories: ['cbc-education', 'upper-primary', 'english'],
    img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80',
    description: `Comprehensive English workbook covering reading, writing, grammar, and comprehension for Grade 4 students following the CBC curriculum.`,
    pageCount: 156, publisher: 'Kenya Institute of Curriculum Development', publishedDate: 'January 2023',
    isbn: '978-9966-34-568-5', language: 'English',
    formats: ['Paperback'],
  },
  {
    _id: 'b15', title: 'Science & Tech Grade 6', author: 'Focus Publishers',
    price: 13.50, salePrice: null, rating: 4.5, reviewCount: 142,
    ageRange: '9-12 Years', badge: null, badgeColor: null,
    slug: 'science-tech-grade-6',
    categories: ['cbc-education', 'upper-primary', 'science-nature', 'science'],
    img: 'https://images.unsplash.com/photo-1532094349884-543559059a95?w=500&q=80',
    description: `An engaging science and technology textbook for Grade 6 with hands-on activities and experiments aligned with the CBC curriculum.`,
    pageCount: 198, publisher: 'Focus Publishers', publishedDate: 'January 2023',
    isbn: '978-9966-34-569-2', language: 'English',
    formats: ['Paperback'],
  },
  {
    _id: 'b16', title: 'Social Studies Grade 3', author: 'Longhorn',
    price: 9.00, salePrice: null, rating: 4.2, reviewCount: 95,
    ageRange: '6-9 Years', badge: null, badgeColor: null,
    slug: 'social-studies-grade-3',
    categories: ['cbc-education', 'lower-primary', 'social-studies'],
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&q=80',
    description: `A colorful and engaging social studies textbook that helps young learners understand their community, country, and the world around them.`,
    pageCount: 124, publisher: 'Longhorn Publishers', publishedDate: 'January 2023',
    isbn: '978-9966-34-570-8', language: 'English',
    formats: ['Paperback'],
  },
]

function generateMockReviews(bookId, rating, reviewCount) {
  const names = ['Sarah M.', 'James T.', 'Priya K.', 'Michael R.', 'Emma W.', 'David L.', 'Lisa C.', 'John B.']
  const reviewTexts = [
    'Absolutely breathtaking. This book changed my perspective.',
    'A wonderful read that I couldn\'t put down. Highly recommended!',
    'One of those rare books that stays with you long after you finish.',
    'Thought-provoking and touching. The concept is brilliant.',
    'Beautifully written with incredible depth. A must-read!',
    'Exceeded all my expectations. Will definitely read again.',
    'The author has created something truly special here.',
    'Engaging from start to finish. Worth every penny!',
  ]
  
  const reviews = []
  const numReviews = Math.min(6, Math.floor(reviewCount / 200) + 3)
  
  for (let i = 0; i < numReviews; i++) {
    const reviewRating = Math.min(5, Math.max(4, rating + (Math.random() - 0.5) * 0.8))
    reviews.push({
      id: i + 1,
      name: names[i % names.length],
      rating: Math.round(reviewRating * 2) / 2,
      date: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Math.floor(Math.random() * 12)]} 2024`,
      text: reviewTexts[i % reviewTexts.length] + (i === 0 ? ' Truly unforgettable.' : ''),
    })
  }
  return reviews
}

function getRatingBreakdown(rating) {
  const diff = rating - 4
  const pct5 = Math.min(85, Math.max(40, 60 + diff * 15))
  const pct4 = Math.min(30, Math.max(15, 25 - diff * 5))
  const pct3 = Math.min(20, Math.max(5, 10 - diff * 3))
  const pct2 = Math.min(10, Math.max(1, 4 - diff))
  const pct1 = Math.max(1, 3 - diff * 0.5)
  
  const total = pct5 + pct4 + pct3 + pct2 + pct1
  return [
    { stars: 5, pct: Math.round((pct5 / total) * 100) },
    { stars: 4, pct: Math.round((pct4 / total) * 100) },
    { stars: 3, pct: Math.round((pct3 / total) * 100) },
    { stars: 2, pct: Math.round((pct2 / total) * 100) },
    { stars: 1, pct: Math.round((pct1 / total) * 100) },
  ]
}

function ReviewCard({ review }) {
  return (
    <div className="bg-[rgba(255,255,255,0.52)] border border-[rgba(200,170,130,0.28)] rounded-2xl p-[18px_20px] backdrop-blur-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <div 
            className="w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-bold text-white font-['DM_Sans',sans-serif]"
            style={{ background: `hsl(${review.id * 47}, 45%, 75%)` }}
          >
            {review.name[0]}
          </div>
          <div>
            <div className="text-[13px] font-semibold text-[#3d2010] font-['DM_Sans',sans-serif]">
              {review.name}
            </div>
            <div className="text-[11px] text-[#9a7a5a] font-['DM_Sans',sans-serif]">
              {review.date}
            </div>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" showCount={false} />
      </div>
      <p className="text-[13px] text-[#5c3d1e] font-['DM_Sans',sans-serif] leading-[1.7]">
        {review.text}
      </p>
    </div>
  )
}

function BookCover({ book, coverColors }) {
  const [imgErr, setImgErr] = useState(false)
  
  if (!imgErr && book.img) {
    return (
      <img
        src={book.img}
        alt={book.title}
        onError={() => setImgErr(true)}
        className="w-full h-full object-cover block"
      />
    )
  }
  
  return (
    <div 
      className="w-full h-full flex items-center justify-center"
      style={{ background: `linear-gradient(145deg, ${coverColors[0]}, ${coverColors[1]})` }}
    >
      <div className="w-[55%] h-[75%] bg-gradient-to-br from-white/12 to-white/04 rounded-[4px_12px_12px_4px] border border-white/20 shadow-[8px_12px_40px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center p-5 relative">
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/20 rounded-l-[4px]" />
        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center mb-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="opacity-80">
            <path d="M12 2L9 8H3l5 4-2 6 6-4 6 4-2-6 5-4h-6L12 2Z" fill="rgba(255,255,255,0.9)"/>
          </svg>
        </div>
        <div className="text-[11px] text-white/90 font-['Playfair_Display',serif] font-semibold text-center leading-[1.4] mb-1.5">
          {book.title}
        </div>
        <div className="text-[9px] text-white/60 font-['DM_Sans',sans-serif]">
          {book.author}
        </div>
      </div>
    </div>
  )
}

export default function BookDetailPage() {
  const { slug } = useParams()
  const [selectedFormat, setSelectedFormat] = useState('Hardcover')
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState('description')
  const [added, setAdded] = useState(false)
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [ratingBreakdown, setRatingBreakdown] = useState([])

  const { addToCart } = useCart()
  const { toggleWishlist, isWishlisted } = useWishlist()

  useEffect(() => {
    const foundBook = ALL_BOOKS.find(b => b.slug === slug)
    setBook(foundBook)
    
    if (foundBook) {
      setReviews(generateMockReviews(foundBook._id, foundBook.rating, foundBook.reviewCount))
      setRatingBreakdown(getRatingBreakdown(foundBook.rating))
    }
  }, [slug])

  if (!book) {
    return (
      <div className="bg-[#f5f0e8] min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">📖</div>
          <h2 className="font-['Playfair_Display',serif] text-2xl text-[#3d2010] mb-4">Book not found</h2>
          <Link to="/books" className="text-[#a0693a] no-underline hover:underline">
            ← Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  const wishlisted = isWishlisted(book._id)
  const finalPrice = book.salePrice ?? book.price
  const originalPrice = book.price
  const savePercent = book.salePrice ? Math.round(((book.price - book.salePrice) / book.price) * 100) : 0

  const coverColors = ['#8aaccb', '#6a8cb0']
  if (book.ageRange === '4-8 Years') coverColors.push('#8ab08a')
  if (book.ageRange === 'Young Adult') coverColors.push('#c4a060')

  function handleAddToCart() {
    addToCart({ ...book, price: finalPrice, format: selectedFormat }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const categoryName = book.categories?.[0] ? 
    book.categories[0].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 
    'Books'

  return (
    <div className="bg-[#f5f0e8] min-h-screen pt-[68px]">

      {/* Limited edition countdown banner - only for some books */}
      {book._id === 'b1' && (
        <div className="bg-[rgba(160,105,58,0.10)] border-b border-[rgba(180,140,90,0.20)] py-2.5 px-10 flex items-center justify-center gap-2.5 flex-wrap">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="#a0693a" strokeWidth="1.2"/>
            <path d="M7 4v3l2 2" stroke="#a0693a" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className="text-[12.5px] text-[#5c3d1e] font-['DM_Sans',sans-serif] font-medium">
            LIMITED EDITION SIGNED COPIES:
          </span>
          <CountdownTimer expiresAt={new Date(Date.now() + 1000 * 60 * 60 * 2 + 1000 * 60 * 44 + 12000).toISOString()} variant="inline" />
          <span className="text-xs text-[#7a5c3a] font-['DM_Sans',sans-serif]">REMAINING</span>
        </div>
      )}

      <div className="max-w-[1280px] mx-auto px-[clamp(16px,4vw,40px)] py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#9a7a5a] font-['DM_Sans',sans-serif] mb-8 flex-wrap">
          <Link to="/" className="text-[#9a7a5a] no-underline hover:text-[#a0693a]">Home</Link>
          <span className="text-[#c4a882]">›</span>
          <Link to="/books" className="text-[#9a7a5a] no-underline hover:text-[#a0693a]">Books</Link>
          <span className="text-[#c4a882]">›</span>
          <span className="text-[#5c3d1e] font-medium">{book.title}</span>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[56px] mb-16 items-start">
          {/* Left — cover */}
          <div>
            <div className="relative rounded-[20px] overflow-hidden aspect-[3/4] max-h-[520px] shadow-[0_24px_64px_rgba(100,60,20,0.20)]">
              <BookCover book={book} coverColors={coverColors} />

              {/* Badge */}
              {book.badge && (
                <div className="absolute top-4 left-4 bg-[rgba(160,105,58,0.15)] border border-[rgba(160,105,58,0.35)] backdrop-blur-md rounded-xl py-[5px] px-3 text-[10.5px] font-bold text-[#7a4e22] font-['DM_Sans',sans-serif]">
                  {book.badge}
                </div>
              )}

              {/* Share button */}
              <button className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/75 backdrop-blur-sm border border-[rgba(180,140,90,0.3)] flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white/90 hover:scale-105">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="13" cy="3" r="1.5" stroke="#7a4e22" strokeWidth="1.3"/>
                  <circle cx="13" cy="13" r="1.5" stroke="#7a4e22" strokeWidth="1.3"/>
                  <circle cx="3" cy="8" r="1.5" stroke="#7a4e22" strokeWidth="1.3"/>
                  <path d="M4.5 8.7L11.5 12M11.5 4L4.5 7.3" stroke="#7a4e22" strokeWidth="1.2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Right — details */}
          <div>
            <div className="flex items-center gap-2 text-[11.5px] text-[#a0693a] font-['DM_Sans',sans-serif] font-semibold tracking-[0.04em] uppercase mb-2.5 flex-wrap">
              {categoryName}
              <span className="text-[#c4a882]">›</span>
              <span className="text-[#9a7a5a] font-normal normal-case tracking-normal">
                {selectedFormat} Edition
              </span>
            </div>

            <h1 className="font-['Playfair_Display',serif] text-[clamp(26px,3.5vw,38px)] font-bold text-[#3d2010] leading-[1.2] mb-1.5">
              {book.title}
            </h1>

            <p className="text-[15px] text-[#9a7a5a] font-['DM_Sans',sans-serif] italic mb-3.5">
              by <span className="text-[#a0693a] not-italic">{book.author}</span>
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <StarRating rating={book.rating} size="md" showCount={false} />
              <span className="text-[13px] text-[#a0693a] font-['DM_Sans',sans-serif] font-semibold">
                {book.rating}
              </span>
              <span className="text-[12.5px] text-[#9a7a5a] font-['DM_Sans',sans-serif]">
                ({formatReviewCount(book.reviewCount)})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 flex-wrap">
              <span className="font-['Playfair_Display',serif] text-[32px] font-bold text-[#3d2010]">
                {formatPrice(finalPrice)}
              </span>
              {book.salePrice && (
                <>
                  <span className="text-base text-[#b8998a] font-['DM_Sans',sans-serif] line-through">
                    {formatPrice(originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-[#2d7a45] font-['DM_Sans',sans-serif] bg-[rgba(60,140,80,0.10)] py-[3px] px-[9px] rounded-[10px]">
                    Save {savePercent}%
                  </span>
                </>
              )}
            </div>

            {/* Format selector */}
            {book.formats && book.formats.length > 0 && (
              <div className="mb-6">
                <div className="text-[11px] font-semibold text-[#5c3d1e] uppercase tracking-[0.07em] font-['DM_Sans',sans-serif] mb-2.5">
                  Select Format
                </div>
                <div className="flex gap-2 flex-wrap">
                  {book.formats.map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt)}
                      className={`
                        px-4 py-2 rounded-[20px] border-[1.5px] text-[12.5px] font-['DM_Sans',sans-serif]
                        transition-all duration-200 cursor-pointer
                        ${selectedFormat === fmt 
                          ? 'border-[#a0693a] bg-[rgba(160,105,58,0.14)] text-[#5c3520] font-semibold' 
                          : 'border-[rgba(180,140,90,0.3)] bg-[rgba(255,255,255,0.6)] text-[#7a5c3a] font-normal hover:bg-[rgba(255,255,255,0.8)]'
                        }
                      `}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <div className="text-[11px] font-semibold text-[#5c3d1e] uppercase tracking-[0.07em] font-['DM_Sans',sans-serif] mb-2.5">
                Quantity
              </div>
              <div className="flex items-center gap-0">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-[38px] h-[38px] bg-[rgba(255,255,255,0.6)] border border-[rgba(180,140,90,0.3)] border-r-0 rounded-l-[10px] cursor-pointer text-base text-[#7a4e22] flex items-center justify-center transition-all duration-200 hover:bg-[rgba(255,255,255,0.8)]"
                >
                  −
                </button>
                <div className="w-12 h-[38px] bg-[rgba(255,255,255,0.7)] border border-[rgba(180,140,90,0.3)] flex items-center justify-center text-[14px] font-semibold text-[#3d2010] font-['DM_Sans',sans-serif]">
                  {qty}
                </div>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-[38px] h-[38px] bg-[rgba(255,255,255,0.6)] border border-[rgba(180,140,90,0.3)] border-l-0 rounded-r-[10px] cursor-pointer text-base text-[#7a4e22] flex items-center justify-center transition-all duration-200 hover:bg-[rgba(255,255,255,0.8)]"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 mb-5 flex-wrap">
              <button
                onClick={handleAddToCart}
                className={`
                  flex-1 min-w-[180px] flex items-center justify-center gap-2 py-[14px] px-7 rounded-[28px]
                  text-[14px] font-semibold font-['DM_Sans',sans-serif] cursor-pointer transition-all duration-250
                  ${added 
                    ? 'bg-[rgba(60,140,80,0.15)] border-[1.5px] border-[rgba(60,140,80,0.35)] text-[#2d7a45] shadow-none' 
                    : 'bg-gradient-to-br from-[#c48b52] to-[#a0693a] text-white shadow-[0_6px_24px_rgba(160,105,58,0.35)] hover:shadow-[0_8px_28px_rgba(160,105,58,0.4)] hover:-translate-y-px'
                  }
                `}
              >
                {added ? (
                  <><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#2d7a45" strokeWidth="1.4"/><path d="M5 8l2.5 2.5 4-4" stroke="#2d7a45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> Added to Basket!</>
                ) : (
                  <><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2H3.5L5.5 10H12L13.5 5H4.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6.5" cy="12.5" r="1" fill="white"/><circle cx="11.5" cy="12.5" r="1" fill="white"/></svg> Add to Basket</>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(book)}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center cursor-pointer
                  transition-all duration-200 border-[1.5px] hover:scale-105
                  ${wishlisted 
                    ? 'bg-[rgba(160,105,58,0.15)] border-[#a0693a]' 
                    : 'bg-[rgba(255,255,255,0.7)] border-[rgba(180,140,90,0.35)] hover:bg-[rgba(255,255,255,0.9)]'
                  }
                `}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 15.5C9 15.5 2 11 2 6.5C2 4.3 3.8 2.5 6 2.5C7.4 2.5 8.6 3.3 9 4.2C9.4 3.3 10.6 2.5 12 2.5C14.2 2.5 16 4.3 16 6.5C16 11 9 15.5 9 15.5Z"
                    fill={wishlisted ? '#a0693a' : 'none'}
                    stroke="#a0693a" strokeWidth="1.4"
                  />
                </svg>
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex gap-5 flex-wrap pt-3.5 border-t border-[rgba(180,140,90,0.18)]">
              <div className="flex items-center gap-1.5 text-xs text-[#7a5c3a] font-['DM_Sans',sans-serif]">
                <span className="text-sm">🚚</span> Ships in 24 hours
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#7a5c3a] font-['DM_Sans',sans-serif]">
                <span className="text-sm">📖</span> Free chapter preview
              </div>
              {book.ageRange && (
                <div className="flex items-center gap-1.5 text-xs text-[#7a5c3a] font-['DM_Sans',sans-serif]">
                  <span className="text-sm">🎯</span> Ages {book.ageRange}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mb-16" id="reviews">
          <div className="flex border-b border-[rgba(180,140,90,0.2)] mb-7 gap-0 flex-wrap">
            {['description', 'details', 'reviews'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`
                  py-3 px-6 bg-none border-none border-b-2 text-[13.5px] font-['DM_Sans',sans-serif]
                  cursor-pointer transition-all duration-200 capitalize mb-px
                  ${tab === t 
                    ? 'border-[#a0693a] text-[#a0693a] font-semibold' 
                    : 'border-transparent text-[#9a7a5a] font-normal hover:text-[#a0693a]'
                  }
                `}
              >
                {t} {t === 'reviews' ? `(${book.reviewCount.toLocaleString()})` : ''}
              </button>
            ))}
          </div>

          {tab === 'description' && (
            <div className="max-w-[720px]">
              {book.description ? (
                book.description.split('\n\n').map((para, i) => (
                  <p key={i} className="text-[14px] text-[#5c3d1e] leading-[1.8] font-['DM_Sans',sans-serif] mb-4">
                    {para}
                  </p>
                ))
              ) : (
                <p className="text-[14px] text-[#5c3d1e] leading-[1.8] font-['DM_Sans',sans-serif]">
                  No description available for this book.
                </p>
              )}
            </div>
          )}

          {tab === 'details' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[720px]">
              {[
                ['ISBN', book.isbn],
                ['Pages', book.pageCount],
                ['Published', book.publishedDate],
                ['Publisher', book.publisher],
                ['Language', book.language],
                ['Age Range', book.ageRange],
                ['Categories', book.categories?.join(', ')],
              ].filter(([_, value]) => value).map(([label, value]) => (
                <div key={label} className="bg-[rgba(255,255,255,0.52)] border border-[rgba(200,170,130,0.25)] rounded-xl p-3 backdrop-blur-sm transition-all duration-200 hover:shadow-sm">
                  <div className="text-[10px] text-[#9a7a5a] font-['DM_Sans',sans-serif] font-semibold uppercase tracking-[0.06em] mb-1">
                    {label}
                  </div>
                  <div className="text-[13.5px] text-[#3d2010] font-['DM_Sans',sans-serif] font-medium">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 items-start">
              {/* Rating breakdown */}
              <div className="bg-[rgba(255,255,255,0.52)] border border-[rgba(200,170,130,0.28)] rounded-[20px] p-6 backdrop-blur-sm sticky top-[84px]">
                <div className="text-center mb-5">
                  <div className="font-['Playfair_Display',serif] text-[52px] font-bold text-[#3d2010] leading-none">
                    {book.rating}
                  </div>
                  <StarRating rating={book.rating} size="lg" showCount={false} />
                  <div className="text-xs text-[#9a7a5a] font-['DM_Sans',sans-serif] mt-1.5">
                    {formatReviewCount(book.reviewCount)}
                  </div>
                </div>
                {ratingBreakdown.map(({ stars, pct }) => (
                  <div key={stars} className="flex items-center gap-2.5 mb-2">
                    <span className="text-[11px] text-[#7a5c3a] font-['DM_Sans',sans-serif] w-[10px]">{stars}</span>
                    <span className="text-[11px] text-[#a0693a]">★</span>
                    <div className="flex-1 h-1.5 bg-[rgba(160,105,58,0.12)] rounded-full overflow-hidden">
                      <div className="h-full bg-[#a0693a] rounded-full transition-width duration-600" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-[11px] text-[#9a7a5a] font-['DM_Sans',sans-serif] w-[28px] text-right">{pct}%</span>
                  </div>
                ))}
              </div>

              {/* Review cards */}
              <div className="flex flex-col gap-3.5">
                {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
              </div>
            </div>
          )}
        </div>

        {/* Related books */}
        <div className="border-t border-[rgba(180,140,90,0.18)] pt-12">
          <div className="mb-1">
            <div className="text-[11px] text-[#a0693a] font-bold tracking-[0.08em] uppercase font-['DM_Sans',sans-serif] mb-1">
              CURATED FOR YOU
            </div>
          </div>
          <FeaturedCarousel title="Readers Also Loved" viewAllHref="/books" />
        </div>
      </div>
    </div>
  )
}