import { useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CompareContext } from '../context/CompareContext';
import { ArrowLeft, Check, Trophy } from 'lucide-react';
import Rating from '../components/product/Rating';
import CartContext from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';

const Compare = () => {
  const { compareItems, removeFromCompare } = useContext(CompareContext);
  const { addToCart } = useContext(CartContext);
  const { toast } = useContext(ToastContext);
  const navigate = useNavigate();

  // Find best value
  const bestValueId = useMemo(() => {
    if (compareItems.length < 2) return null;
    
    // Deterministic logic: Calculate a score for each product
    // Score = (Rating * 20) + (Discount Percentage) - (Price / 100)
    let bestScore = -Infinity;
    let bestId = null;

    compareItems.forEach(item => {
      const discountPercent = item.originalPrice 
        ? ((item.originalPrice - item.price) / item.originalPrice) * 100 
        : 0;
      
      const score = (item.rating * 20) + discountPercent - (item.price / 100);
      
      if (score > bestScore) {
        bestScore = score;
        bestId = item._id;
      }
    });
    
    return bestId;
  }, [compareItems]);

  // Extract all unique specification names across all compared products
  const allSpecs = useMemo(() => {
    const specsSet = new Set();
    compareItems.forEach(item => {
      if (item.specifications) {
        item.specifications.forEach(spec => specsSet.add(spec.name));
      }
    });
    return Array.from(specsSet);
  }, [compareItems]);

  if (compareItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">No Products to Compare</h2>
        <p className="text-gray-600 mb-8">Add at least two products to compare them side by side.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-yellow-400 hover:bg-yellow-500 px-6 py-2 rounded-full font-medium"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleAddToCart = async (product) => {
    await addToCart(product._id, 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-white min-h-screen">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm text-blue-600 hover:underline">
          <ArrowLeft size={16} className="mr-1" /> Back
        </button>
        <h1 className="text-2xl font-bold mt-4">Compare Products</h1>
      </div>

      <div className="overflow-x-auto pb-4">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="p-4 border-b w-1/4 align-bottom text-gray-500 font-normal">
                Product Details
              </th>
              {compareItems.map(item => (
                <th key={item._id} className="p-4 border-b w-1/4 align-top relative">
                  {bestValueId === item._id && (
                    <div className="absolute top-0 right-4 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm">
                      <Trophy size={12} className="mr-1" /> 🏆 Best Value
                    </div>
                  )}
                  
                  <button 
                    onClick={() => removeFromCompare(item._id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-sm"
                  >
                    Remove
                  </button>
                  
                  <Link to={`/product/${item._id}`} className="block mt-6">
                    <div className="h-40 flex items-center justify-center mb-4">
                      <img src={item.images[0]} alt={item.title} className="max-h-full object-contain" />
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2 hover:text-blue-600 mb-2">{item.title}</h3>
                  </Link>
                  
                  <div className="mb-2">
                    <span className="text-xl font-bold">${item.price.toFixed(2)}</span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">${item.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm mb-4">
                    <Rating value={item.rating} text={item.reviewCount} />
                  </div>
                  
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    Add to Cart
                  </button>
                </th>
              ))}
              {/* Empty columns to keep layout consistent if < 3 items */}
              {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                <th key={i} className="p-4 border-b w-1/4"></th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b font-medium text-gray-700 bg-gray-50">Brand</td>
              {compareItems.map(item => (
                <td key={item._id} className="p-4 border-b">{item.brand}</td>
              ))}
              {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                <td key={i} className="p-4 border-b"></td>
              ))}
            </tr>
            
            <tr>
              <td className="p-4 border-b font-medium text-gray-700 bg-gray-50">Availability</td>
              {compareItems.map(item => (
                <td key={item._id} className="p-4 border-b">
                  {item.stock > 0 
                    ? <span className="text-green-600 flex items-center"><Check size={16} className="mr-1"/> In Stock</span> 
                    : <span className="text-red-600">Out of Stock</span>}
                </td>
              ))}
              {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                <td key={i} className="p-4 border-b"></td>
              ))}
            </tr>
            
            {/* Dynamic Specifications */}
            {allSpecs.map(specName => (
              <tr key={specName}>
                <td className="p-4 border-b font-medium text-gray-700 bg-gray-50 capitalize">{specName}</td>
                {compareItems.map(item => {
                  const spec = item.specifications?.find(s => s.name.toLowerCase() === specName.toLowerCase());
                  return (
                    <td key={item._id} className="p-4 border-b text-sm text-gray-800">
                      {spec ? spec.value : '-'}
                    </td>
                  );
                })}
                {Array.from({ length: 3 - compareItems.length }).map((_, i) => (
                  <td key={i} className="p-4 border-b"></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compare;
