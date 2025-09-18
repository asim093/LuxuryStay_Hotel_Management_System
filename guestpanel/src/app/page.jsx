"use client"
import { useState, useEffect } from 'react';
import { BedDouble, Calendar, MapPin, Search, Users2 } from 'lucide-react';
import HotelCard from './Components/Cards/HotelCard';
import OfferCard from './Components/Cards/OfferCard';
import TestimonialCard from './Components/Cards/TestimonialCard';
import { toast } from 'react-toastify';

export default function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [userid, setuserid] = useState("");
  const [token, settoken] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const [formData, setFormData] = useState({
    guest: "",
    room: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 1,
  });

  // Initialize auth state and fetch rooms
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const loginState = JSON.parse(localStorage.getItem("authState"));
        if (loginState && loginState.user && loginState.token) {
          setuserid(loginState.user.id);
          settoken(loginState.token);

          // Update formData with userid
          setFormData(prev => ({
            ...prev,
            guest: loginState.user.id
          }));

          console.log("Login state:", loginState);
        } else {
          console.warn("No valid auth state found");
          toast.error("Please log in to access this page");
        }
      } catch (error) {
        console.error("Error parsing auth state:", error);
        toast.error("Authentication error. Please log in again.");
      } finally {
        setAuthLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Fetch rooms when token is available
  useEffect(() => {
    if (!token) return;

    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3001/api/rooms", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.rooms && Array.isArray(data.rooms)) {
          setRooms(data.rooms);
        } else {
          throw new Error("Invalid rooms data received");
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
        toast.error(err.message || "Failed to fetch rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [token]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.room) {
      toast.error("Please select a room");
      return false;
    }
    if (!formData.checkInDate) {
      toast.error("Please select check-in date");
      return false;
    }
    if (!formData.checkOutDate) {
      toast.error("Please select check-out date");
      return false;
    }

    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      toast.error("Check-in date cannot be in the past");
      return false;
    }
    if (checkOut <= checkIn) {
      toast.error("Check-out date must be after check-in date");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!token) {
      toast.error("Please log in to make a booking");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Booking successful!");
        console.log("Booking:", data);
        // Reset form
        setFormData({
          guest: userid,
          room: "",
          checkInDate: "",
          checkOutDate: "",
          numberOfGuests: 1,
        });
      } else {
        throw new Error(data.message || "Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

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

  // Featured hotels data
  const featuredHotels = [
    {
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: "The Grand Resort",
      rating: 5.0,
      nights: 5,
      price: 450,
      badge: "Best Seller",
      badgeColor: "bg-blue-600"
    },
    {
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: "The Grand Resort",
      rating: 4.8,
      nights: 3,
      price: 450,
      badge: null
    },
    {
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: "The Grand Resort",
      rating: 4.5,
      nights: 4,
      price: 450,
      badge: "Best Seller",
      badgeColor: "bg-orange-500"
    },
    {
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: "The Grand Resort",
      rating: 4.5,
      nights: 2,
      price: 450,
      badge: null
    }
  ];

  // Exclusive offers data
  const exclusiveOffers = [
    {
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: "Romance Escape Package",
      description: "Indulge in a romantic night stay with complimentary champagne and special amenities.",
      badge: "25% OFF",
      badgeColor: "bg-blue-600"
    },
    {
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: "Sustainable Getaway",
      description: "Enjoy an environmentally conscious stay with our eco-friendly accommodations and practices.",
      badge: "ECO SAVE",
      badgeColor: "bg-green-600"
    },
    {
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: "Family Wild Specials",
      description: "Book for the family getaway and give out best experience with wild nature and adventure.",
      badge: "KID STAY",
      badgeColor: "bg-orange-600"
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      name: "Yanira Rodriguez",
      rating: 5,
      testimonial: "I've used many booking platforms before, but none compare to the phenomenal experience I had with QuickStay. The booking process was so smooth and hassle-free."
    },
    {
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      name: "Devara Rodriguez",
      rating: 5,
      testimonial: "The experience booking platform behind our success, we've been accommodations worldwide and can confidently stand out from everyone."
    },
    {
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      name: "Emma Rodriguez",
      rating: 5,
      testimonial: "I've been overwhelm looking platforms before, but none compare to the phenomenal experience I had with QuickStay. The booking process."
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleWatchVideo = () => {
    setShowVideoModal(true);
  };

  const closeVideoModal = () => {
    setShowVideoModal(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              style={{
                objectPosition: 'center',
                maxWidth: '100vw',
                maxHeight: '100vh'
              }}
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40" />
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
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
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
                  <button 
                    onClick={() => window.location.href = '/pages/Destinations'}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Explore Destinations
                  </button>
                  <button 
                    onClick={handleWatchVideo}
                    className="px-8 py-4 border-2 border-white/30 hover:border-white/50 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 backdrop-blur-sm"
                  >
                    Watch Video
                  </button>
                </div>
              </div>


              <div className="w-full max-w-lg mx-auto mt-10">
                <form
                  onSubmit={handleSubmit}
                  className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-6 space-y-5 transform hover:scale-[1.01] transition-all duration-300"
                >
                  <h2 className="text-xl font-bold text-center text-blue-700">
                    Book Your Stay
                  </h2>

                  {/* Room Select */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 flex items-center mb-1">
                      <BedDouble size={16} className="mr-1 text-blue-600" />
                      Select Room
                    </label>
                    <select
                      value={formData.room}
                      onChange={(e) => handleChange("room", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Choose a room</option>
                      {rooms.map((room) => (
                        <option key={room._id} value={room._id}>
                          {room.roomNumber} - {room.roomType}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Check-in and Check-out */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 flex items-center mb-1">
                        <Calendar size={16} className="mr-1 text-blue-600" />
                        Check-in
                      </label>
                      <input
                        type="date"
                        value={formData.checkInDate}
                        onChange={(e) => handleChange("checkInDate", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 flex items-center mb-1">
                        <Calendar size={16} className="mr-1 text-blue-600" />
                        Check-out
                      </label>
                      <input
                        type="date"
                        value={formData.checkOutDate}
                        onChange={(e) => handleChange("checkOutDate", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 flex items-center mb-1">
                      <Users2 size={16} className="mr-1 text-blue-600" />
                      Guests
                    </label>
                    <select
                      value={formData.numberOfGuests}
                      onChange={(e) =>
                        handleChange("numberOfGuests", parseInt(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <option key={num} value={num}>
                          {num} Guest{num > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-[1.02]"
                  >
                    Confirm Booking
                  </button>
                </form>
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
            {featuredHotels.map((hotel, index) => (
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
            {exclusiveOffers.map((offer, index) => (
              <OfferCard
                key={index}
                image={offer.image}
                title={offer.title}
                description={offer.description}
                badge={offer.badge}
                badgeColor={offer.badgeColor}
              />
            ))}
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
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                image={testimonial.image}
                name={testimonial.name}
                rating={testimonial.rating}
                testimonial={testimonial.testimonial}
              />
            ))}
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

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-full max-w-4xl mx-4">
            {/* Close Button */}
            <button
              onClick={closeVideoModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Video Container */}
            <div className="relative bg-white rounded-lg overflow-hidden shadow-2xl">
              <div className="aspect-video">
                <iframe
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/qemqQHaeCYo?si=Blc8PEZrJJMMaJIA&autoplay=1&rel=0&modestbranding=1"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              
              {/* Video Info */}
              <div className="p-6 bg-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Experience Luxury at Its Finest
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover the world-class amenities, stunning locations, and exceptional service that make our hotels the perfect choice for your next getaway.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    2.5M views
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    HD Quality
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    3:32 duration
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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