'use client';

import React, { useState } from 'react';
import { ItemData, ItemVariant } from '@/services/itemsService';

interface ItemCardProps {
  item: ItemData;
  onCustomize: () => void;
  onOrder: (variant?: ItemVariant) => void;
  selectedSize?: string;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onCustomize, onOrder, selectedSize }) => {
  const [showAllergens, setShowAllergens] = useState(false);
  // Get the default variant or first variant for pricing
  const defaultVariant = item.variants?.find(v => v.variantName.includes('33 cm')) || item.variants?.[0];
  
  // Check if item is available
  const isAvailable = item.status !== 'Unavailable' && item.status !== 'Discontinued';
  
  // Parse and get base options (like "Tomates, Crème Fraiche")
  const baseOptions = item.options?.find(opt => opt.optionType === 'BASE');
  const baseDescription = baseOptions?.optionValue ? 
    (() => {
      try {
        const parsedBase = JSON.parse(baseOptions.optionValue);
        return Array.isArray(parsedBase) ? parsedBase.join(', ') : parsedBase;
      } catch {
        return baseOptions.optionValue;
      }
    })() : '';

  // Check if item has allergens
  const allergenOptions = item.options?.find(opt => opt.optionType === 'ALLERGENES');
  const allergensList = allergenOptions?.optionValue ? 
    (() => {
      try {
        const parsedAllergens = JSON.parse(allergenOptions.optionValue);
        return Array.isArray(parsedAllergens) ? parsedAllergens : [];
      } catch {
        return [];
      }
    })() : [];
  const hasAllergens = allergensList.length > 0;

  // Check if item is vegetarian
  const vegetarianOptions = item.options?.find(opt => opt.optionType === 'VEGETARIENNE');
  const isVegetarian = vegetarianOptions?.optionValue ? 
    (() => {
      try {
        const parsedVeg = JSON.parse(vegetarianOptions.optionValue);
        return parsedVeg === 'Oui';
      } catch {
        return vegetarianOptions.optionValue === 'Oui';
      }
    })() : false;

  // Get default image
  const defaultImage = item.images?.find(img => img.isDefault)?.imageUrl || item.images?.[0]?.imageUrl;

  // Calculate price based on selected size or show range
  const getDisplayPrice = () => {
    if (!item.variants || item.variants.length === 0) {
      return 'Prix sur demande';
    }
    
    // If a size is selected, show price for that specific variant
    if (selectedSize) {
      const selectedVariant = item.variants.find(variant => variant.variantName === selectedSize);
      if (selectedVariant) {
        return `${selectedVariant.price.toFixed(2)} €`;
      }
    }
    
    // If no size selected or variant not found, show price range
    if (item.variants.length === 1) {
      return `${item.variants[0].price.toFixed(2)} €`;
    }
    
    const prices = item.variants.map(variant => variant.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) {
      return `${minPrice.toFixed(2)} €`;
    }
    
    return `${minPrice.toFixed(2)} € - ${maxPrice.toFixed(2)} €`;
  };

  return (
    <div className="group bg-white/95 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 relative">
      {/* Vegetarian badge - positioned absolutely */}
      {isVegetarian && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-lg border border-green-200">
            <img 
              src="/sans-viande.svg" 
              alt="Végétarien" 
              className="w-8 h-8"
            />
          </div>
        </div>
      )}

      {/* Item Image */}
      {defaultImage && (
        <div className="relative h-48 bg-gradient-to-br from-orange-100 to-red-100 overflow-hidden">
          <img 
            src={defaultImage} 
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}

      {/* Item Content */}
      <div className="p-6">
        {/* Item Name */}
        <div className="mb-3">
          <h3 className="text-lg md:text-xl font-bold leading-tight" style={{ color: 'var(--foreground)' }}>
            {item.name}
          </h3>
        </div>

        {/* Description */}
        <div className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
          {item.description && (
            <p className="mb-2 leading-relaxed">{item.description}</p>
          )}
          {baseDescription && (
            <p className="text-orange-600 font-medium">base : {baseDescription}</p>
          )}
        </div>

        {/* Allergens button */}
        {hasAllergens && (
          <button 
            onClick={() => setShowAllergens(true)}
            className="inline-flex items-center gap-2 text-red-700 text-sm font-semibold hover:text-red-800 transition-all duration-300 mb-3 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-xl border-2 border-red-200 hover:border-red-300 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <span className="text-base">⚠️</span>
            <span>Voir les allergènes</span>
          </button>
        )}

        {/* Customization button */}
        {item.variants && item.variants.length > 1 && (
          <div className="mb-4">
            <button
              onClick={onCustomize}
              className="inline-flex items-center gap-2 text-orange-700 text-sm font-semibold hover:text-orange-800 transition-all duration-300 bg-orange-100 hover:bg-orange-200 px-4 py-2 rounded-xl border-2 border-orange-200 hover:border-orange-300 shadow-sm hover:shadow-md transform hover:scale-105"
            >
              <span className="text-base">🎨</span>
              <span>Personnaliser ma pizza</span>
            </button>
          </div>
        )}

        {/* Price and Add button */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {getDisplayPrice()}
          </div>
        </div>
      </div>
      

      {/* Allergens Modal */}
      {showAllergens && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-3" style={{ color: 'var(--foreground)' }}>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-lg">⚠️</span>
                </div>
                Allergènes
              </h3>
              <button
                onClick={() => setShowAllergens(false)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                style={{ color: 'var(--muted-foreground)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3 mb-6">
              {allergensList.map((allergen, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-l-4 border-red-400 shadow-sm">
                  <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0 animate-pulse"></div>
                  <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{allergen}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-center leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                ⚠️ Veuillez informer notre équipe de toute allergie alimentaire avant de commander
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCard;
