import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Rating from '../components/product/Rating';
import CartContext from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product._id, quantity);
    navigate('/cart');
  };

  if (loading) return <div className="text-center py-20 text-2xl">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="bg-white p-4">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left: Image Gallery */}
        <div className="w-full lg:w-1/3 flex gap-4">
          <div className="flex flex-col gap-2 w-16">
            {product.images.map((img, index) => (
              <div 
                key={index} 
                className={`border-2 cursor-pointer rounded-md overflow-hidden ${selectedImage === index ? 'border-amazon-orange' : 'border-transparent'}`}
                onMouseEnter={() => setSelectedImage(index)}
              >
                <img src={img} alt="" className="w-full h-auto object-contain" />
              </div>
            ))}
          </div>
          <div className="flex-1 border p-4 flex justify-center items-center">
            <img src={product.images[selectedImage]} alt={product.title} className="max-w-full max-h-[400px] object-contain" />
          </div>
        </div>

        {/* Center: Product Details */}
        <div className="w-full lg:w-1/3 flex flex-col">
          <h1 className="text-2xl font-medium leading-tight mb-2">{product.title}</h1>
          <div className="text-sm text-blue-600 mb-2 hover:underline cursor-pointer">Brand: {product.brand}</div>
          
          <div className="border-b pb-2 mb-2">
            <Rating value={product.rating} text={`${product.reviewCount} ratings`} />
          </div>

          <div className="mb-4 border-b pb-4">
            <div className="flex items-baseline">
              <span className="text-3xl font-medium text-red-600 mr-2">
                {product.originalPrice ? `-${Math.round((1 - product.price/product.originalPrice)*100)}%` : ''}
              </span>
              <span className="text-3xl font-medium">
                <span className="text-sm align-top">$</span>
                {Math.floor(product.price)}
                <span className="text-sm align-top">{(product.price % 1).toFixed(2).substring(1)}</span>
              </span>
            </div>
            {product.originalPrice && (
              <div className="text-sm text-gray-500">
                List Price: <span className="line-through">${product.originalPrice.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">About this item</h3>
            <p className="text-sm text-gray-800 leading-relaxed">{product.description}</p>
          </div>

          {product.specifications && product.specifications.length > 0 && (
            <div className="mb-4 text-sm">
              <table className="w-full">
                <tbody>
                  {product.specifications.map((spec, index) => (
                    <tr key={index}>
                      <td className="font-bold py-1 w-1/3">{spec.name}</td>
                      <td className="py-1">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Buy Box */}
        <div className="w-full lg:w-1/4">
          <div className="border border-gray-300 rounded-md p-4">
            <div className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</div>
            
            <div className="text-sm mb-4">
              <p className="text-blue-600 hover:underline cursor-pointer">FREE Returns</p>
              <p className="mt-2">FREE delivery <span className="font-bold">Tomorrow</span></p>
            </div>

            <div className="mb-4">
              {product.stock > 0 ? (
                <span className="text-green-700 text-lg font-medium">In Stock</span>
              ) : (
                <span className="text-red-700 text-lg font-medium">Out of Stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <>
                <div className="mb-4">
                  <label htmlFor="quantity" className="text-sm font-medium mr-2">Qty:</label>
                  <select 
                    id="quantity" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="border border-gray-300 rounded-md p-1 shadow-sm bg-gray-100 focus:outline-none focus:ring-1 focus:ring-amazon-orange"
                  >
                    {[...Array(Math.min(product.stock, 10)).keys()].map(x => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 py-2 rounded-full shadow-sm text-sm"
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="w-full bg-amazon-orange hover:bg-orange-500 py-2 rounded-full shadow-sm text-sm"
                  >
                    Buy Now
                  </button>
                </div>
              </>
            )}

            <div className="mt-4 text-xs text-gray-500 flex flex-col gap-1">
              <div className="flex justify-between"><span>Ships from</span><span>Amazon</span></div>
              <div className="flex justify-between"><span>Sold by</span><span>Amazon</span></div>
              <div className="flex justify-between"><span>Returns</span><span className="text-blue-600 hover:underline cursor-pointer">Eligible for Return</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
