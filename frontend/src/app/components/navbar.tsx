'use client'; // Add this directive at the top

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/90 backdrop-blur-lg border-b border-gray-200/80 shadow-sm" 
        : "bg-gradient-to-b from-gray-50/95 to-white/80 backdrop-blur-md"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link 
            href="/" 
            className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            MyWebsite
          </Link>
          
          {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <NavLink href="/login">Login</NavLink>
            
            <Link 
              href="/signup" 
              className="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-medium rounded-full group text-black"
            >
              <span className="absolute w-0 h-full transition-all duration-300 ease-out bg-gradient-to-r from-indigo-500 to-purple-600 group-hover:w-full rounded-full"></span>
              <span className="relative flex items-center text-sm font-medium text-black group-hover:text-white transition-colors duration-300">
                Sign Up
                <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-indigo-600 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? "max-h-96 py-4" : "max-h-0 py-0"
        }`}>
          <div className="flex flex-col space-y-4 px-2 pt-2 pb-3">
            <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setMobileMenuOpen(false)}>About</MobileNavLink>
            <MobileNavLink href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</MobileNavLink>
            <MobileNavLink href="/login" onClick={() => setMobileMenuOpen(false)}>Login</MobileNavLink>
            <Link 
              href="/signup" 
              className="block w-full text-center px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// Helper component for desktop nav links
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="relative text-gray-600 hover:text-indigo-600 transition-colors font-medium text-sm group"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}

// Helper component for mobile nav links
function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link 
      href={href} 
      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50/50 transition-colors"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}