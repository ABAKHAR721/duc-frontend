'use client';

import React, { useState } from 'react';
import { ItemData, ItemVariant } from '@/services/itemsService';

interface ItemCardProps {
  item: ItemData;
  onCustomize: () => void;
  onOrder: (variant?: ItemVariant) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onCustomize, onOrder }) => {
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

  // Calculate price range from variants
  const getPriceRange = () => {
    if (!item.variants || item.variants.length === 0) {
      return 'Prix sur demande';
    }
    
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
      {/* Vegetarian badge - positioned absolutely */}
      {isVegetarian && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
            <img 
              src="/sans-viande.svg" 
              alt="Végétarien" 
              className="w-12 h-12"
            />
          </div>
        </div>
      )}

      {/* Item Image */}
      {defaultImage && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img 
            src={defaultImage} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Item Content */}
      <div className="p-4">
        {/* Item Name */}
        <div className="mb-2">
          <h3 className="text-lg font-bold text-green-800">
            {item.name}
          </h3>
        </div>

        {/* Description */}
        <div className="text-sm text-gray-600 mb-3">
          {item.description && (
            <p className="mb-1">{item.description}</p>
          )}
          {baseDescription && (
            <p className="text-gray-700">{baseDescription}</p>
          )}
        </div>

        {/* Allergens link */}
        {hasAllergens && (
          <button 
            onClick={() => setShowAllergens(true)}
            className="text-blue-600 text-sm underline hover:text-blue-800 transition-colors mb-3"
          >
            Allergènes
          </button>
        )}

        {/* Customization option */}
        {item.variants && item.variants.length > 1 && (
          <div className="mb-3">
            <button
              onClick={onCustomize}
              className="text-orange-500 text-sm hover:text-orange-600 transition-colors"
            >
              Je modifie ma recette
            </button>
          </div>
        )}

        {/* Price and Add button */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-800">
            {getPriceRange()}
          </div>
          
          <button
            onClick={() => onOrder(defaultVariant)}
            disabled={!isAvailable}
            className={`
              px-6 py-2 rounded-full font-medium transition-colors
              ${isAvailable 
                ? 'bg-red-700 text-white hover:bg-red-800' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isAvailable ? 'AJOUTER' : 'AJOUTER'}
          </button>
        </div>

        {/* Size selection for items with variants */}
        {item.options?.find(opt => opt.optionType === 'BASE') && item.variants.length > 1 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Je choisis ma base</p>
            <div className="flex gap-2">
              {item.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => onOrder(variant)}
                  className={`
                    px-3 py-1 text-xs rounded-full border transition-colors
                    ${variant.variantName.includes('33 cm')
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }
                  `}
                >
                  {variant.variantName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Allergens Modal */}
      {showAllergens && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-white/20">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span className="text-red-500">⚠️</span>
                Allergènes
              </h3>
              <button
                onClick={() => setShowAllergens(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              {allergensList.map((allergen, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-red-50 rounded-lg border-l-4 border-red-400">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span className="text-sm text-gray-800 font-medium">{allergen}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Veuillez informer votre serveur de toute allergie alimentaire
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCard;
