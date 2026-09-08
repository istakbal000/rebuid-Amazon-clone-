import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/product/ProductSkeleton';

const CATEGORIES = [
  { name: 'Electronics', slug: 'electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop', color: 'bg-blue-50' },
  { name: 'Books', slug: 'books', img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop', color: 'bg-yellow-50' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', color: 'bg-green-50' },
  { name: 'Clothing', slug: 'clothing', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop', color: 'bg-pink-50' },
  { name: 'Toys', slug: 'toys', img: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop', color: 'bg-purple-50' },
  { name: 'Sports', slug: 'sports', img: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=300&fit=crop', color: 'bg-orange-50' },
];

const DEALS = [
  { label: 'Up to 30% off Electronics', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=260&fit=crop', link: '/category/electronics' },
  { label: 'Best Sellers in Books', img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=260&fit=crop', link: '/category/books' },
  { label: 'Kitchen Essentials', img: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=260&fit=crop', link: '/category/home-kitchen' },
  { label: 'Sports & Fitness Deals', img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=260&fit=crop', link: '/category/sports' },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [topRated, newest] = await Promise.all([
          axios.get('/api/products?sort=rating&limit=8'),
          axios.get('/api/products?sort=newest&limit=8'),
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

  return (
    <div className="max-w-screen-2xl mx-auto">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#eaeded] z-10 pointer-events-none" />
        <img
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000"
          alt="Shop great deals"
          className="w-full object-cover h-[280px] md:h-[400px] lg:h-[500px]"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-start px-8 md:px-16">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-10 shadow-2xl max-w-sm">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-2">Limited Time Offer</p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">Big Deals.<br />Every Day.</h1>
            <p className="text-gray-600 text-sm mb-5">Shop electronics, books, fashion, home & more at unbeatable prices.</p>
            <Link
              to="/search"
              className="inline-block bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-6 py-2.5 rounded-full text-sm transition-colors shadow-md"
            >
              Shop Now →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Categories Grid ── */}
      <div className="px-4 -mt-12 relative z-20">
        <h2 className="text-xl font-bold text-gray-900 mb-4 mt-4">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className={`${cat.color} rounded-xl p-3 flex flex-col items-center hover:shadow-md transition-shadow group`}
            >
              <img src={cat.img} alt={cat.name} className="w-full h-24 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-semibold text-gray-800 text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Today's Deals ── */}
      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Today's Deals</h2>
          <Link to="/search" className="text-sm text-blue-600 hover:underline">See all deals →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {DEALS.map((deal, i) => (
            <Link key={i} to={deal.link} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
              <div className="overflow-hidden">
                <img src={deal.img} alt={deal.label} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-800 line-clamp-2">{deal.label}</p>
                <p className="text-xs text-amber-600 font-medium mt-1">Shop now →</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Top Rated Products ── */}
      <div className="px-4 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Top Rated Products</h2>
          <Link to="/search?sort=rating" className="text-sm text-blue-600 hover:underline">See all →</Link>
        </div>
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* ── Promotional Banner ── */}
      <div className="px-4 mt-10">
        <div className="bg-gradient-to-r from-[#131921] to-[#232f3e] rounded-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between p-6 md:p-10 gap-6">
          <div className="text-white">
            <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-2">Free Shipping</p>
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Orders over $100<br />ship FREE!</h3>
            <p className="text-gray-400 text-sm mb-5">No minimum on Prime items. Enjoy fast, free delivery on millions of items.</p>
            <Link to="/search" className="inline-block bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-6 py-2.5 rounded-full text-sm transition-colors">
              Start Shopping
            </Link>
          </div>
          <img
            src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=260&fit=crop"
            alt="Fast delivery"
            className="w-full md:w-72 h-40 object-cover rounded-xl shadow-xl"
          />
        </div>
      </div>

      {/* ── New Arrivals ── */}
      <div className="px-4 mt-10 mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">New Arrivals</h2>
          <Link to="/search?sort=newest" className="text-sm text-blue-600 hover:underline">See all →</Link>
        </div>
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {newArrivals.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
