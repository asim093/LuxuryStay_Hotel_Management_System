"use client"
import { Star } from 'lucide-react';

const TestimonialCard = ({ 
  image, 
  name, 
  rating, 
  testimonial 
}) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center mb-4">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <div className="flex text-yellow-400 text-sm">
            {Array.from({ length: 5 }, (_, i) => (
              <Star 
                key={i} 
                size={14} 
                fill={i < rating ? "currentColor" : "none"}
                className={i < rating ? "text-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-600 italic">
        "{testimonial}"
      </p>
    </div>
  );
};

export default TestimonialCard;
