import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Zap, Star, ChevronRight } from 'lucide-react';
import Rating from '../components/product/Rating';
import CartContext from '../context/CartContext';
import { ProductGridSkeleton } from '../components/product/ProductSkeleton';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data.product);
        // Fetch related
        if (res.data.product?.category?.slug) {
          const relRes = await axios.get(`/api/products?category=${res.data.product.category.slug}&limit=4`);
          setRelated(relRes.data.products.filter(p => p._id !== id));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    setSelectedImage(0);
  }, [id]);

  const handleAddToCart = async () => {
    const added = await addToCart(product._id, quantity);
    // toast is already shown inside addToCart
  };

  const handleBuyNow = async () => {
    const added = await addToCart(product._id, quantity);
    if (added) navigate('/checkout');
  };

  const discount = product?.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto p-4">
        <div className="bg-white p-6 rounded-sm animate-pulse">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/3 h-96 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
            <div className="w-full lg:w-64 h-60 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) return (
    <div className="max-w-screen-xl mx-auto p-8 text-center">
      <p className="text-4xl mb-4">😕</p>
      <h2 className="text-xl font-bold mb-2 text-red-600">{error}</h2>
      <Link to="/" className="text-blue-600 hover:underline">Back to home</Link>
    </div>
  );

  if (!product) return (
    <div className="max-w-screen-xl mx-auto p-8 text-center">
      <p className="text-xl text-gray-500">Product not found</p>
      <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">Back to home</Link>
    </div>
  );

  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Breadcrumb */}
      <nav className="px-4 py-2 flex items-center gap-1 text-xs text-gray-500">
        <Link to="/" className="hover:text-amber-600">Home</Link>
        <ChevronRight className="h-3 w-3" />
        {product.category && (
          <>
            <Link to={`/category/${product.category.slug}`} className="hover:text-amber-600 capitalize">
              {product.category.name}
            </Link>
            <ChevronRight className="h-3 w-3" />
          </>
        )}
        <span className="text-gray-700 line-clamp-1 max-w-[200px]">{product.title}</span>
      </nav>

      <div className="bg-white p-4 md:p-6">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left: Image Gallery ── */}
          <div className="w-full lg:w-2/5 flex gap-3">
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex flex-col gap-2 w-14">
                {product.images.map((img, index) => (
                  <div
                    key={index}
                    className={`border-2 cursor-pointer rounded overflow-hidden transition-colors ${selectedImage === index ? 'border-amber-400' : 'border-gray-200 hover:border-gray-400'}`}
                    onMouseEnter={() => setSelectedImage(index)}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt="" className="w-full h-14 object-contain p-1" />
                  </div>
                ))}
              </div>
            )}
            {/* Main Image */}
            <div className="flex-1 border border-gray-200 rounded-lg p-4 flex justify-center items-center bg-gray-50 min-h-[350px]">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="max-w-full max-h-[400px] object-contain"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'; }}
              />
            </div>
          </div>

          {/* ── Center: Product Info ── */}
          <div className="w-full lg:flex-1 flex flex-col">
            <h1 className="text-xl md:text-2xl font-medium leading-tight mb-2 text-gray-900">{product.title}</h1>

            <Link to={`/category/${product.category?.slug}`} className="text-sm text-blue-600 hover:underline mb-3">
              Brand: <span className="font-medium">{product.brand}</span> · Visit the {product.brand} Store
            </Link>

            <div className="flex items-center gap-2 border-b pb-3 mb-3">
              <Rating value={product.rating} text="" />
              <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                {product.reviewCount?.toLocaleString()} ratings
              </span>
            </div>

            {/* Price */}
            <div className="mb-4 border-b pb-4">
              <div className="flex items-baseline gap-3 flex-wrap">
                {discount > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">-{discount}%</span>
                )}
                <span className="text-3xl font-medium">
                  <span className="text-base align-top">$</span>
                  {Math.floor(product.price)}
                  <span className="text-base align-top">{(product.price % 1).toFixed(2).substring(1)}</span>
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500">
                    Was: <span className="line-through">${product.originalPrice.toFixed(2)}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">All prices include applicable tax</p>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h3 className="font-bold mb-2">About this item</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold mb-2">Technical Details</h3>
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    {product.specifications.map((spec, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="font-medium py-1.5 px-2 w-2/5 text-gray-700 border border-gray-200">{spec.name}</td>
                        <td className="py-1.5 px-2 border border-gray-200">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── Right: Buy Box ── */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="border border-gray-300 rounded-lg p-4 sticky top-4">
              {/* Price in buybox */}
              <div className="text-2xl font-bold mb-1">${product.price.toFixed(2)}</div>

              <div className="text-sm mb-3 space-y-1">
                <p className="text-blue-600 hover:underline cursor-pointer">FREE Returns</p>
                <p>FREE delivery <span className="font-bold">Tomorrow</span></p>
                <p className="text-xs text-gray-500">Order within <span className="text-green-600 font-bold">5 hrs 23 mins</span></p>
              </div>

              <div className="mb-4">
                {product.stock > 0 ? (
                  <span className="text-green-700 font-medium">In Stock</span>
                ) : (
                  <span className="text-red-700 font-medium">Out of Stock</span>
                )}
                {product.stock > 0 && product.stock <= 5 && (
                  <p className="text-red-600 text-xs mt-0.5">Only {product.stock} left in stock!</p>
                )}
              </div>

              {product.stock > 0 && (
                <>
                  <div className="mb-4">
                    <label htmlFor="qty-select" className="text-sm font-medium block mb-1">Quantity:</label>
                    <select
                      id="qty-select"
                      value={quantity}
                      onChange={e => setQuantity(Number(e.target.value))}
                      className="border border-gray-300 rounded-md p-1.5 w-24 shadow-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      {[...Array(Math.min(product.stock, 10)).keys()].map(x => (
                        <option key={x + 1} value={x + 1}>{x + 1}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 mb-4">
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-amber-400 hover:bg-amber-500 py-2.5 rounded-full shadow-sm text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-full shadow-sm text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Zap className="h-4 w-4" />
                      Buy Now
                    </button>
                  </div>
                </>
              )}

              <div className="text-xs text-gray-500 border-t pt-3 space-y-1">
                <div className="flex justify-between"><span>Ships from</span><span className="font-medium">ShopNest</span></div>
                <div className="flex justify-between"><span>Sold by</span><span className="font-medium">{product.brand}</span></div>
                <div className="flex justify-between"><span>Returns</span><span className="text-blue-600 cursor-pointer hover:underline">Eligible</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <div className="p-4 mt-2">
          <h2 className="text-xl font-bold mb-4">Customers also viewed</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {related.slice(0, 4).map(p => (
              <Link key={p._id} to={`/product/${p._id}`} className="bg-white p-3 rounded-sm hover:shadow-md transition-shadow">
                <img src={p.images[0]} alt={p.title} className="w-full h-36 object-contain mb-2" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'; }} />
                <p className="text-sm text-blue-800 hover:text-amber-600 line-clamp-2 mb-1">{p.title}</p>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-gray-600">{p.rating}</span>
                </div>
                <p className="font-bold text-sm mt-1">${p.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
