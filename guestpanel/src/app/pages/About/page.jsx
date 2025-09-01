"use client"
import { Users, Award, Globe, Heart, Shield, Star } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { icon: Users, number: "50K+", label: "Happy Guests" },
    { icon: Globe, number: "150+", label: "Destinations" },
    { icon: Award, number: "25+", label: "Years Experience" },
    { icon: Star, number: "4.9", label: "Average Rating" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Guest-Centric Approach",
      description: "Every decision we make is centered around providing exceptional experiences for our guests."
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your safety and privacy are our top priorities with industry-leading security measures."
    },
    {
      icon: Award,
      title: "Excellence in Service",
      description: "We maintain the highest standards of luxury and service across all our properties."
    },
    {
      icon: Globe,
      title: "Global Presence",
      description: "From urban centers to remote paradises, we bring luxury to every corner of the world."
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      position: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b401?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      bio: "20+ years in luxury hospitality, former VP at Four Seasons"
    },
    {
      name: "Michael Chen",
      position: "Chief Operations Officer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      bio: "Expert in operational excellence and guest experience optimization"
    },
    {
      name: "Emma Rodriguez",
      position: "Head of Guest Relations",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80",
      bio: "Dedicated to ensuring every guest feels like royalty"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            About LuxuryStay
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            We're not just a hotel booking platform – we're your gateway to extraordinary experiences, 
            where luxury meets adventure and every journey becomes a story worth telling.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon size={32} className="text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  Founded in 1999, LuxuryStay began with a simple yet powerful vision: to make luxury travel 
                  accessible to discerning travelers who seek more than just accommodation – they seek experiences 
                  that transform their lives.
                </p>
                <p>
                  What started as a boutique collection of handpicked luxury hotels has grown into a global 
                  network of the world's most prestigious properties, each carefully selected for their unique 
                  character, exceptional service, and commitment to excellence.
                </p>
                <p>
                  Today, we continue to push the boundaries of what luxury travel means, constantly innovating 
                  to provide our guests with unforgettable experiences that go beyond their expectations.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="LuxuryStay Story"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6">
                <div className="text-3xl font-bold text-blue-600">25+</div>
                <div className="text-gray-600">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape the experiences we create for our guests
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <value.icon size={32} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals who drive our mission to deliver exceptional luxury experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <div className="text-blue-600 font-semibold mb-3">
                  {member.position}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            To curate and deliver the world's most extraordinary luxury travel experiences, 
            connecting discerning travelers with exceptional destinations and accommodations that 
            inspire, rejuvenate, and create memories that last a lifetime.
          </p>
          <div className="mt-8">
            <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200">
              Start Your Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
