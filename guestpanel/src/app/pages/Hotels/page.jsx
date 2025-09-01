"use client"
import { useState } from 'react';
import { Search, Filter, Star, MapPin, Users, Calendar, DollarSign } from 'lucide-react';
import HotelCard from '../../Components/Cards/HotelCard';

export default function HotelsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState('recommended');

  // Sample hotel data
  const allHotels = [
    {
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: "LuxuryStay Grand Resort",
      rating: 5.0,
      nights: 5,
      price: 450,
      badge: "Premium",
      badgeColor: "bg-purple-600",
      location: "Maldives"
    },
    {
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: "LuxuryStay Beach Villa",
      rating: 4.8,
      nights: 3,
      price: 380,
      badge: "Best Seller",
      badgeColor: "bg-blue-600",
      location: "Bali"
    },
    {
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: "LuxuryStay Mountain Lodge",
      rating: 4.5,
      nights: 4,
      price: 320,
      badge: "Adventure",
      badgeColor: "bg-green-600",
      location: "Swiss Alps"
    },
    {
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: "LuxuryStay Urban Palace",
      rating: 4.7,
      nights: 2,
      price: 520,
      badge: "City Center",
      badgeColor: "bg-orange-600",
      location: "New York"
    },
    {
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: "LuxuryStay Desert Oasis",
      rating: 4.9,
      nights: 6,
      price: 680,
      badge: "Exclusive",
      badgeColor: "bg-red-600",
      location: "Dubai"
    },
    {
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: "LuxuryStay Tropical Paradise",
      rating: 4.6,
      nights: 7,
      price: 420,
      badge: "All Inclusive",
      badgeColor: "bg-teal-600",
      location: "Fiji"
    }
  ];

  const locations = ["Maldives", "Bali", "Swiss Alps", "New York", "Dubai", "Fiji", "Paris", "Tokyo"];

  const filteredHotels = allHotels.filter(hotel => {
    const matchesSearch = hotel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hotel.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !selectedLocation || hotel.location === selectedLocation;
    const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
    const matchesRating = hotel.rating >= selectedRating;
    
    return matchesSearch && matchesLocation && matchesPrice && matchesRating;
  });

  const sortedHotels = [...filteredHotels].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover LuxuryStay Hotels
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Experience world-class luxury accommodations in the most breathtaking destinations
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search hotels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            {/* Price Range */}
            <div className="flex items-center space-x-2">
              <DollarSign className="text-gray-400" size={20} />
              <input
                type="number"
                placeholder="Min"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="w-20 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                className="w-20 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="mt-4 flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Minimum Rating:</span>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedRating === rating
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Star size={16} fill={selectedRating >= rating ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {sortedHotels.length} of {allHotels.length} hotels
          </p>
          <div className="flex items-center space-x-2 text-gray-600">
            <Filter size={20} />
            <span>Filters Applied</span>
          </div>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedHotels.map((hotel, index) => (
            <HotelCard
              key={index}
              image={hotel.image}
              title={hotel.title}
              rating={hotel.rating}
              nights={hotel.nights}
              price={hotel.price}
              badge={hotel.badge}
              badgeColor={hotel.badgeColor}
            />
          ))}
        </div>

        {/* No Results */}
        {sortedHotels.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No hotels found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
