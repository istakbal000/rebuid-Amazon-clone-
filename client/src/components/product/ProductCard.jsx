import { Link } from 'react-router-dom';
import Rating from './Rating';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white p-4 z-20 flex flex-col hover:shadow-lg transition-shadow rounded-sm relative">
      <Link to={`/product/${product._id}`} className="flex flex-col flex-1">
        <div className="w-full h-48 object-contain mb-4 flex justify-center items-center overflow-hidden">
          <img src={product.images[0]} alt={product.title} className="max-h-full object-contain" />
        </div>
        <h4 className="text-sm line-clamp-2 mb-1 hover:text-amazon-orange text-blue-900">{product.title}</h4>
        
        <div className="flex items-center text-xs mb-2">
          <Rating value={product.rating} text={product.reviewCount} />
        </div>
        
        <div className="mt-auto">
          <div className="flex items-baseline mb-1">
            <span className="text-xs absolute top-0 left-0 bg-red-600 text-white px-2 py-1 rounded-br-md z-10 font-bold">
              {product.originalPrice ? `${Math.round((1 - product.price/product.originalPrice)*100)}% off` : ''}
            </span>
            <span className="text-xl font-bold">${Math.floor(product.price)}</span>
            <span className="text-sm font-bold align-top">{(product.price % 1).toFixed(2).substring(1)}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through ml-2">List: ${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-2">Delivery <span className="font-bold">Tomorrow</span></p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
