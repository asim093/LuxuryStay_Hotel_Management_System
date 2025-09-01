"use client"
import { Star } from 'lucide-react';

const HotelCard = ({ 
  image, 
  title, 
  rating, 
  nights, 
  price, 
  badge, 
  badgeColor = "bg-blue-600" 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
          style={{ objectPosition: 'center' }}
        />
        {badge && (
          <div className={`absolute top-3 left-3 ${badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
            {badge}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <div className="flex items-center space-x-1">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }, (_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  fill={i < Math.floor(rating) ? "currentColor" : "none"}
                  className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">{rating}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-3">{nights} Nights</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">${price}</span>
            <span className="text-sm text-gray-500"> / night</span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
