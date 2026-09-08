import { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/product/ProductSkeleton';

const PRICE_RANGES = [
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 to $50', min: 25, max: 50 },
  { label: '$50 to $100', min: 50, max: 100 },
  { label: '$100 to $200', min: 100, max: 200 },
  { label: '$200 & Above', min: 200, max: 999999 },
];

const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'newest', label: 'Newest Arrivals' },
];

const CATEGORIES = [
  { name: 'All', slug: '' },
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Books', slug: 'books' },
  { name: 'Home & Kitchen', slug: 'home-kitchen' },
  { name: 'Clothing', slug: 'clothing' },
  { name: 'Toys', slug: 'toys' },
  { name: 'Sports', slug: 'sports' },
];

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const { categorySlug } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  // Filters
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [priceRange, setPriceRange] = useState(null);
  const [minRating, setMinRating] = useState(0);

  const query = searchParams.get('q');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();

        if (query) params.append('q', query);
        if (categorySlug) params.append('category', categorySlug);
        if (sort) params.append('sort', sort);
        if (priceRange) {
          params.append('minPrice', priceRange.min);
          params.append('maxPrice', priceRange.max);
        }
        if (minRating > 0) params.append('minRating', minRating);

        const res = await axios.get(`/api/products?${params.toString()}`);
        setProducts(res.data.products);
        setTotal(res.data.total);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, categorySlug, sort, priceRange, minRating]);

  const clearFilters = () => {
    setSort('');
    setPriceRange(null);
    setMinRating(0);
  };

  const hasActiveFilters = sort || priceRange || minRating > 0;

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 max-w-screen-2xl mx-auto">

      {/* ── Sidebar Filters ── */}
      <aside className="w-full md:w-60 flex-shrink-0">
        <div className="bg-white rounded-sm shadow-sm p-4">
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline mb-3 block">
              ✕ Clear all filters
            </button>
          )}

          {/* Department */}
          <div className="mb-5">
            <h3 className="font-bold text-sm mb-2 border-b pb-1">Department</h3>
            <ul className="space-y-1">
              {CATEGORIES.map(cat => (
                <li key={cat.slug}>
                  <Link
                    to={cat.slug ? `/category/${cat.slug}` : '/search'}
                    className={`text-sm block py-0.5 hover:text-amber-600 transition-colors ${
                      (categorySlug === cat.slug || (!categorySlug && !cat.slug))
                        ? 'font-bold text-gray-900'
                        : 'text-blue-700'
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Reviews */}
          <div className="mb-5">
            <h3 className="font-bold text-sm mb-2 border-b pb-1">Customer Review</h3>
            <ul className="space-y-1">
              {[4, 3, 2, 1].map(stars => (
                <li key={stars}>
                  <button
                    onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                    className={`text-sm flex items-center gap-1 py-0.5 w-full text-left transition-colors ${
                      minRating === stars ? 'text-amber-600 font-bold' : 'text-blue-700 hover:text-amber-600'
                    }`}
                  >
                    <span className="text-amber-400">{'★'.repeat(stars)}{'☆'.repeat(4 - stars)}</span>
                    <span>& Up</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div className="mb-5">
            <h3 className="font-bold text-sm mb-2 border-b pb-1">Price</h3>
            <ul className="space-y-1">
              {PRICE_RANGES.map(range => (
                <li key={range.label}>
                  <button
                    onClick={() => setPriceRange(priceRange?.label === range.label ? null : { ...range })}
                    className={`text-sm block py-0.5 w-full text-left transition-colors ${
                      priceRange?.label === range.label ? 'font-bold text-amber-600' : 'text-blue-700 hover:text-amber-600'
                    }`}
                  >
                    {range.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 min-w-0">
        {/* Results Bar */}
        <div className="bg-white border border-gray-200 p-3 mb-4 rounded-sm shadow-sm flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-gray-700">
            {loading ? 'Searching...' : (
              <>
                <span className="font-bold">{total.toLocaleString()}</span> result{total !== 1 ? 's' : ''}
                {query && <> for <span className="font-bold italic">"{query}"</span></>}
                {categorySlug && <> in <span className="font-bold capitalize">{categorySlug.replace('-', ' & ')}</span></>}
              </>
            )}
          </span>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="border border-gray-300 rounded text-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <ProductGridSkeleton count={12} />
        ) : error ? (
          <div className="bg-white p-8 text-center rounded-sm text-red-600">
            <p className="text-lg font-medium mb-2">Something went wrong</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-sm">
            <p className="text-3xl mb-4">🔍</p>
            <h2 className="text-xl font-bold mb-2">No results found</h2>
            <p className="text-gray-600 text-sm mb-4">
              {query
                ? `No matches for "${query}". Try different keywords or check your spelling.`
                : 'No products match your current filters.'}
            </p>
            <button onClick={clearFilters} className="text-blue-600 hover:underline text-sm mr-4">Clear filters</button>
            <Link to="/" className="text-blue-600 hover:underline text-sm">Back to home</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
