'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Star, Clock, Users, ChefHat, Flame, Plus, Minus, Phone, Bike, ChevronRight } from 'lucide-react';
import { ItemData, ItemVariant, ItemOption } from '@/services/itemsService';

interface PizzaModalProps {
  pizza: ItemData;
  isOpen: boolean;
  onClose: () => void;
}

const PizzaModal: React.FC<PizzaModalProps> = ({ pizza, isOpen, onClose }) => {
  const [selectedVariant, setSelectedVariant] = useState<ItemVariant>(pizza?.variants?.[0] || {} as ItemVariant);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [isUberEatsOpen, setIsUberEatsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Early return if pizza is not available
  if (!pizza || !isOpen) {
    return null;
  }

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

  const getSelectedPrice = () => selectedVariant?.price || 0;
  const getTotalPrice = () => getSelectedPrice() * quantity;

  const isVegetarian = (pizza: ItemData) => {
    return pizza?.options?.some(option => 
      option.optionType === 'VEGETARIENNE' && 
      JSON.parse(option.optionValue) === 'Oui'
    ) || false;
  };

  const handleUberEatsClick = () => {
    setIsUberEatsOpen(true);
  };

  const parseOptions = (optionValue: string) => {
    try {
      return JSON.parse(optionValue);
    } catch {
      return optionValue;
    }
  };

  const groupOptionsByType = (options: ItemOption[]) => {
    return options.reduce((acc, option) => {
      if (!acc[option.optionType]) {
        acc[option.optionType] = [];
      }
      const parsedValue = parseOptions(option.optionValue);
      if (option.optionType === 'ALLERGENES' && Array.isArray(parsedValue)) {
        // For allergens, spread the array to show individual items
        acc[option.optionType].push(...parsedValue);
      } else {
        acc[option.optionType].push(parsedValue);
      }
      return acc;
    }, {} as Record<string, any[]>);
  };

  const groupedOptions = groupOptionsByType(pizza?.options || []);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>       
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{pizza?.name || 'Pizza'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-yellow-300" />
                  ))}
                </div>
                <span className="text-white/80 text-sm">(4.8/5 - 127 avis)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div
                key={selectedImageIndex}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-lg transition-all duration-300"
              >
                <img
                  src={pizza?.images?.[selectedImageIndex]?.imageUrl || '/placeholder-pizza.jpg'}
                  alt={pizza?.name || 'Pizza'}
                  className="w-full h-full object-cover"
                />
                
                {/* Vegetarian Icon */}
                {isVegetarian(pizza) && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <img 
                      src="/sans-viande.svg" 
                      alt="Végétarien" 
                      className="w-16 h-16"
                    />
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {pizza?.images && pizza.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {pizza.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-orange-500 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.imageUrl}
                        alt={`${pizza?.name || 'Pizza'} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {pizza?.description || "Une pizza artisanale préparée avec des ingrédients frais et de qualité premium. Chaque bouchée vous transportera dans un voyage culinaire inoubliable."}
                </p>
              </div>

              {/* Variants */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Tailles disponibles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pizza?.variants?.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-[1.02] active:scale-[0.98] ${
                        selectedVariant.id === variant.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-gray-800">
                            {variant.variantName}
                          </div>
                          {variant.sku && (
                            <div className="text-sm text-gray-500">
                              SKU: {variant.sku}
                            </div>
                          )}
                        </div>
                        <div className="text-lg font-bold text-orange-600">
                          {variant.price.toFixed(2)}€
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              {Object.keys(groupedOptions).length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Informations détaillées</h3>
                  <div className="space-y-4">
                    {Object.entries(groupedOptions).map(([type, values]) => (
                      <div key={type} className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-800 mb-2 capitalize flex items-center gap-2">
                          {type === 'ingredients' && <Flame className="w-4 h-4 text-orange-500" />}
                          {type === 'allergens' && <Users className="w-4 h-4 text-red-500" />}
                          {type === 'nutrition' && <Clock className="w-4 h-4 text-green-500" />}
                          {type}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {values.map((value, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border"
                            >
                              {typeof value === 'object' ? JSON.stringify(value) : value}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600">Prix unitaire</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {getSelectedPrice().toFixed(2)}€
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-white/50 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-800">Total</span>
                    <span className="text-3xl font-bold text-orange-600">
                      {getTotalPrice().toFixed(2)}€
                    </span>
                  </div>

                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                      className="w-full bg-gradient-to-r from-red-600 to-orange-500 text-white py-4 rounded-xl font-bold uppercase shadow-lg hover:from-red-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 border-2 border-yellow-400"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <span>🍕</span>
                        <span>Commander une pizza</span>
                        <span>🍕</span>
                      </span>
                    </button>
                    {isSubMenuOpen && (
                      <div
                        className={`absolute bottom-full mb-2 left-0 right-0 w-full bg-white rounded-md shadow-xl z-20 overflow-hidden ${
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaModal;
