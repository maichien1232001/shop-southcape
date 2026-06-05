import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  count?: number;
  size?: number;
}

export const Rating: React.FC<RatingProps> = ({ value, count, size = 16 }) => {
  const stars = [];
  const floorValue = Math.floor(value);

  for (let i = 1; i <= 5; i++) {
    if (i <= floorValue) {
      stars.push(
        <Star
          key={i}
          size={size}
          className="fill-brand-accent text-brand-accent"
        />
      );
    } else if (i - 0.5 <= value) {
      stars.push(
        <div key={i} className="relative inline-block">
          <Star size={size} className="text-gray-300" />
          <div className="absolute top-0 left-0 overflow-hidden w-1/2">
            <Star size={size} className="fill-brand-accent text-brand-accent" />
          </div>
        </div>
      );
    } else {
      stars.push(<Star key={i} size={size} className="text-gray-300" />);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      {count !== undefined && (
        <span className="text-xs text-brand-gray font-sans">({count})</span>
      )}
    </div>
  );
};
export default Rating;
