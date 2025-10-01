'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Clock, Users, Flame, Plus, Minus, Phone, Bike, ChevronRight } from 'lucide-react';
import { SiUbereats } from 'react-icons/si';
import { FiPhone } from 'react-icons/fi';
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
  const [showOrderOptions, setShowOrderOptions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOrderOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Early return if pizza is not available
  if (!pizza || !isOpen) {
    return null;
  }

  const getSelectedPrice = () => selectedVariant?.price || 0;
  const getTotalPrice = () => getSelectedPrice() * quantity;

  const isVegetarian = (pizza: ItemData) => {
    return pizza?.options?.some(option => {
      if (option.optionType === 'VEGETARIENNE') {
        try {
          return JSON.parse(option.optionValue) === 'Oui';
        } catch {
          // If it's not valid JSON, treat it as a string
          return option.optionValue === 'Oui';
        }
      }
      return false;
    }) || false;
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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        style={{ background: 'var(--background)' }}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" style={{ color: 'var(--foreground)' }} />
          </button>

          <div className="max-w-2xl">
            <h2 className="text-3xl font-light mb-2" style={{ color: 'var(--foreground)' }}>
              {pizza?.name || 'Pizza'}
            </h2>
            <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {isVegetarian(pizza) && (
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                  🌱 Végétarien
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden">
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
                  <div className="flex gap-2">
                    {pizza.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-1 aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index
                            ? 'border-primary'
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

              {/* Content Section */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                    Description
                  </h3>
                  <p className="leading-relaxed text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    {pizza?.description || "Une pizza artisanale préparée avec des ingrédients frais et de qualité premium. Chaque bouchée vous transportera dans un voyage culinaire inoubliable."}
                  </p>
                </div>

                {/* Variants Selection */}
                <div>
                  <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                    Tailles disponibles
                  </h3>
                  <div className="space-y-2">
                    {pizza?.variants?.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`w-full p-4 rounded-xl border transition-all text-left ${
                          selectedVariant.id === variant.id
                            ? 'border-primary bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium" style={{ color: 'var(--foreground)' }}>
                              {variant.variantName}
                            </div>
                            {variant.sku && (
                              <div className="text-sm text-gray-500">
                                SKU: {variant.sku}
                              </div>
                            )}
                          </div>
                          <div className="text-lg font-bold" style={{ color: 'var(--primary)' }}>
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
                    <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--foreground)' }}>Informations détaillées</h3>
                    <div className="space-y-4">
                      {Object.entries(groupedOptions).map(([type, values]) => (
                        <div key={type} className="rounded-xl p-4" style={{ backgroundColor: 'var(--muted)' }}>
                          <h4 className="font-medium mb-2 capitalize flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                            {type === 'ingredients' && <Flame className="w-4 h-4 text-orange-500" />}
                            {type === 'allergens' && <Users className="w-4 h-4 text-red-500" />}
                            {type === 'nutrition' && <Clock className="w-4 h-4 text-green-500" />}
                            {type}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {values.map((value, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 rounded-full text-xs border"
                                style={{
                                  backgroundColor: 'var(--background)',
                                  color: 'var(--muted-foreground)',
                                  borderColor: 'var(--border)'
                                }}
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

                {/* Quantity and Order */}
                <div className="border-t pt-6">
                  <div className="bg-gray-50 rounded-2xl p-6" style={{ backgroundColor: 'var(--muted)' }}>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          Prix unitaire
                        </div>
                        <div className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
                          {getSelectedPrice().toFixed(2)}€
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                          style={{ color: 'var(--foreground)' }}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-xl font-semibold w-8 text-center" style={{ color: 'var(--foreground)' }}>
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                          style={{ color: 'var(--foreground)' }}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="border-t pt-4 mb-4" style={{ borderColor: 'var(--border)' }}>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                          Total
                        </span>
                        <span className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                          {getTotalPrice().toFixed(2)}€
                        </span>
                      </div>
                    </div>

                    <div className="relative" ref={menuRef}>
                      <div className="space-y-2 transition-all duration-300 ease-in-out">
                        {!showOrderOptions ? (
                          <button
                            onClick={() => setShowOrderOptions(true)}
                            className="w-full py-3 px-4 rounded-xl font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2 text-white"
                            style={{ background: 'var(--primary)' }}
                          >
                            <span>Commander cette pizza</span>
                          </button>
                        ) : (
                          <div className="space-y-2">
                            <a
                              href="tel:+33XXXXXXXXX"
                              className="w-full py-3 px-4 rounded-xl font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2 text-white"
                              style={{ background: '#22c55e' }}
                            >
                              <FiPhone className="w-4 h-4" />
                              <span>Appeler</span>
                            </a>
                            <a
                              href="https://www.ubereats.com/fr/store/pizza-le-duc/ShfPBgd5WYG-0lAKLxIazQ"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-3 px-4 rounded-xl font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2 text-white"
                              style={{ background: '#000000' }}
                            >
                              <SiUbereats className="w-4 h-4" />
                              <span>Uber Eats</span>
                            </a>
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
      </div>
    </div>
  );
};

export default PizzaModal;