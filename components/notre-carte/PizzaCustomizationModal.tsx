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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🍕</span>
              </div>
              <div>
                <h2 className="text-xl font-light">Personnalisez votre pizza</h2>
                <p className="text-sm text-white/80">{item?.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {/* Base Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <span className="text-orange-500">🍅</span>
                Choisissez votre base
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Array.isArray(bases) ? bases.map((base) => (
                  <button
                    key={base}
                    onClick={() => setSelectedBase(base)}
                    className={`
                      flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105
                      ${selectedBase === base
                        ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg'
                        : 'border-gray-200 hover:border-orange-300 bg-white'
                      }
                    `}
                  >
                    <div className="w-16 h-16 mb-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center text-2xl">
                      {base.toLowerCase().includes('tomate') ? '🍅' : '🥛'}
                    </div>
                    <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{base}</span>
                    {selectedBase === base && (
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-2 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                )) : (
                  <div className="col-span-2 text-center py-8" style={{ color: 'var(--muted-foreground)' }}>
                    Aucune base disponible
                  </div>
                )}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <span className="text-orange-500">📏</span>
                Choisissez la taille
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {sizeVariants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedSize(variant.variantName)}
                    className={`
                      flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105
                      ${selectedSize === variant.variantName
                        ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-lg'
                        : 'border-gray-200 hover:border-orange-300 bg-white'
                      }
                    `}
                  >
                    <div className="w-16 h-16 mb-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center text-2xl">
                      🍕
                    </div>
                    <span className="text-sm font-semibold mb-1" style={{ color: 'var(--foreground)' }}>{variant.variantName}</span>
                    <span className="text-xs font-bold text-orange-600">{variant.price.toFixed(2)}€</span>
                    {selectedSize === variant.variantName && (
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mt-2 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <span className="text-orange-500">🔢</span>
                Quantité
              </h3>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                >
                  <span className="text-xl font-bold">-</span>
                </button>
                <span className="text-2xl font-bold w-16 text-center bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                >
                  <span className="text-xl font-bold">+</span>
                </button>
              </div>
            </div>

            {/* Price and Order */}
            <div className="border-t pt-6" style={{ borderColor: 'var(--border)' }}>
              <div className="rounded-2xl p-6 mb-6" style={{ backgroundColor: 'var(--muted)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
                      Total de votre commande
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {(calculatePrice() * quantity).toFixed(2)} €
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Prix unitaire: {calculatePrice().toFixed(2)} €
                    </div>
                    <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Quantité: {quantity}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleOrder}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <span className="text-lg">🛒</span>
                COMMANDER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaCustomizationModal;
