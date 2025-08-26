"use client"
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Search } from 'lucide-react';

export default function HomePage() {
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel data with different destinations
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      title: "Discover Your Perfect",
      subtitle: "Getaway Destination",
      description: "Unparalleled luxury and comfort await at the world's most exclusive resorts and destinations.",
      location: "Luxury Hotels & Resorts"
    },
    {
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      title: "Experience Paradise",
      subtitle: "In The Maldives",
      description: "Crystal clear waters and overwater bungalows create the perfect romantic escape.",
      location: "Maldives Overwater Villas"
    },
    {
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      title: "Escape To Tropical",
      subtitle: "Beach Paradise",
      description: "White sand beaches and azure waters provide the ultimate relaxation experience.",
      location: "Tropical Beach Resorts"
    },
    {
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
      title: "Urban Luxury",
      subtitle: "City Experiences",
      description: "Sophisticated accommodations in the heart of the world's most vibrant cities.",
      location: "Premium City Hotels"
    }
  ];

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    console.log('Search data:', searchData);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []); // Empty dependency array

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`
              }}
            />
          </div>
        ))}

        {/* Animated overlay elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-8 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-110'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Hero Content */}
        <div className="flex items-center min-h-screen px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Content */}
              <div className="space-y-8">
                {/* Badge */}
                <div className="animate-fade-in">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/20 text-blue-100 border border-blue-300/30 backdrop-blur-sm">
                    {slides[currentSlide].location}
                  </span>
                </div>

                {/* Animated Heading */}
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight animate-slide-in-left">
                    <span className="block transition-all duration-700 ease-in-out">
                      {slides[currentSlide].title}
                    </span>
                    <span className="block transition-all duration-700 ease-in-out delay-200 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {slides[currentSlide].subtitle}
                    </span>
                  </h1>

                  <p className="text-xl text-blue-100 leading-relaxed animate-slide-in-left delay-300 max-w-lg">
                    {slides[currentSlide].description}
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-left delay-500">
                  <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    Explore Destinations
                  </button>
                  <button className="px-8 py-4 border-2 border-white/30 hover:border-white/50 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 backdrop-blur-sm">
                    Watch Video
                  </button>
                </div>
              </div>

              {/* Right Side - Search Card */}
              <div className="lg:justify-self-end w-full max-w-sm animate-slide-in-right">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-5 transform hover:scale-105 transition-all duration-300">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
                    Find Your Perfect Stay
                  </h3>

                  <div className="space-y-3">
                    {/* Destination */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 flex items-center">
                        <MapPin size={14} className="mr-1 text-blue-600" />
                        Destination
                      </label>
                      <select
                        value={searchData.destination}
                        onChange={(e) => handleInputChange('destination', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 text-sm"
                      >
                        <option value="">Select destination</option>
                        <option value="dubai">Dubai</option>
                        <option value="maldives">Maldives</option>
                        <option value="bali">Bali</option>
                        <option value="santorini">Santorini</option>
                        <option value="miami">Miami</option>
                      </select>
                    </div>

                    {/* Check In & Check Out in same row */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 flex items-center">
                          <Calendar size={14} className="mr-1 text-blue-600" />
                          Check in
                        </label>
                        <input
                          type="date"
                          value={searchData.checkIn}
                          onChange={(e) => handleInputChange('checkIn', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-700 flex items-center">
                          <Calendar size={14} className="mr-1 text-blue-600" />
                          Check out
                        </label>
                        <input
                          type="date"
                          value={searchData.checkOut}
                          onChange={(e) => handleInputChange('checkOut', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm"
                        />
                      </div>
                    </div>

                    {/* Guests */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-700 flex items-center">
                        <Users size={14} className="mr-1 text-blue-600" />
                        Guests
                      </label>
                      <select
                        value={searchData.guests}
                        onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-sm"
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>

                    {/* Search Button */}
                    <button
                      onClick={handleSearch}
                      className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 mt-4 text-sm"
                    >
                      <Search size={18} />
                      <span>Search Hotels</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Hotels Section */}
      <section className="relative z-10 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Featured Hotels
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover our handpicked selection of exceptional properties around the world, offering
              unparalleled luxury and unforgettable experiences
            </p>
          </div>

          {/* Hotels Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Hotel 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="The Grand Resort"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Best Seller
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">The Grand Resort</h3>
                  <div className="flex items-center space-x-1">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(5)}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">5.0</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3">5 Nights</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">$450</span>
                    <span className="text-sm text-gray-500"> / night</span>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Hotel 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="The Grand Resort"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">The Grand Resort</h3>
                  <div className="flex items-center space-x-1">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(4)}★
                    </div>
                    <span className="text-sm font-semibold text-gray-700">4.8</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3">3 Nights</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">$450</span>
                    <span className="text-sm text-gray-500"> / night</span>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Hotel 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="The Grand Resort"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Best Seller
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">The Grand Resort</h3>
                  <div className="flex items-center space-x-1">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(4)}★
                    </div>
                    <span className="text-sm font-semibold text-gray-700">4.5</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3">4 Nights</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">$450</span>
                    <span className="text-sm text-gray-500"> / night</span>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Hotel 4 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="The Grand Resort"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900">The Grand Resort</h3>
                  <div className="flex items-center space-x-1">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(4)}★
                    </div>
                    <span className="text-sm font-semibold text-gray-700">4.5</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-3">2 Nights</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">$450</span>
                    <span className="text-sm text-gray-500"> / night</span>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* View All Hotels Button */}
          <div className="text-center">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 border border-gray-300">
              View All Hotels
            </button>
          </div>
        </div>
      </section>

      {/* Stay Inspired Newsletter Section */}
      

      {/* Exclusive Offers Section */}
      <section className="relative z-10 bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Exclusive Offers
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Take advantage of our limited-time offers and special packages to enhance your
                stay and create unforgettable memories.
              </p>
            </div>
            <button className="hidden md:flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200">
              <span>View All Offers</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Offer 1 */}
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="relative h-64">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Romance Escape Package"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  25% OFF
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-2">Romance Escape Package</h3>
                  <p className="text-sm opacity-90 mb-3">
                    Indulge in a romantic night stay with complimentary champagne and special amenities.
                  </p>
                  <button className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-200">
                    <span className="font-semibold">View Offers</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Offer 2 */}
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="relative h-64">
                <img
                  src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Sustainable Getaway"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ECO SAVE
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-2">Sustainable Getaway</h3>
                  <p className="text-sm opacity-90 mb-3">
                    Enjoy an environmentally conscious stay with our eco-friendly accommodations and practices.
                  </p>
                  <button className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-200">
                    <span className="font-semibold">View Offers</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Offer 3 */}
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="relative h-64">
                <img
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Family Wild Specials"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  KID STAY
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-2">Family Wild Specials</h3>
                  <p className="text-sm opacity-90 mb-3">
                    Book for the family getaway and give out best experience with wild nature and adventure.
                  </p>
                  <button className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors duration-200">
                    <span className="font-semibold">View Offers</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Our Guests Say Section */}
      <section className="relative z-10 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Guests Say
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover why discerning travelers choose QuickStay for their luxury accommodations
              around the world
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
                  alt="Yanira Rodriguez"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Yanira Rodriguez</h4>
                  <div className="flex text-yellow-400 text-sm">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I've used many booking platforms before, but none compare to the phenomenal experience I had with QuickStay. The booking process was so smooth and hassle-free."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
                  alt="Devara Rodriguez"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Devara Rodriguez</h4>
                  <div className="flex text-yellow-400 text-sm">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The experience booking platform behind our success, we've been accommodations worldwide and can confidently stand out from everyone."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
                  alt="Emma Rodriguez"
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">Emma Rodriguez</h4>
                  <div className="flex text-yellow-400 text-sm">
                    {'★'.repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I've been overwhelm looking platforms before, but none compare to the phenomenal experience I had with QuickStay. The booking process."
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Stay Inspired
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our newsletter and be the first to discover new destinations, exclusive offers, and travel
            inspirations.
          </p>

          {/* Newsletter Form */}
          <div className="max-w-md mx-auto mb-6">
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg font-semibold transition-colors duration-200 flex items-center space-x-2">
                <span>Subscribe</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Privacy Notice */}
          <p className="text-sm text-gray-400">
            By subscribing, you agree to our{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 underline">
              Privacy Policy
            </a>
            {' '}and consent to receive updates.
          </p>
        </div>
      </section>

      {/* CSS Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
}