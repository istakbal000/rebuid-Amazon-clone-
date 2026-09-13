import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CompareContext } from '../../context/CompareContext';
import { X } from 'lucide-react';

const CompareTray = () => {
  const { compareItems, removeFromCompare, clearCompare } = useContext(CompareContext);

  if (compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 p-4 transform transition-transform">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center flex-1 w-full overflow-x-auto gap-4 mb-4 md:mb-0 pb-2 md:pb-0">
          <div className="flex-shrink-0 text-sm font-semibold mr-4">
            Compare ({compareItems.length}/3)
          </div>
          
          <div className="flex gap-4">
            {compareItems.map((item) => (
              <div key={item._id} className="relative flex items-center border rounded p-2 bg-gray-50 min-w-[150px] max-w-[200px]">
                <img src={item.images[0]} alt={item.title} className="w-10 h-10 object-contain mr-2" />
                <div className="truncate text-xs flex-1">{item.title}</div>
                <button 
                  onClick={() => removeFromCompare(item._id)}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 border shadow hover:bg-gray-100"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            
            {Array.from({ length: Math.max(0, 3 - compareItems.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="flex items-center border border-dashed border-gray-300 rounded p-2 bg-gray-50 min-w-[150px] text-gray-400 text-xs justify-center">
                Add Product
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex gap-3 ml-4 flex-shrink-0">
          <button 
            onClick={clearCompare}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Clear all
          </button>
          <Link 
            to="/compare"
            className={`px-6 py-2 text-sm font-semibold rounded shadow-sm ${
              compareItems.length > 1 
                ? 'bg-yellow-400 hover:bg-yellow-500 text-black' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            onClick={(e) => {
              if (compareItems.length < 2) e.preventDefault();
            }}
          >
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompareTray;
