import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/product/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data.products);
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
      <div className="relative">
        {/* Hero Image */}
        <div className="absolute w-full h-[600px] bg-gradient-to-t from-[#eaeded] to-transparent z-10 pointer-events-none" />
        <img 
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000" 
          alt="Hero" 
          className="w-full object-cover h-[300px] md:h-[400px] lg:h-[600px] mask-image"
          style={{ maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))' }}
        />

        {/* Product Grid */}
        <div className="relative z-20 -mt-16 md:-mt-36 lg:-mt-72 px-4">
          {loading ? (
            <div className="flex justify-center py-20"><span className="text-2xl">Loading...</span></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {/* Category Cards (Mock) */}
              <div className="bg-white p-5 flex flex-col justify-between shadow-md">
                <h2 className="text-xl font-bold mb-4">Shop Electronics</h2>
                <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=400" alt="Electronics" className="h-64 object-cover mb-4" />
                <a href="/category/electronics" className="text-blue-600 hover:text-amazon-orange text-sm hover:underline">See more</a>
              </div>
              <div className="bg-white p-5 flex flex-col justify-between shadow-md">
                <h2 className="text-xl font-bold mb-4">New in Books</h2>
                <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400" alt="Books" className="h-64 object-cover mb-4" />
                <a href="/category/books" className="text-blue-600 hover:text-amazon-orange text-sm hover:underline">See more</a>
              </div>
              
              {/* Products */}
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
