"use client"
import { ArrowRight } from 'lucide-react';

const OfferCard = ({ 
  image, 
  title, 
  description, 
  badge, 
  badgeColor = "bg-blue-600" 
}) => {
  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
      <div className="relative h-64">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className={`absolute top-4 left-4 ${badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
          {badge}
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm opacity-90 mb-3">
            {description}
          </p>
          <button className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-200">
            <span className="font-semibold">View Offers</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
