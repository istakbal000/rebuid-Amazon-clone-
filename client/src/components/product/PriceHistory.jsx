import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

const PriceHistory = ({ history }) => {
  if (!history || history.length < 2) {
    return (
      <div className="mt-4 border rounded-lg p-3 bg-gray-50 text-sm text-gray-500">
        Not enough price history
      </div>
    );
  }
  
  // Sort history by date ascending
  const sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return (
    <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50 max-w-sm">
      <h4 className="font-bold mb-4 text-sm text-gray-700 flex items-center">
        Price History
      </h4>
      <div className="relative pl-2">
        <div className="absolute top-2 bottom-2 left-[11px] w-0.5 bg-gray-300 z-0"></div>
        <div className="space-y-4">
          {sorted.map((point, index) => {
            const isLast = index === sorted.length - 1;
            const prevPoint = index > 0 ? sorted[index - 1] : null;
            let TrendIcon = Minus;
            let trendColor = "text-gray-400";
            
            if (prevPoint) {
              if (point.price < prevPoint.price) {
                TrendIcon = TrendingDown;
                trendColor = "text-green-500";
              } else if (point.price > prevPoint.price) {
                TrendIcon = TrendingUp;
                trendColor = "text-red-500";
              }
            }
            
            return (
              <div key={index} className="flex items-center text-sm relative z-10">
                <div className={`w-3 h-3 rounded-full bg-white border-2 flex items-center justify-center mr-3 ${isLast ? 'border-blue-500' : 'border-gray-400'}`}></div>
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-gray-900">${point.price.toFixed(2)}</span>
                    <span className="text-gray-500 ml-2 text-xs">
                      {new Date(point.date).toLocaleDateString()}
                    </span>
                  </div>
                  {index > 0 && (
                    <TrendIcon size={16} className={trendColor} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PriceHistory;
