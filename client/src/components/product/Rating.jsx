import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value, text }) => {
  return (
    <div className="flex items-center">
      <div className="flex text-amazon-orange">
        {[1, 2, 3, 4, 5].map((index) => (
          <span key={index}>
            {value >= index ? (
              <Star className="h-4 w-4 fill-current" />
            ) : value >= index - 0.5 ? (
              <StarHalf className="h-4 w-4 fill-current" />
            ) : (
              <Star className="h-4 w-4 text-gray-300" />
            )}
          </span>
        ))}
      </div>
      <span className="text-blue-600 ml-2 hover:underline cursor-pointer text-xs">{text && `${text}`}</span>
    </div>
  );
};

export default Rating;
