'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Eye } from 'lucide-react';
import { itemsService, ItemData } from '@/services/itemsService';
import PizzaModal from './PizzaModal';

const PizzaMoment: React.FC = () => {
  const [pizzas, setPizzas] = useState<ItemData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedPizza, setSelectedPizza] = useState<ItemData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isImageHovered, setIsImageHovered] = useState(false);

  useEffect(() => {
    const fetchPizzaMoment = async () => {
      try {
        const data = await itemsService.getPizzaMoment();
        setPizzas(data);
        if (data.length > 0) {
          setSelectedVariant(data[0].variants[0]?.id || null);
        }
      } catch (error) {
        console.error('Error fetching pizza moment:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPizzaMoment();
  }, []);

  // Auto-scroll images effect
  useEffect(() => {
    const currentPizza = getCurrentPizza();
    if (!currentPizza || currentPizza.images.length <= 1 || isImageHovered) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % currentPizza.images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isImageHovered, pizzas]);


  const openModal = (pizza: ItemData) => {
    setSelectedPizza(pizza);
    setIsModalOpen(true);
  };

  const getCurrentPizza = () => pizzas[currentIndex] || null;
  
  const getSortedImages = (pizza: ItemData) => {
    // Sort images so default image comes first
    if (!pizza?.images) return [];
    return [...pizza.images].sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return 0;
    });
  };

  const getCurrentImage = (pizza: ItemData) => {
    const sortedImages = getSortedImages(pizza);
    return sortedImages[currentImageIndex]?.imageUrl || '/placeholder-pizza.jpg';
  };


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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }



  const currentPizza = getCurrentPizza();

  if (!currentPizza) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Aucune pizza du moment disponible</h3>
        <p className="text-gray-600">Revenez bientôt pour découvrir nos créations spéciales !</p>
      </div>
    );
  }

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
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          {/* Background Image */}
          <div className="relative h-[500px] overflow-hidden">
            <div
              className="absolute inset-0 transition-transform duration-700 ease-out"
              style={{
                transform: isImageHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <img
                key={`${currentIndex}-${currentImageIndex}`}
                src={getCurrentImage(currentPizza)}
                alt={`${currentPizza.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Dynamic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

            {/* Floating Badge */}
            {isVegetarian(currentPizza) && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                <img
                  src="/sans-viande.svg"
                  alt="Végétarien"
                  className="w-16 h-16"
                />
              </div>
            )}

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
                          Pizza Exclusive
                        </span>
                        {isVegetarian(currentPizza) && (
                          <span className="px-3 py-1 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30 text-green-400 text-xs font-semibold">
                            🌱 Végétarien
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <div>
                        <h1 className="text-5xl lg:text-6xl font-bold text-white mb-3">
                          {currentPizza.name}
                        </h1>
                        <p className="text-base text-white/90 leading-relaxed">
                          {currentPizza.description || "Une création unique qui éveillera vos papilles avec des saveurs authentiques et des ingrédients de qualité premium."}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock className="w-5 h-5" />
                          <span>15-20 min</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Order Section */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                      <div className="space-y-4">
                        {/* Size Selection */}
                        {currentPizza.variants.length > 0 && (
                          <div>
                            <label className="text-white text-sm font-medium mb-3 block">
                              Choisissez votre taille
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {currentPizza.variants.map((variant) => (
                                <button
                                  key={variant.id}
                                  onClick={() => setSelectedVariant(variant.id || null)}
                                  className={`relative p-4 rounded-xl border transition-all duration-300 ${
                                    selectedVariant === variant.id
                                      ? 'bg-white text-gray-900 border-white'
                                      : 'bg-white/5 text-white border-white/20 hover:bg-white/10'
                                  }`}
                                >
                                  <div className="text-sm font-semibold">{variant.variantName}</div>
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
                        )}

                        {/* View Details Button */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => openModal(currentPizza)}
                            className="flex-1 py-3 px-5 rounded-lg font-medium transition-all duration-300 hover:opacity-90 flex items-center justify-center gap-2 text-white"
                            style={{ background: 'var(--primary)' }}
                          >
                            <Eye className="w-4 h-4" />
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

        {/* Navigation Dots for multiple pizzas */}
        {pizzas.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {pizzas.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setCurrentImageIndex(0);
                  if (pizzas[index]) {
                    setSelectedVariant(pizzas[index].variants[0]?.id || null);
                  }
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}

      </div>

      {/* Modal */}
      {isModalOpen && selectedPizza && (
        <PizzaModal
          pizza={selectedPizza}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PizzaMoment;
