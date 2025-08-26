"use client"
import React, { useState, useEffect } from 'react';
import { Search, Calendar, Users, ChevronDown } from 'lucide-react';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [guestsDropdown, setGuestsDropdown] = useState(false);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2070&q=80",
      title: "Explore Your Perfect",
      subtitle: "Stay",
      description: "Find luxury hotels and resorts worldwide"
    },
    {
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2070&q=80",
      title: "Discover Luxury",
      subtitle: "Hotels",
      description: "Premium comfort with world-class amenities"
    },
    {
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=2070&q=80",
      title: "Paradise Beach",
      subtitle: "Resorts",
      description: "Oceanfront escapes with stunning views"
    },
    {
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2070&q=80",
      title: "Private Villa",
      subtitle: "Experience",
      description: "Exclusive retreats for unforgettable moments"
    }
  ];

  const [searchData, setSearchData] = useState({
    destination: '',
    checkin: '',
    checkout: '',
    guests: '2 guests'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div
        className="relative h-[650px] md:h-screen bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url("${slides[currentSlide].image}")`
        }}
      >
        {/* Hero Content */}
        <div className="absolute top-0 pt-26 md:pt-0  left-0 w-full h-full flex flex-col justify-center items-center md:items-start px-6 md:px-16">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-7xl font-bold text-white text-center md:text-left">
              {slides[currentSlide].title}<br />
              <span className="text-orange-400">{slides[currentSlide].subtitle}</span>
            </h1>
            <p className="text-base md:text-xl text-gray-200 mt-4 text-center md:text-left">
              {slides[currentSlide].description}
            </p>

            {/* Search Bar */}
            <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl mt-8 md:mt-10 p-4 md:p-6 shadow-2xl w-full">
              <div className="flex flex-col lg:flex-row gap-3">
                {/* Destination */}
                <div className="flex-1">
                  <div className="flex items-center bg-gray-700 p-3 rounded-xl">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                      type="text"
                      placeholder="Where to?"
                      value={searchData.destination}
                      onChange={(e) => handleInputChange('destination', e.target.value)}
                      className="w-full text-sm text-white placeholder-gray-400 bg-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Check-in */}
                <div className="flex-1">
                  <div className="flex items-center bg-gray-700 p-3 rounded-xl">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                      type="date"
                      value={searchData.checkin}
                      onChange={(e) => handleInputChange('checkin', e.target.value)}
                      className="w-full text-sm text-white bg-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Check-out */}
                <div className="flex-1">
                  <div className="flex items-center bg-gray-700 p-3 rounded-xl">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                      type="date"
                      value={searchData.checkout}
                      onChange={(e) => handleInputChange('checkout', e.target.value)}
                      className="w-full text-sm text-white bg-transparent outline-none"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="flex-1 relative">
                  <div
                    className="flex items-center bg-gray-700 p-3 rounded-xl cursor-pointer"
                    onClick={() => setGuestsDropdown(!guestsDropdown)}
                  >
                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm text-white flex-1">{searchData.guests}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${guestsDropdown ? 'rotate-180' : ''}`} />
                  </div>

                  {guestsDropdown && (
                    <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg z-10">
                      {['1 guest', '2 guests', '3 guests', '4 guests', '5+ guests'].map((option) => (
                        <div
                          key={option}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => { handleInputChange('guests', option); setGuestsDropdown(false); }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center">
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 w-full hidden md:block flex flex-col md:flex-row items-center justify-between p-6 md:p-10">
          <div className="text-white text-center md:text-left max-w-md border-l-4 border-amber-400 pl-4">
            <h3 className="text-lg font-semibold mb-2">
              We provide the best lodging accommodations.
            </h3>
            <p className="text-sm text-gray-300">
              Find the best hotel, resort, or villa that fits your budget and preferences.
            </p>
          </div>

          {/* Dots */}
          <div className="flex space-x-2 mt-4 md:mt-0">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full cursor-pointer ${index === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
                onClick={() => setCurrentSlide(index)}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Places Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Discover Amazing Places
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Hotels', 'Resorts', 'Villas'].map((place, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl h-64">
                  <img
                    src={i === 0 ? slides[1].image : i === 1 ? slides[2].image : slides[3].image}
                    alt={place}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold">{place}</h3>
                    <p className="text-sm opacity-90">Exclusive retreats</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
