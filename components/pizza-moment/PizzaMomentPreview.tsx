'use client';

import React, { useState, useEffect } from 'react';
import { FiStar, FiClock, FiInfo } from 'react-icons/fi';

const PizzaSingleCardHero: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState('medium');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Single pizza data
  const pizza = {
    id: 1,
    name: "La Forestière",
    description: "Pâte artisanale garnie de crème de cèpes, champignons frais, lardons fumés et mozzarella fondante",
    images: [
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1200&h=800&fit=crop",
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1200&h=800&fit=crop"
    ],
    variants: [
      { id: 'small', variantName: 'Petite', price: 12.50, size: '26cm' },
      { id: 'medium', variantName: 'Moyenne', price: 15.90, size: '32cm' },
      { id: 'large', variantName: 'Grande', price: 18.50, size: '38cm' }
    ],
    isVegetarian: false,
    rating: 4.8,
    reviews: 234,
    specialty: "Chef's Special",
    preparationTime: '15-20',
    ingredients: ['Crème de cèpes', 'Champignons', 'Lardons', 'Mozzarella', 'Basilic']
  };

  const getSelectedPrice = () => {
    const variant = pizza.variants.find(v => v.id === selectedVariant);
    return variant?.price || pizza.variants[0]?.price || 0;
  };

  const getSelectedSize = () => {
    const variant = pizza.variants.find(v => v.id === selectedVariant);
    return variant?.size || pizza.variants[0]?.size || '';
  };

  // Auto-scroll images
  useEffect(() => {
    if (pizza.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % pizza.images.length);
      }, 4000); // Change image every 4 seconds

      return () => clearInterval(interval);
    }
  }, [pizza.images.length]);

  return (
    <div style={{ background: 'var(--background)' }} className="py-20">
      <div className="max-w-5xl mx-auto px-8">

        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 relative overflow-hidden"
               style={{
                 background: 'linear-gradient(135deg, var(--color-orange-100), var(--color-cream-200))',
                 color: 'var(--color-brown-800)',
                 border: '2px solid var(--color-orange-200)'
               }}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 animate-pulse"></div>
            <span className="relative z-10 tracking-wide">✨ PIZZA DU MOMENT ✨</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-light mb-6 relative"
              style={{ color: 'var(--foreground)' }}>
            Création d&apos;Exception
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-primary to-secondary"></div>
          </h2>

          <p className="text-xl max-w-3xl mx-auto font-light leading-relaxed"
             style={{ color: 'var(--muted-foreground)' }}>
            Découvrez nos pizzas artisanales, conçues avec passion et savoir-faire
          </p>
        </div>

        {/* Main Hero Card */}
        <div
          className="relative rounded-3xl overflow-hidden transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Background Image */}
          <div className="relative h-[500px] overflow-hidden">
            <div 
              className="absolute inset-0 transition-transform duration-700 ease-out"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <img
                src={pizza.images[currentImageIndex]}
                alt={pizza.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Dynamic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />


            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-end">
              <div className="w-full p-8 lg:p-12">
                <div className="max-w-6xl mx-auto">
                  <div className="grid lg:grid-cols-2 gap-12 items-end">
                    
                    {/* Left Side - Main Info */}
                    <div className="space-y-6">
                      {/* Badge */}
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 text-orange-400 text-xs font-semibold">
                          {pizza.specialty}
                        </span>
                        {pizza.isVegetarian && (
                          <span className="px-3 py-1 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-green-400 text-xs font-semibold">
                            🌱 Végétarien
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <div>
                        <h1 className="text-5xl lg:text-6xl font-bold text-white mb-3">
                          {pizza.name}
                        </h1>
                        <p className="text-base text-white/90 leading-relaxed">
                          {pizza.description}
                        </p>
                      </div>

                      {/* Ingredients */}
                      <div className="flex flex-wrap gap-2">
                        {pizza.ingredients.map((ingredient, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`w-5 h-5 ${
                                  i < Math.floor(pizza.rating)
                                    ? 'text-amber-400 fill-current'
                                    : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-white font-semibold">{pizza.rating}</span>
                          <span className="text-gray-400 text-sm">({pizza.reviews} avis)</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <FiClock className="w-5 h-5" />
                          <span>{pizza.preparationTime} min</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Order Section */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                      <div className="space-y-4">
                        {/* Size Selection */}
                        <div>
                          <label className="text-white text-sm font-medium mb-3 block">
                            Choisissez votre taille
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {pizza.variants.map((variant) => (
                              <button
                                key={variant.id}
                                onClick={() => setSelectedVariant(variant.id)}
                                className={`relative p-4 rounded-xl border transition-all duration-300 ${
                                  selectedVariant === variant.id
                                    ? 'bg-white text-gray-900 border-white'
                                    : 'bg-white/5 text-white border-white/20 hover:bg-white/10'
                                }`}
                              >
                                <div className="text-sm font-semibold">{variant.variantName}</div>
                                <div className="text-xs opacity-70 mt-1">{variant.size}</div>
                                <div className={`text-lg font-bold mt-2 ${
                                  selectedVariant === variant.id ? 'text-orange-600' : 'text-orange-400'
                                }`}>
                                  {variant.price.toFixed(2)}€
                                </div>
                                {selectedVariant === variant.id && (
                                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500" />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* View Details Button */}
                        <div className="flex gap-3">
                          <button
                            className="flex-1 py-3 px-5 rounded-lg font-medium transition-all duration-300 hover:opacity-90 flex items-center justify-center gap-2 text-white"
                            style={{ background: 'var(--primary)' }}
                          >
                            <FiInfo className="w-4 h-4" />
                            <span>Voir détails</span>
                          </button>
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
    </div>
  );
};

export default PizzaSingleCardHero;