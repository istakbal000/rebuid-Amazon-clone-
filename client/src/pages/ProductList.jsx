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
  { name: 'Sports & Outdoors', slug: 'sports' },
];

const StarRow = ({ stars, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
      selected
        ? 'bg-amber-50 border border-amber-400 text-amber-700'
        : 'hover:bg-gray-100 text-gray-700 border border-transparent'
    }`}
  >
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= stars ? 'text-amber-400 text-base' : 'text-gray-300 text-base'}>★</span>
      ))}
    </span>
    <span className="text-xs">& Up</span>
    {selected && <span className="ml-auto text-amber-600 text-xs font-bold">✓</span>}
  </button>
);

const SidebarSection = ({ title, children }) => (
  <div className="mb-1">
    <div className="px-4 py-2 bg-gray-100 border-b border-gray-300">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{title}</h3>
    </div>
    <div className="px-3 py-2">
      {children}
    </div>
  </div>
);

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const { categorySlug } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [priceRange, setPriceRange] = useState(null);
  const [minRating, setMinRating] = useState(0);

  const query = searchParams.get('q');
  const activeCategory = categorySlug || '';

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

  const activeFilterCount = (sort ? 1 : 0) + (priceRange ? 1 : 0) + (minRating > 0 ? 1 : 0);

  const Sidebar = () => (
    <div className="bg-white border border-gray-300 rounded-sm overflow-hidden">
      {/* Active filters banner */}
      {activeFilterCount > 0 && (
        <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-800">
            {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied
          </span>
          <button
            onClick={clearFilters}
            className="text-xs text-red-600 hover:text-red-800 font-semibold hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ── Department ── */}
      <SidebarSection title="Department">
        <ul className="space-y-0.5">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.slug;
            return (
              <li key={cat.slug}>
                <Link
                  to={cat.slug ? `/category/${cat.slug}` : '/search'}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-all ${
                    isActive
                      ? 'font-bold text-gray-900 bg-orange-50 border-l-4 border-[#f90] pl-1'
                      : 'text-blue-700 hover:text-[#f90] hover:bg-gray-50 hover:underline'
                  }`}
                >
                  {isActive && <span className="text-[#f90] text-xs">▶</span>}
                  {cat.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </SidebarSection>

      {/* ── Customer Reviews ── */}
      <SidebarSection title="Customer Review">
        <div className="space-y-1">
          {[4, 3, 2, 1].map(stars => (
            <StarRow
              key={stars}
              stars={stars}
              selected={minRating === stars}
              onClick={() => setMinRating(minRating === stars ? 0 : stars)}
            />
          ))}
        </div>
      </SidebarSection>

      {/* ── Price ── */}
      <SidebarSection title="Price">
        <div className="space-y-1">
          {PRICE_RANGES.map(range => {
            const isSelected = priceRange?.label === range.label;
            return (
              <button
                key={range.label}
                onClick={() => setPriceRange(isSelected ? null : { ...range })}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isSelected
                    ? 'bg-amber-50 border border-amber-400 text-amber-800'
                    : 'hover:bg-gray-100 text-blue-700 hover:text-[#f90] border border-transparent'
                }`}
              >
                <span>{range.label}</span>
                {isSelected && <span className="text-amber-600 font-bold text-xs">✓</span>}
              </button>
            );
          })}
        </div>
        {/* Custom price input */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2 font-medium">Set custom range</p>
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
              <input
                type="number"
                placeholder="Min"
                className="w-full border border-gray-300 rounded pl-5 pr-1 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <span className="text-gray-400 text-xs">–</span>
            <div className="relative flex-1">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full border border-gray-300 rounded pl-5 pr-1 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-400"
              />
            </div>
            <button className="bg-gray-200 hover:bg-gray-300 border border-gray-400 px-2 py-1.5 rounded text-xs font-medium transition-colors">
              Go
            </button>
          </div>
        </div>
      </SidebarSection>

      {/* ── Sort (in sidebar for mobile visibility) ── */}
      <SidebarSection title="Sort By">
        <div className="space-y-1">
          {SORT_OPTIONS.map(opt => {
            const isActive = sort === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-50 border border-amber-400 text-amber-800'
                    : 'hover:bg-gray-100 text-gray-700 border border-transparent'
                }`}
              >
                <span>{opt.label}</span>
                {isActive && <span className="text-amber-600 font-bold text-xs">✓</span>}
              </button>
            );
          })}
        </div>
      </SidebarSection>
    </div>
  );

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-4">

      {/* ── Mobile filter toggle ── */}
      <div className="flex items-center justify-between mb-3 md:hidden">
        <span className="text-sm font-medium text-gray-700">
          {loading ? '...' : `${total} results`}
          {query && <span className="italic"> for "{query}"</span>}
        </span>
        <button
          onClick={() => setMobileFiltersOpen(p => !p)}
          className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-gray-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filters {activeFilterCount > 0 && <span className="bg-amber-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>}
        </button>
      </div>

      {/* Mobile filters panel */}
      {mobileFiltersOpen && (
        <div className="md:hidden mb-4">
          <Sidebar />
        </div>
      )}

      <div className="flex gap-4">

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <Sidebar />
        </aside>

        {/* ── Main Content ── */}
        <div className="flex-1 min-w-0">

          {/* Results bar */}
          <div className="bg-white border border-gray-300 px-4 py-2.5 mb-4 rounded-sm shadow-sm flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm text-gray-700">
              {loading ? (
                <span className="animate-pulse">Searching...</span>
              ) : (
                <>
                  <span className="font-bold">{(total || 0).toLocaleString()}</span>
                  {' '}result{total !== 1 ? 's' : ''}
                  {query && <> for <em className="font-semibold not-italic">"{query}"</em></>}
                  {categorySlug && <> in <strong className="capitalize">{categorySlug.replace('-', ' & ')}</strong></>}
                </>
              )}
            </span>
            {/* Desktop sort dropdown */}
            <div className="hidden md:flex items-center gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">Sort by:</label>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="border border-gray-300 rounded text-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-amber-400 bg-white"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filter pills */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {sort && (
                <span className="flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full border border-amber-300">
                  Sort: {SORT_OPTIONS.find(o => o.value === sort)?.label}
                  <button onClick={() => setSort('')} className="ml-1 text-amber-600 hover:text-amber-900 font-bold">×</button>
                </span>
              )}
              {priceRange && (
                <span className="flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full border border-amber-300">
                  {priceRange.label}
                  <button onClick={() => setPriceRange(null)} className="ml-1 text-amber-600 hover:text-amber-900 font-bold">×</button>
                </span>
              )}
              {minRating > 0 && (
                <span className="flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full border border-amber-300">
                  {'★'.repeat(minRating)} & Up
                  <button onClick={() => setMinRating(0)} className="ml-1 text-amber-600 hover:text-amber-900 font-bold">×</button>
                </span>
              )}
            </div>
          )}

          {/* Product grid / states */}
          {loading ? (
            <ProductGridSkeleton count={12} />
          ) : error ? (
            <div className="bg-white p-8 text-center rounded-sm border border-gray-300">
              <p className="text-4xl mb-3">⚠️</p>
              <p className="text-lg font-medium text-red-600 mb-2">Something went wrong</p>
              <p className="text-sm text-gray-500">{error}</p>
            </div>
          ) : (!products || products.length === 0) ? (
            <div className="bg-white p-10 text-center rounded-sm border border-gray-300">
              <p className="text-5xl mb-4">🔍</p>
              <h2 className="text-xl font-bold mb-2 text-gray-800">No results found</h2>
              <p className="text-gray-500 text-sm mb-5">
                {query
                  ? `No products match "${query}". Try different keywords.`
                  : 'No products match the current filters.'}
              </p>
              <div className="flex justify-center gap-4">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium px-5 py-2 rounded-full text-sm transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
                <Link to="/" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-5 py-2 rounded-full text-sm transition-colors">
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products?.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
