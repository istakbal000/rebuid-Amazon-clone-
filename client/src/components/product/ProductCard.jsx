import { useContext } from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { CompareContext } from '../../context/CompareContext';
import { ToastContext } from '../../context/ToastContext';

const ProductCard = ({ product }) => {
  const { compareItems, addToCompare, removeFromCompare } = useContext(CompareContext);
  const { toast } = useContext(ToastContext);
  
  const isCompared = compareItems.some(item => item._id === product._id);
  
  const handleCompareChange = (e) => {
    if (e.target.checked) {
      const res = addToCompare(product);
      if (!res.success) {
        toast.error(res.message);
        e.target.checked = false; // revert visually
      } else {
        toast.success('Added to compare');
      }
    } else {
      removeFromCompare(product._id);
    }
  };

  const discountPercent = product.originalPrice ? Math.round((1 - product.price/product.originalPrice)*100) : 0;
  let dealBadge = null;
  if (discountPercent >= 10) {
    dealBadge = <span className="text-[10px] text-green-700 font-bold bg-green-100 px-1 py-0.5 rounded ml-2 whitespace-nowrap">🟢 Good Deal</span>;
  } else if (discountPercent > 0) {
    dealBadge = <span className="text-[10px] text-yellow-700 font-bold bg-yellow-100 px-1 py-0.5 rounded ml-2 whitespace-nowrap">🟡 Average Price</span>;
  }

  return (
    <div className="bg-white p-4 z-20 flex flex-col hover:shadow-lg transition-shadow rounded-sm relative group">
      <div className="absolute top-2 right-2 z-30 flex items-center bg-white/80 rounded p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
        <input 
          type="checkbox" 
          id={`compare-${product._id}`} 
          className="mr-1 cursor-pointer w-3.5 h-3.5"
          checked={isCompared}
          onChange={handleCompareChange}
        />
        <label htmlFor={`compare-${product._id}`} className="text-[10px] cursor-pointer font-medium text-gray-700">Compare</label>
      </div>
      <Link to={`/product/${product._id}`} className="flex flex-col flex-1">
        <div className="w-full h-48 object-contain mb-4 flex justify-center items-center overflow-hidden">
          <img src={product.images[0]} alt={product.title} className="max-h-full object-contain" />
        </div>
        <h4 className="text-sm line-clamp-2 mb-1 hover:text-amazon-orange text-blue-900">{product.title}</h4>
        
        <div className="flex items-center text-xs mb-2">
          <Rating value={product.rating} text={product.reviewCount} />
        </div>
        
        <div className="mt-auto">
          <div className="flex items-baseline mb-1 flex-wrap">
            <span className="text-xs absolute top-0 left-0 bg-red-600 text-white px-2 py-1 rounded-br-md z-10 font-bold">
              {discountPercent > 0 ? `${discountPercent}% off` : ''}
            </span>
            <span className="text-xl font-bold">${Math.floor(product.price)}</span>
            <span className="text-sm font-bold align-top">{(product.price % 1).toFixed(2).substring(1)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through ml-2">List: ${product.originalPrice.toFixed(2)}</span>
            )}
            {dealBadge}
          </div>
          <p className="text-xs text-gray-500 mb-2">Delivery <span className="font-bold">Tomorrow</span></p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
