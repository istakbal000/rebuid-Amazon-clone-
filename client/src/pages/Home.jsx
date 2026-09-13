import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/product/ProductSkeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=2000"
];

const AMAZON_CATEGORIES = [
  {
    title: "Gaming accessories",
    slug: "electronics",
    items: [
      { name: "Headsets", img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=150&h=150&fit=crop" },
      { name: "Keyboards", img: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=150&h=150&fit=crop" },
      { name: "Mice", img: "https://images.unsplash.com/photo-1527814050087-179f376dd0e7?w=150&h=150&fit=crop" },
      { name: "Chairs", img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=150&h=150&fit=crop" },
    ],
    linkText: "See more"
  },
  {
    title: "Refresh your space",
    slug: "home-kitchen",
    items: [
      { name: "Dining", img: "https://images.unsplash.com/photo-1617806118233-18e1c094f15d?w=150&h=150&fit=crop" },
      { name: "Home", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=150&h=150&fit=crop" },
      { name: "Kitchen", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=150&h=150&fit=crop" },
      { name: "Health", img: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=150&h=150&fit=crop" },
    ],
    linkText: "See more"
  },
  {
    title: "Top Books",
    slug: "books",
    items: [
      { name: "Fiction", img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=150&h=150&fit=crop" },
      { name: "Science", img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=150&h=150&fit=crop" },
      { name: "History", img: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=150&h=150&fit=crop" },
      { name: "Fantasy", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=150&h=150&fit=crop" },
    ],
    linkText: "Shop now"
  },
  {
    title: "Sports & Outdoors",
    slug: "sports",
    items: [
      { name: "Fitness", img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=150&h=150&fit=crop" },
      { name: "Outdoors", img: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=150&h=150&fit=crop" },
      { name: "Team Sports", img: "https://images.unsplash.com/photo-1518605368461-1e1e38dd1a31?w=150&h=150&fit=crop" },
      { name: "Running", img: "https://images.unsplash.com/photo-1530143311094-34d807799e8f?w=150&h=150&fit=crop" },
    ],
    linkText: "Shop now"
  }
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [topRated, newest] = await Promise.all([
          axios.get('/api/products?sort=rating&limit=10'),
          axios.get('/api/products?sort=newest&limit=10'),
        ]);
        setFeaturedProducts(topRated.data.products);
        setNewArrivals(newest.data.products);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex(prev => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextHero = () => setCurrentHeroIndex(prev => (prev + 1) % HERO_IMAGES.length);
  const prevHero = () => setCurrentHeroIndex(prev => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);

  return (
    <div className="bg-amazon-bg min-h-screen pb-10 max-w-[1500px] mx-auto">
      {/* ── Hero Carousel ── */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[600px] overflow-hidden group">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-amazon-bg via-transparent to-transparent pointer-events-none h-full" />
        
        {/* Navigation arrows */}
        <button onClick={prevHero} className="absolute left-4 top-32 z-20 opacity-0 group-hover:opacity-100 transition-opacity p-2 border-2 border-transparent hover:border-white rounded-sm">
          <ChevronLeft size={48} className="text-white drop-shadow-lg" />
        </button>
        <button onClick={nextHero} className="absolute right-4 top-32 z-20 opacity-0 group-hover:opacity-100 transition-opacity p-2 border-2 border-transparent hover:border-white rounded-sm">
          <ChevronRight size={48} className="text-white drop-shadow-lg" />
        </button>

        {HERO_IMAGES.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt="Hero banner"
            className={`absolute top-0 left-0 w-full object-cover transition-opacity duration-700 h-[600px] ${
              idx === currentHeroIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ objectPosition: 'top center' }}
          />
        ))}
      </div>

      {/* ── Amazon-style Category Cards ── */}
      <div className="relative z-20 -mt-[150px] sm:-mt-[200px] md:-mt-[350px] px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {AMAZON_CATEGORIES.map((cat, idx) => (
          <div key={idx} className="bg-white p-5 flex flex-col z-20 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-3">{cat.title}</h2>
            <div className="grid grid-cols-2 gap-3 mb-3 flex-1">
              {cat.items.map((item, i) => (
                <Link to={`/category/${cat.slug}`} key={i} className="flex flex-col cursor-pointer">
                  <img src={item.img} alt={item.name} className="w-full h-24 sm:h-28 object-cover mb-1" />
                  <span className="text-xs text-gray-700">{item.name}</span>
                </Link>
              ))}
            </div>
            <Link to={`/category/${cat.slug}`} className="text-[13px] text-amazon-link hover:text-amazon-link-hover mt-auto">
              {cat.linkText}
            </Link>
          </div>
        ))}
      </div>

      {/* ── Deals of the Day (Top Rated Scroller) ── */}
      <div className="px-4 mt-6 z-20 relative">
        <div className="bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-xl font-bold">Top Rated Products</h2>
            <Link to="/search?sort=rating" className="text-[13px] text-amazon-link hover:text-amazon-link-hover font-medium">See all deals</Link>
          </div>
          
          {loading ? (
            <ProductGridSkeleton count={5} />
          ) : (
            <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x">
              {featuredProducts?.map(product => (
                <div key={product._id} className="min-w-[200px] w-[200px] sm:min-w-[250px] sm:w-[250px] flex-shrink-0 snap-start border border-transparent hover:border-gray-200 p-2">
                  <Link to={`/product/${product._id}`}>
                    <div className="w-full h-48 bg-[#f7f7f7] flex items-center justify-center p-2 mb-2">
                      <img src={product.images[0]} alt={product.title} className="max-h-full mix-blend-multiply object-contain" />
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#cc0c39] text-white text-xs font-bold px-1.5 py-1">Up to 25% off</span>
                      <span className="text-[#cc0c39] font-bold text-xs">Deal of the Day</span>
                    </div>
                    <h4 className="text-sm line-clamp-1 text-gray-800">{product.title}</h4>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Related Scroller (New Arrivals) ── */}
      <div className="px-4 mt-6 z-20 relative mb-8">
        <div className="bg-white p-5 shadow-sm border border-gray-100">
          <div className="flex items-baseline gap-4 mb-4">
            <h2 className="text-xl font-bold">New Arrivals Inspired by Your Browsing</h2>
            <Link to="/search?sort=newest" className="text-[13px] text-amazon-link hover:text-amazon-link-hover font-medium">Explore more</Link>
          </div>
          
          {loading ? (
            <ProductGridSkeleton count={5} />
          ) : (
            <div className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x">
              {newArrivals?.map(product => (
                <div key={product._id} className="min-w-[200px] w-[200px] sm:min-w-[250px] sm:w-[250px] flex-shrink-0 snap-start border border-transparent hover:border-gray-200 p-2">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Home;
