'use client';

import React, { useState } from 'react';
import { ItemData, ItemVariant, ItemOption } from '@/services/itemsService';

interface PizzaCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItemData | null;
  onOrder: (customization: any) => void;
}

const PizzaCustomizationModal: React.FC<PizzaCustomizationModalProps> = ({
  isOpen,
  onClose,
  item,
  onOrder,
}) => {
  // Initialize selectedBase with first available base
  const baseOptions = item?.options?.find(opt => opt.optionType === 'BASE');
  const bases = baseOptions?.optionValue ? 
    (() => {
      try {
        const parsedBases = JSON.parse(baseOptions.optionValue);
        return Array.isArray(parsedBases) ? parsedBases : ['Tomate', 'Crème'];
      } catch {
        return ['Tomate', 'Crème'];
      }
    })() : ['Tomate', 'Crème'];
  
  const [selectedBase, setSelectedBase] = useState<string>(bases[0] || 'Tomate');
  const [selectedSize, setSelectedSize] = useState<string>('33 cm');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);

  if (!isOpen || !item) return null;

  // Get size variants
  const sizeVariants = item.variants || [];
  const selectedVariant = sizeVariants.find(v => v.variantName.includes(selectedSize)) || sizeVariants[0];

  // Get ingredient options (excluding base, allergens, and vegetarian)
  const ingredientOptions = item.options?.filter(opt => 
    opt.optionType !== 'BASE' && 
    opt.optionType !== 'ALLERGENES' &&
    opt.optionType !== 'VEGETARIENNE'
  ) || [];

  const handleIngredientToggle = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const calculatePrice = () => {
    const basePrice = selectedVariant?.price || 0;
    // Add ingredient costs if any (simplified for now)
    return basePrice;
  };

  const handleOrder = () => {
    const customization = {
      item,
      variant: selectedVariant,
      base: selectedBase,
      size: selectedSize,
      ingredients: selectedIngredients,
      quantity,
      totalPrice: calculatePrice() * quantity,
    };
    onOrder(customization);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="bg-green-700 text-white p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">JE PERSONNALISE MA PIZZA</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          {/* Base Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 mb-3">Je choisis ma base</h3>
            <div className="flex gap-4">
              {Array.isArray(bases) ? bases.map((base) => (
                <button
                  key={base}
                  onClick={() => setSelectedBase(base)}
                  className={`
                    flex flex-col items-center p-3 rounded-lg border-2 transition-colors
                    ${selectedBase === base
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="w-12 h-12 mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                    {base.toLowerCase().includes('tomate') ? '🍅' : '🥛'}
                  </div>
                  <span className="text-sm font-medium">{base}</span>
                  {selectedBase === base && (
                    <div className="w-4 h-4 bg-green-600 rounded-full mt-1 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              )) : (
                <div className="text-gray-500">Aucune base disponible</div>
              )}
            </div>

            {/* Base removal option */}
            <div className="mt-3 flex items-center">
              <input
                type="checkbox"
                id="remove-base"
                className="mr-2"
              />
              <label htmlFor="remove-base" className="text-sm text-gray-600">
                Enlever de la base notre mélange de mozzarella et d'emmental type
              </label>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 mb-3">Je choisis la taille de ma pizza</h3>
            <div className="flex gap-4">
              {sizeVariants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedSize(variant.variantName)}
                  className={`
                    flex flex-col items-center p-3 rounded-lg border-2 transition-colors
                    ${selectedSize === variant.variantName
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="w-12 h-12 mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                    🍕
                  </div>
                  <span className="text-sm font-medium">{variant.variantName}</span>
                  {selectedSize === variant.variantName && (
                    <div className="w-4 h-4 bg-green-600 rounded-full mt-1 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-600 mb-3">Quantité :</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 bg-green-700 text-white rounded flex items-center justify-center hover:bg-green-800"
              >
                -
              </button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 bg-green-700 text-white rounded flex items-center justify-center hover:bg-green-800"
              >
                +
              </button>
            </div>
          </div>

          {/* Price and Order */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-green-700">
                  {(calculatePrice() * quantity).toFixed(2)} €
                </div>
                <div className="text-sm text-gray-500">
                  Prix de base : {calculatePrice().toFixed(2)} €
                </div>
              </div>
            </div>

            <button
              onClick={handleOrder}
              className="w-full bg-red-700 text-white py-3 rounded font-medium hover:bg-red-800 transition-colors"
            >
              AJOUTER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaCustomizationModal;
