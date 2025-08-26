"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-transparent mb-10"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className={`text-xl font-bold ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              LuxuryStay.com
            </Link>
          </div>

          {/* Center Navigation Links */}
          <div className={`hidden md:flex  items-center justify-center h-full w-[50%] space-x-8 ${isScrolled ? "bg-black" : "bg-white"}`}>
            <Link
              href="/list-property"
              className={`transition-colors duration-200 text-sm font-medium ${
                isScrolled ? "text-white hover:underline hover:decoration-amber-400 hover:decoration-2" : "text-black hover:underline hover:decoration-black-400 hover:decoration-2"
              }`}
            >
              List your property
            </Link>
            <Link
              href="/support"
              className={`transition-colors duration-200 text-sm font-medium ${
                isScrolled ? "text-white hover:underline hover:decoration-amber-400 hover:decoration-2" : "text-black hover:underline hover:decoration-black-400 hover:decoration-2"
              }`}
            >
              Support
            </Link>
            <Link
              href="/trips"
              className={`transition-colors duration-200 text-sm font-medium ${
                isScrolled ? "text-white hover:underline hover:decoration-amber-400 hover:decoration-2" : "text-black hover:underline hover:decoration-black-400 hover:decoration-2"
              }`}
            >
              Trips
            </Link>
            <Link
              href="/signin"
              className={`transition-colors duration-200 text-sm font-medium ${
                isScrolled ? "text-white hover:underline hover:decoration-amber-400 hover:decoration-2" : "text-black hover:underline hover:decoration-black-400 hover:decoration-2"
              }`}
            >
              Sign in
            </Link>
          </div>

          {/* Right Side - Get App Button */}
          <div className="hidden md:flex items-center">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                isScrolled
                  ? "bg-slate-800 text-white hover:bg-slate-700"
                  : "bg-slate-500 text-white hover:bg-slate-400"
              }`}
            >
              <span>Get the app</span>
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`p-2 ${
                isScrolled ? "text-black hover:text-blue-500" : "text-white hover:text-blue-200"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div
            className={`md:hidden rounded-b-lg ${
              isScrolled ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/list-property"
                className="block px-3 py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                List your property
              </Link>
              <Link
                href="/support"
                className="block px-3 py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Support
              </Link>
              <Link
                href="/trips"
                className="block px-3 py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Trips
              </Link>
              <Link
                href="/signin"
                className="block px-3 py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <button className="bg-slate-500 hover:bg-slate-400 text-white px-4 py-2 rounded-md text-sm font-medium mx-3 mt-2">
                Get the app
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
