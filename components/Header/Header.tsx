"use client";

import { useState, useEffect, useRef } from 'react';
import { Phone, Bike, ChevronRight } from 'lucide-react';
import Annonce from './Annonce';
import Logo from './Logo';
import Navbar from './Navbar';
import MobileBottomNav from './MobileBottomNav';

interface HeaderProps {
  showAnnonce?: boolean;
}

const Header = ({ showAnnonce = true }: HeaderProps) => {
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
    e.stopPropagation();
    setIsUberEatsOpen(!isUberEatsOpen);
  }

  return (
    <header className="sticky top-0 z-40">
      {showAnnonce && <Annonce />}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* 
              --- DÉBUT DE LA MODIFICATION ---
              Cette ligne a été modifiée pour corriger l'affichage sur mobile.
              - "justify-between w-full" : Sépare le logo et le bouton sur mobile en utilisant toute la largeur.
              - "md:w-auto md:justify-start" : Restaure le comportement initial sur les écrans plus grands.
              - "md:space-x-8" : Rétablit l'espacement sur les écrans plus grands.
            */}
            <div className="flex items-center justify-between w-full md:w-auto md:justify-start md:space-x-8">
            {/* --- FIN DE LA MODIFICATION --- */}

              <Logo />
              
              {/* Mobile Order Button */}
              <div className="md:hidden relative" ref={menuRef}>
                <button
                  onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                  className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-2 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold uppercase shadow-lg hover:from-red-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 border-2 border-yellow-400"
                >
                  <span className="flex items-center space-x-1">
                    <span>🍕</span>
                    {/* Le texte peut être raccourci pour mieux s'adapter si besoin */}
                    <span>Commander une pizza</span>
                    <span>🍕</span>
                  </span>
                </button>
                {isSubMenuOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50 overflow-hidden ${
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
            </div>
            <Navbar />
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </header>
  );
};

export default Header;