'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Clock, Info, Plus, Minus, Phone, Bike, ChevronRight } from 'lucide-react';

interface PizzaModalPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const PizzaModalPreview: React.FC<PizzaModalPreviewProps> = ({ isOpen, onClose }) => {
  const pizza = {
    name: "La Forestière",
    description: "Pâte artisanale garnie de crème de cèpes, champignons frais, lardons fumés et mozzarella fondante",
    images: [
      { imageUrl: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=1200&h=800&fit=crop", isDefault: true },
      { imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1200&h=800&fit=crop", isDefault: false },
      { imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1200&h=800&fit=crop", isDefault: false }
    ],
    variants: [
      { id: 'small', variantName: 'Petite', price: 12.50, sku: 'FOR-S' },
      { id: 'medium', variantName: 'Moyenne', price: 15.90, sku: 'FOR-M' },
      { id: 'large', variantName: 'Grande', price: 18.50, sku: 'FOR-L' }
    ],
    options: [
      { optionType: 'VEGETARIENNE', optionValue: 'Non' }
    ]
  };

  const [selectedVariant, setSelectedVariant] = useState(pizza.variants[1]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showOrderOptions, setShowOrderOptions] = useState(false);
  const [showUberEatsOptions, setShowUberEatsOptions] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOrderOptions(false);
        setShowUberEatsOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isVegetarian = () => {
    return pizza.options?.some(option =>
      option.optionType === 'VEGETARIENNE' &&
      JSON.parse(option.optionValue) === 'Oui'
    ) || false;
  };

  const getSelectedPrice = () => {
    return selectedVariant?.price || 0;
  };

  const getTotalPrice = () => {
    return getSelectedPrice() * quantity;
  };

  if (!isOpen) return null;

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
              {pizza.name}
            </h2>
            <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>15-20 min</span>
              </div>
              {isVegetarian() && (
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

              {/* Image Section */}
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <img
                    src={pizza.images[selectedImageIndex]?.imageUrl}
                    alt={pizza.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Image Thumbnails */}
                {pizza.images.length > 1 && (
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
                          alt={`${pizza.name} ${index + 1}`}
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
                    {pizza.description}
                  </p>
                </div>


                {/* Size Selection */}
                <div>
                  <h3 className="text-lg font-medium mb-3" style={{ color: 'var(--foreground)' }}>
                    Choisissez votre taille
                  </h3>
                  <div className="space-y-2">
                    {pizza.variants.map((variant) => (
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

                {/* Order Summary */}
                <div className="border-t pt-6">
                  <div className="bg-gray-50 rounded-2xl p-6" style={{ backgroundColor: 'var(--muted)' }}>
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                          {selectedVariant?.variantName} - Prix unitaire
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
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                            Total ({quantity} pizza{quantity > 1 ? 's' : ''})
                          </div>
                          <div className="text-2xl font-bold" style={{ color: 'var(--primary)' }}>
                            {getTotalPrice().toFixed(2)}€
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs px-3 py-1 rounded-full"
                             style={{ backgroundColor: 'var(--primary)/10', color: 'var(--primary)' }}>
                          <Info className="w-3 h-3" />
                          <span>Préparation 15-20 min</span>
                        </div>
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
                              style={{ background: 'var(--primary)' }}
                            >
                              <Phone className="w-4 h-4" />
                              <span>Appeler</span>
                            </a>
                            <button
                              onClick={() => setShowUberEatsOptions(!showUberEatsOptions)}
                              className="w-full py-3 px-4 rounded-xl font-medium transition-all hover:opacity-90 flex items-center justify-center gap-2 text-white"
                              style={{ background: 'var(--primary)' }}
                            >
                              <Bike className="w-4 h-4" />
                              <span>Uber Eats</span>
                              <ChevronRight
                                className={`w-4 h-4 transition-transform duration-200 ${showUberEatsOptions ? 'rotate-90' : ''}`}
                              />
                            </button>

                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                showUberEatsOptions ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                              }`}
                            >
                              <div className="space-y-1 pt-1">
                                <a
                                  href="https://www.ubereats.com/fr/store/pizza-le-duc/ShfPBgd5WYG-0lAKLxIazQ"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block w-full py-2 px-4 text-sm rounded-lg transition-colors hover:bg-gray-100"
                                  style={{ color: 'var(--foreground)', backgroundColor: 'var(--muted)' }}
                                >
                                  📍 PODENSAC
                                </a>
                                <a
                                  href="https://www.ubereats.com/fr/store/pizza-le-duc-langon/knYx33kaXLSOSaJVs7XyRg"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block w-full py-2 px-4 text-sm rounded-lg transition-colors hover:bg-gray-100"
                                  style={{ color: 'var(--foreground)', backgroundColor: 'var(--muted)' }}
                                >
                                  📍 LANGON
                                </a>
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
      </div>
    </div>
  );
};

export default PizzaModalPreview;