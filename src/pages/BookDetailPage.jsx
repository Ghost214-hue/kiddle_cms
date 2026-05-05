import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import StarRating       from '../components/ui/StarRating'
import FeaturedCarousel from '../components/carousel/FeaturedCarousel'
import CountdownTimer   from '../components/ui/CountdownTimer'
import { useCart }      from '../context/CartContext'
import { useWishlist }  from '../context/CartContext'
import { formatPrice, formatReviewCount } from '../utils/formatPrice'

// Import the book data from CollectionPage
const ALL_BOOKS = [
  {
    _id: 'b1',  title: 'The Midnight Library',       author: 'Matt Haig',
    price: 24.99, salePrice: null,  rating: 4.4, reviewCount: 1240,
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
    _id: 'b2',  title: 'Before the Coffee Gets Cold', author: 'Toshikazu Kawaguchi',
    price: 18.99, salePrice: null,  rating: 4.8, reviewCount: 876,
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
    _id: 'b3',  title: 'Where the Crawdads Sing',    author: 'Delia Owens',
    price: 23.00, salePrice: null,  rating: 4.7, reviewCount: 2100,
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
    _id: 'b4',  title: "The Lion's Secret Garden",   author: 'Clara Moss',
    price: 12.99, salePrice: null,  rating: 4.6, reviewCount: 580,
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
    _id: 'b5',  title: 'Klara and the Sun',          author: 'Kazuo Ishiguro',
    price: 20.00, salePrice: null,  rating: 4.6, reviewCount: 940,
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
    _id: 'b6',  title: 'Stars & Beyond',             author: 'J. Hartley',
    price: 9.50, salePrice: 7.50,   rating: 4.2, reviewCount: 310,
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
    _id: 'b7',  title: 'The Forest Alphabet',        author: 'Nora Fynn',
    price: 8.99, salePrice: null,   rating: 4.9, reviewCount: 430,
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
    _id: 'b8',  title: 'Wings of Tomorrow',          author: 'Sol Rivera',
    price: 11.00, salePrice: null,  rating: 4.3, reviewCount: 195,
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
    _id: 'b9',  title: 'The Starless Sea',           author: 'Erin Morgenstern',
    price: 22.50, salePrice: null,  rating: 4.9, reviewCount: 1540,
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
    _id: 'b10', title: 'Wildwood Whispers',          author: 'Elena Rosewood',
    price: 16.99, salePrice: null,  rating: 4.5, reviewCount: 268,
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
    _id: 'b11', title: 'Mathematics Grade 7',        author: 'KIE Press',
    price: 14.00, salePrice: null,  rating: 4.7, reviewCount: 88,
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
    _id: 'b12', title: 'Colours of the Sky',         author: 'A. Linden',
    price: 11.00, salePrice: 8.50,  rating: 4.8, reviewCount: 340,
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
    _id: 'b13', title: 'Things Fall Apart',          author: 'Chinua Achebe',
    price: 19.99, salePrice: null,  rating: 4.9, reviewCount: 3200,
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
    _id: 'b14', title: 'English Workbook Grade 4',   author: 'KICD',
    price: 10.00, salePrice: null,  rating: 4.4, reviewCount: 210,
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
    _id: 'b15', title: 'Science & Tech Grade 6',     author: 'Focus Publishers',
    price: 13.50, salePrice: null,  rating: 4.5, reviewCount: 142,
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
    _id: 'b16', title: 'Social Studies Grade 3',     author: 'Longhorn',
    price: 9.00, salePrice: null,   rating: 4.2, reviewCount: 95,
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
  // Generate realistic breakdown based on average rating
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
    <div style={{
      background: 'rgba(255,255,255,0.52)',
      border: '1px solid rgba(200,170,130,0.28)',
      borderRadius: '16px', padding: '18px 20px',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: `hsl(${review.id * 47}, 45%, 75%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: '700', color: '#fff',
            fontFamily: "'DM Sans',sans-serif",
          }}>
            {review.name[0]}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#3d2010', fontFamily: "'DM Sans',sans-serif" }}>
              {review.name}
            </div>
            <div style={{ fontSize: '11px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif" }}>
              {review.date}
            </div>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" showCount={false} />
      </div>
      <p style={{ fontSize: '13px', color: '#5c3d1e', fontFamily: "'DM Sans',sans-serif", lineHeight: 1.7 }}>
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
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    )
  }
  
  return (
    <div style={{
      background: `linear-gradient(145deg, ${coverColors[0]}, ${coverColors[1]})`,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '55%', height: '75%',
        background: 'linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))',
        borderRadius: '4px 12px 12px 4px',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '8px 12px 40px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '20px', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '12px',
          background: 'rgba(0,0,0,0.20)', borderRadius: '4px 0 0 4px',
        }}/>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" opacity="0.8">
            <path d="M12 2L9 8H3l5 4-2 6 6-4 6 4-2-6 5-4h-6L12 2Z" fill="rgba(255,255,255,0.9)"/>
          </svg>
        </div>
        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)', fontFamily: "'Playfair Display',serif", fontWeight: '600', textAlign: 'center', lineHeight: 1.4, marginBottom: '6px' }}>
          {book.title}
        </div>
        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', fontFamily: "'DM Sans',sans-serif" }}>
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
    // Find book by slug
    const foundBook = ALL_BOOKS.find(b => b.slug === slug)
    setBook(foundBook)
    
    if (foundBook) {
      setReviews(generateMockReviews(foundBook._id, foundBook.rating, foundBook.reviewCount))
      setRatingBreakdown(getRatingBreakdown(foundBook.rating))
    }
  }, [slug])

  if (!book) {
    return (
      <div style={{ background: '#f5f0e8', minHeight: '100vh', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", color: '#3d2010' }}>Book not found</h2>
          <Link to="/books" style={{ color: '#a0693a', textDecoration: 'none', marginTop: '16px', display: 'inline-block' }}>
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
    <div style={{ background: '#f5f0e8', minHeight: '100vh', paddingTop: '68px' }}>

      {/* Limited edition countdown banner - only for some books */}
      {book._id === 'b1' && (
        <div style={{
          background: 'rgba(160,105,58,0.10)',
          borderBottom: '1px solid rgba(180,140,90,0.20)',
          padding: '10px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
          flexWrap: 'wrap',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="#a0693a" strokeWidth="1.2"/>
            <path d="M7 4v3l2 2" stroke="#a0693a" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: '12.5px', color: '#5c3d1e', fontFamily: "'DM Sans',sans-serif", fontWeight: '500' }}>
            LIMITED EDITION SIGNED COPIES:
          </span>
          <CountdownTimer expiresAt={new Date(Date.now() + 1000 * 60 * 60 * 2 + 1000 * 60 * 44 + 12000).toISOString()} variant="inline" />
          <span style={{ fontSize: '12px', color: '#7a5c3a', fontFamily: "'DM Sans',sans-serif" }}>REMAINING</span>
        </div>
      )}

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px clamp(16px,4vw,40px)' }}>

        {/* Breadcrumb */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '12px', color: '#9a7a5a',
          fontFamily: "'DM Sans',sans-serif", marginBottom: '32px',
          flexWrap: 'wrap',
        }}>
          <Link to="/" style={{ color: '#9a7a5a', textDecoration: 'none' }}>Home</Link>
          <span style={{ color: '#c4a882' }}>›</span>
          <Link to="/books" style={{ color: '#9a7a5a', textDecoration: 'none' }}>Books</Link>
          <span style={{ color: '#c4a882' }}>›</span>
          <span style={{ color: '#c4a882' }}>›</span>
          <span style={{ color: '#5c3d1e', fontWeight: '500' }}>{book.title}</span>
        </div>

        {/* Main grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '56px', marginBottom: '64px', alignItems: 'start',
        }}
          className="detail-grid"
        >
          {/* Left — cover */}
          <div>
            <div style={{
              borderRadius: '20px', overflow: 'hidden',
              aspectRatio: '3/4', maxHeight: '520px',
              position: 'relative',
              boxShadow: '0 24px 64px rgba(100,60,20,0.20)',
            }}>
              <BookCover book={book} coverColors={coverColors} />

              {/* Badge */}
              {book.badge && (
                <div style={{
                  position: 'absolute', top: '16px', left: '16px',
                  background: 'rgba(160,105,58,0.15)',
                  border: '1px solid rgba(160,105,58,0.35)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px', padding: '5px 12px',
                  fontSize: '10.5px', fontWeight: '700', color: '#7a4e22',
                  fontFamily: "'DM Sans',sans-serif",
                }}>
                  {book.badge}
                </div>
              )}

              {/* Share button */}
              <button style={{
                position: 'absolute', bottom: '16px', right: '16px',
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(180,140,90,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>
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
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              fontSize: '11.5px', color: '#a0693a',
              fontFamily: "'DM Sans',sans-serif", fontWeight: '600',
              letterSpacing: '0.04em', textTransform: 'uppercase',
              marginBottom: '10px', flexWrap: 'wrap',
            }}>
              {categoryName}
              <span style={{ color: '#c4a882' }}>›</span>
              <span style={{ color: '#9a7a5a', fontWeight: '400', textTransform: 'none', letterSpacing: 0 }}>
                {selectedFormat} Edition
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: 'clamp(26px,3.5vw,38px)',
              fontWeight: '700', color: '#3d2010',
              lineHeight: 1.2, marginBottom: '6px',
            }}>
              {book.title}
            </h1>

            <p style={{
              fontSize: '15px', color: '#9a7a5a',
              fontFamily: "'DM Sans',sans-serif",
              fontStyle: 'italic', marginBottom: '14px',
            }}>
              by <span style={{ color: '#a0693a' }}>{book.author}</span>
            </p>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <StarRating rating={book.rating} size="md" showCount={false} />
              <span style={{ fontSize: '13px', color: '#a0693a', fontFamily: "'DM Sans',sans-serif", fontWeight: '600' }}>
                {book.rating}
              </span>
              <span style={{
                fontSize: '12.5px', color: '#9a7a5a',
                fontFamily: "'DM Sans',sans-serif",
              }}>
                ({formatReviewCount(book.reviewCount)})
              </span>
            </div>

            {/* Price */}
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: '12px',
              marginBottom: '24px', flexWrap: 'wrap',
            }}>
              <span style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: '32px', fontWeight: '700', color: '#3d2010',
              }}>
                {formatPrice(finalPrice)}
              </span>
              {book.salePrice && (
                <>
                  <span style={{
                    fontSize: '16px', color: '#b8998a',
                    fontFamily: "'DM Sans',sans-serif",
                    textDecoration: 'line-through',
                  }}>
                    {formatPrice(originalPrice)}
                  </span>
                  <span style={{
                    fontSize: '12px', fontWeight: '700', color: '#2d7a45',
                    fontFamily: "'DM Sans',sans-serif",
                    background: 'rgba(60,140,80,0.10)',
                    padding: '3px 9px', borderRadius: '10px',
                  }}>
                    Save {savePercent}%
                  </span>
                </>
              )}
            </div>

            {/* Format selector */}
            {book.formats && book.formats.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  fontSize: '11px', fontWeight: '600', color: '#5c3d1e',
                  textTransform: 'uppercase', letterSpacing: '0.07em',
                  fontFamily: "'DM Sans',sans-serif", marginBottom: '10px',
                }}>
                  Select Format
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {book.formats.map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setSelectedFormat(fmt)}
                      style={{
                        padding: '8px 16px', borderRadius: '20px',
                        border: `1.5px solid ${selectedFormat === fmt ? '#a0693a' : 'rgba(180,140,90,0.3)'}`,
                        background: selectedFormat === fmt
                          ? 'rgba(160,105,58,0.14)'
                          : 'rgba(255,255,255,0.6)',
                        color: selectedFormat === fmt ? '#5c3520' : '#7a5c3a',
                        fontSize: '12.5px', fontWeight: selectedFormat === fmt ? '600' : '400',
                        fontFamily: "'DM Sans',sans-serif",
                        cursor: 'pointer', transition: 'all 0.2s',
                      }}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                fontSize: '11px', fontWeight: '600', color: '#5c3d1e',
                textTransform: 'uppercase', letterSpacing: '0.07em',
                fontFamily: "'DM Sans',sans-serif", marginBottom: '10px',
              }}>
                Quantity
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{
                    width: '38px', height: '38px',
                    background: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(180,140,90,0.3)', borderRight: 'none',
                    borderRadius: '10px 0 0 10px',
                    cursor: 'pointer', fontSize: '16px', color: '#7a4e22',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  −
                </button>
                <div style={{
                  width: '48px', height: '38px',
                  background: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(180,140,90,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: '600', color: '#3d2010',
                  fontFamily: "'DM Sans',sans-serif",
                }}>
                  {qty}
                </div>
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{
                    width: '38px', height: '38px',
                    background: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(180,140,90,0.3)', borderLeft: 'none',
                    borderRadius: '0 10px 10px 0',
                    cursor: 'pointer', fontSize: '16px', color: '#7a4e22',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1, minWidth: '180px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: added
                    ? 'rgba(60,140,80,0.15)'
                    : 'linear-gradient(135deg, #c48b52, #a0693a)',
                  border: added ? '1.5px solid rgba(60,140,80,0.35)' : 'none',
                  color: added ? '#2d7a45' : '#fff',
                  padding: '14px 28px', borderRadius: '28px',
                  fontSize: '14px', fontWeight: '600',
                  fontFamily: "'DM Sans',sans-serif",
                  cursor: 'pointer', transition: 'all 0.25s ease',
                  boxShadow: added ? 'none' : '0 6px 24px rgba(160,105,58,0.35)',
                }}
              >
                {added ? (
                  <><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#2d7a45" strokeWidth="1.4"/><path d="M5 8l2.5 2.5 4-4" stroke="#2d7a45" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> Added to Basket!</>
                ) : (
                  <><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2H3.5L5.5 10H12L13.5 5H4.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6.5" cy="12.5" r="1" fill="white"/><circle cx="11.5" cy="12.5" r="1" fill="white"/></svg> Add to Basket</>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(book)}
                style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: wishlisted ? 'rgba(160,105,58,0.15)' : 'rgba(255,255,255,0.7)',
                  border: `1.5px solid ${wishlisted ? '#a0693a' : 'rgba(180,140,90,0.35)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
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
            <div style={{
              display: 'flex', gap: '20px', flexWrap: 'wrap',
              padding: '14px 0',
              borderTop: '1px solid rgba(180,140,90,0.18)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#7a5c3a', fontFamily: "'DM Sans',sans-serif" }}>
                <span style={{ fontSize: '14px' }}>🚚</span> Ships in 24 hours
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#7a5c3a', fontFamily: "'DM Sans',sans-serif" }}>
                <span style={{ fontSize: '14px' }}>📖</span> Free chapter preview
              </div>
              {book.ageRange && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#7a5c3a', fontFamily: "'DM Sans',sans-serif" }}>
                  <span style={{ fontSize: '14px' }}>🎯</span> Ages {book.ageRange}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ marginBottom: '64px' }} id="reviews">
          <div style={{
            display: 'flex', borderBottom: '1px solid rgba(180,140,90,0.2)',
            marginBottom: '28px', gap: '0', flexWrap: 'wrap',
          }}>
            {['description', 'details', 'reviews'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: '12px 24px', background: 'none', border: 'none',
                  borderBottom: `2px solid ${tab === t ? '#a0693a' : 'transparent'}`,
                  color: tab === t ? '#a0693a' : '#9a7a5a',
                  fontSize: '13.5px', fontWeight: tab === t ? '600' : '400',
                  fontFamily: "'DM Sans',sans-serif",
                  cursor: 'pointer', transition: 'all 0.2s',
                  textTransform: 'capitalize', marginBottom: '-1px',
                }}
              >
                {t} {t === 'reviews' ? `(${book.reviewCount.toLocaleString()})` : ''}
              </button>
            ))}
          </div>

          {tab === 'description' && (
            <div style={{ maxWidth: '720px' }}>
              {book.description ? (
                book.description.split('\n\n').map((para, i) => (
                  <p key={i} style={{
                    fontSize: '14px', color: '#5c3d1e', lineHeight: 1.8,
                    fontFamily: "'DM Sans',sans-serif", marginBottom: '16px',
                  }}>
                    {para}
                  </p>
                ))
              ) : (
                <p style={{
                  fontSize: '14px', color: '#5c3d1e', lineHeight: 1.8,
                  fontFamily: "'DM Sans',sans-serif",
                }}>
                  No description available for this book.
                </p>
              )}
            </div>
          )}

          {tab === 'details' && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '12px', maxWidth: '720px',
            }}>
              {[
                ['ISBN', book.isbn],
                ['Pages', book.pageCount],
                ['Published', book.publishedDate],
                ['Publisher', book.publisher],
                ['Language', book.language],
                ['Age Range', book.ageRange],
                ['Categories', book.categories?.join(', ')],
              ].filter(([_, value]) => value).map(([label, value]) => (
                <div key={label} style={{
                  background: 'rgba(255,255,255,0.52)',
                  border: '1px solid rgba(200,170,130,0.25)',
                  borderRadius: '12px', padding: '12px 16px',
                  backdropFilter: 'blur(10px)',
                }}>
                  <div style={{ fontSize: '10px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif", fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#3d2010', fontFamily: "'DM Sans',sans-serif", fontWeight: '500' }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'reviews' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', alignItems: 'start' }}
              className="reviews-grid"
            >
              {/* Rating breakdown */}
              <div style={{
                background: 'rgba(255,255,255,0.52)',
                border: '1px solid rgba(200,170,130,0.28)',
                borderRadius: '20px', padding: '24px',
                backdropFilter: 'blur(12px)',
                position: 'sticky', top: '84px',
              }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '52px', fontWeight: '700', color: '#3d2010', lineHeight: 1 }}>
                    {book.rating}
                  </div>
                  <StarRating rating={book.rating} size="lg" showCount={false} />
                  <div style={{ fontSize: '12px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif", marginTop: '6px' }}>
                    {formatReviewCount(book.reviewCount)}
                  </div>
                </div>
                {ratingBreakdown.map(({ stars, pct }) => (
                  <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#7a5c3a', fontFamily: "'DM Sans',sans-serif", width: '10px' }}>{stars}</span>
                    <span style={{ fontSize: '11px', color: '#a0693a' }}>★</span>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(160,105,58,0.12)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: '#a0693a', borderRadius: '3px', transition: 'width 0.6s ease' }}/>
                    </div>
                    <span style={{ fontSize: '11px', color: '#9a7a5a', fontFamily: "'DM Sans',sans-serif", width: '28px', textAlign: 'right' }}>{pct}%</span>
                  </div>
                ))}
              </div>

              {/* Review cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
              </div>
            </div>
          )}
        </div>

        {/* Related books */}
        <div style={{ borderTop: '1px solid rgba(180,140,90,0.18)', paddingTop: '48px' }}>
          <div style={{ marginBottom: '4px' }}>
            <div style={{ fontSize: '11px', color: '#a0693a', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'DM Sans',sans-serif", marginBottom: '4px' }}>
              CURATED FOR YOU
            </div>
          </div>
          <FeaturedCarousel title="Readers Also Loved" viewAllHref="/sh" />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .detail-grid   { grid-template-columns: 1fr !important; gap: 32px !important }
          .reviews-grid  { grid-template-columns: 1fr !important }
        }
      `}</style>
    </div>
  )
}