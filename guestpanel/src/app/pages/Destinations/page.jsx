"use client"
import { useState } from 'react';
import { MapPin, Star, Users, Calendar, ArrowRight } from 'lucide-react';

export default function DestinationsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleExploreDestination = (destination) => {
    // Show destination details or redirect to booking
    alert(`Exploring ${destination.name}! This would typically show more details or redirect to booking page.`);
  };

  const destinations = [
    {
      id: 1,
      name: "Maldives",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      category: "beach",
      description: "Crystal clear waters and overwater bungalows create the perfect romantic escape.",
      rating: 4.9,
      hotels: 12,
      avgPrice: 450,
      bestTime: "November to April"
    },
    {
      id: 2,
      name: "Swiss Alps",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      category: "mountain",
      description: "Majestic peaks and pristine landscapes for adventure seekers and nature lovers.",
      rating: 4.7,
      hotels: 8,
      avgPrice: 380,
      bestTime: "December to March"
    },
    {
      id: 3,
      name: "Bali",
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      category: "tropical",
      description: "Tropical paradise with rich culture, beautiful beaches, and spiritual temples.",
      rating: 4.8,
      hotels: 15,
      avgPrice: 320,
      bestTime: "April to October"
    },
    {
      id: 4,
      name: "New York",
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      category: "city",
      description: "The city that never sleeps offers world-class dining, shopping, and entertainment.",
      rating: 4.6,
      hotels: 25,
      avgPrice: 520,
      bestTime: "September to November"
    },
    {
      id: 5,
      name: "Dubai",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      category: "desert",
      description: "Luxury meets innovation in this futuristic desert metropolis.",
      rating: 4.9,
      hotels: 18,
      avgPrice: 680,
      bestTime: "November to March"
    },
    {
      id: 6,
      name: "Fiji",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      category: "island",
      description: "Remote island paradise with pristine beaches and vibrant coral reefs.",
      rating: 4.7,
      hotels: 6,
      avgPrice: 420,
      bestTime: "May to October"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Destinations', count: destinations.length },
    { id: 'beach', name: 'Beach Getaways', count: destinations.filter(d => d.category === 'beach').length },
    { id: 'mountain', name: 'Mountain Retreats', count: destinations.filter(d => d.category === 'mountain').length },
    { id: 'tropical', name: 'Tropical Paradise', count: destinations.filter(d => d.category === 'tropical').length },
    { id: 'city', name: 'Urban Luxury', count: destinations.filter(d => d.category === 'city').length },
    { id: 'desert', name: 'Desert Adventures', count: destinations.filter(d => d.category === 'desert').length },
    { id: 'island', name: 'Island Escapes', count: destinations.filter(d => d.category === 'island').length }
  ];

  const filteredDestinations = selectedCategory === 'all' 
    ? destinations 
    : destinations.filter(d => d.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore LuxuryStay Destinations
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover the world's most stunning locations with our curated collection of luxury destinations
            </p>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map(destination => (
            <div key={destination.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="relative">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {destination.category.charAt(0).toUpperCase() + destination.category.slice(1)}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-2xl font-bold text-gray-900">{destination.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star size={20} className="text-yellow-400" fill="currentColor" />
                    <span className="text-lg font-semibold text-gray-700">{destination.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {destination.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users size={16} />
                    <span className="text-sm">{destination.hotels} Hotels</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar size={16} />
                    <span className="text-sm">{destination.bestTime}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">${destination.avgPrice}</span>
                    <span className="text-sm text-gray-500"> / night avg</span>
                  </div>
                  <button 
                    onClick={() => handleExploreDestination(destination)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span>Explore</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredDestinations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MapPin size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No destinations found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
}
