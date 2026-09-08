import { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/product/ProductCard';

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const { categorySlug } = useParams();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const query = searchParams.get('q');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = '/api/products';
        const params = new URLSearchParams();
        
        if (query) params.append('q', query);
        if (categorySlug) params.append('category', categorySlug);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const res = await axios.get(url);
        setProducts(res.data.products);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [query, categorySlug]);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      {/* Left Sidebar Filters */}
      <div className="w-full md:w-64 flex-shrink-0 hidden md:block">
        <div className="mb-6">
          <h3 className="font-bold mb-2">Department</h3>
          <ul className="text-sm space-y-1">
            <li><a href="/category/electronics" className={`hover:text-amazon-orange ${categorySlug === 'electronics' ? 'font-bold' : ''}`}>Electronics</a></li>
            <li><a href="/category/books" className={`hover:text-amazon-orange ${categorySlug === 'books' ? 'font-bold' : ''}`}>Books</a></li>
            <li><a href="/category/home-kitchen" className={`hover:text-amazon-orange ${categorySlug === 'home-kitchen' ? 'font-bold' : ''}`}>Home & Kitchen</a></li>
            <li><a href="/category/clothing" className={`hover:text-amazon-orange ${categorySlug === 'clothing' ? 'font-bold' : ''}`}>Clothing</a></li>
            <li><a href="/category/toys" className={`hover:text-amazon-orange ${categorySlug === 'toys' ? 'font-bold' : ''}`}>Toys</a></li>
            <li><a href="/category/sports" className={`hover:text-amazon-orange ${categorySlug === 'sports' ? 'font-bold' : ''}`}>Sports</a></li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold mb-2">Customer Reviews</h3>
          <ul className="text-sm space-y-1 text-amazon-orange">
            <li className="cursor-pointer hover:text-orange-500">★★★★☆ & Up</li>
            <li className="cursor-pointer hover:text-orange-500">★★★☆☆ & Up</li>
            <li className="cursor-pointer hover:text-orange-500">★★☆☆☆ & Up</li>
            <li className="cursor-pointer hover:text-orange-500">★☆☆☆☆ & Up</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="font-bold mb-2">Price</h3>
          <ul className="text-sm space-y-1">
            <li className="cursor-pointer hover:text-amazon-orange">Under $25</li>
            <li className="cursor-pointer hover:text-amazon-orange">$25 to $50</li>
            <li className="cursor-pointer hover:text-amazon-orange">$50 to $100</li>
            <li className="cursor-pointer hover:text-amazon-orange">$100 to $200</li>
            <li className="cursor-pointer hover:text-amazon-orange">$200 & Above</li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="border border-gray-200 bg-white p-2 mb-4 rounded-sm shadow-sm flex items-center shadow">
          <span className="font-bold mr-2 text-sm">
            {products.length} results
          </span>
          <span className="text-sm">
            {query && `for "${query}"`}
            {categorySlug && `in ${categorySlug.replace('-', ' ')}`}
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-2xl">Loading...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-600">{error}</div>
        ) : products.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-sm">
            <h2 className="text-xl font-bold mb-2">No results for {query || categorySlug}</h2>
            <p className="text-gray-600">Try checking your spelling or use more general terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
