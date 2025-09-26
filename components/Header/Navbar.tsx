"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronRight, Phone, Bike, Home, ShoppingCart, BookOpen, MapPin } from 'lucide-react';

const Navbar = () => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [isUberEatsOpen, setIsUberEatsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsSubMenuOpen(false);
        setIsUberEatsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUberEatsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the main menu from closing
    setIsUberEatsOpen(!isUberEatsOpen);
  }

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <div className="flex items-center space-x-8">
        <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition duration-300 font-medium">
          <Home className="w-4 h-4" />
          <span>Accueil</span>
        </Link>
        <Link href="/notre-carte" className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition duration-300 font-medium">
          <ShoppingCart className="w-4 h-4" />
          <span>Notre Carte</span>
        </Link>
        <Link href="/notre-histoire" className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition duration-300 font-medium">
          <BookOpen className="w-4 h-4" />
          <span>Notre Histoire</span>
        </Link>
        <Link href="/nous-trouver" className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition duration-300 font-medium">
          <MapPin className="w-4 h-4" />
          <span>Nous Trouver</span>
        </Link>
      </div>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
          className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-3 py-1.5 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-bold uppercase shadow-lg hover:from-red-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 border-2 border-yellow-400"
        >
          <span className="flex items-center space-x-1">
            <span>🍕</span>
            <span>Commander une pizza</span>
            <span>🍕</span>
          </span>
        </button>
        {isSubMenuOpen && (
          <div
            className={`absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl z-20 overflow-hidden ${
              isUberEatsOpen ? 'min-h-[110px]' : 'min-h-[77px]'
            }`}
          >
            <div className={`transition-transform duration-300 ease-in-out ${isUberEatsOpen ? '-translate-x-full' : 'translate-x-0'}`}>
              <div className="w-full flex-shrink-0" style={{ width: '100%' }}>
                <a href="tel:+33XXXXXXXXX" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-yellow-400">
                  <Phone className="w-4 h-4 mr-2" />
                  Commander par Téléphone
                </a>
                <button 
                  onClick={handleUberEatsClick}
                  className="w-full text-left flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-yellow-400"
                >
                  <div className="flex items-center">
                    <Bike className="w-4 h-4 mr-2" />
                    <span>Livraison avec Uber Eats</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-0 left-full w-full bg-white">
                <button 
                  onClick={() => setIsUberEatsOpen(false)}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-yellow-400 font-bold"
                >
                  <ChevronRight className="w-4 h-4 mr-2 transform rotate-180" />
                  Retour
                </button>
                <a href="https://www.ubereats.com/fr/store/pizza-le-duc/ShfPBgd5WYG-0lAKLxIazQ" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-400">UBER EAT PODENSAC</a>
                <a href="https://www.ubereats.com/fr/store/pizza-le-duc-langon/knYx33kaXLSOSaJVs7XyRg" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-400">UBER EAT LANGON</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;