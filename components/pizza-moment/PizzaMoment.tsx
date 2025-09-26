'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Clock, Flame, Eye } from 'lucide-react';
import { itemsService, ItemData } from '@/services/itemsService';
import PizzaModal from './PizzaModal';
import styles from './PizzaMoment.module.css';

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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % pizzas.length);
    setCurrentImageIndex(0); // Reset to first image when changing pizza
    if (pizzas[currentIndex + 1]) {
      setSelectedVariant(pizzas[currentIndex + 1].variants[0]?.id || null);
    }
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + pizzas.length) % pizzas.length);
    setCurrentImageIndex(0); // Reset to first image when changing pizza
    if (pizzas[currentIndex - 1]) {
      setSelectedVariant(pizzas[currentIndex - 1].variants[0]?.id || null);
    }
  };

  const nextImage = () => {
    const currentPizza = getCurrentPizza();
    if (currentPizza && currentPizza.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % currentPizza.images.length);
    }
  };

  const prevImage = () => {
    const currentPizza = getCurrentPizza();
    if (currentPizza && currentPizza.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + currentPizza.images.length) % currentPizza.images.length);
    }
  };

  const openModal = (pizza: ItemData) => {
    setSelectedPizza(pizza);
    setIsModalOpen(true);
  };

  const getCurrentPizza = () => pizzas[currentIndex];
  
  const getSortedImages = (pizza: ItemData) => {
    // Sort images so default image comes first
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

  const getSelectedVariantPrice = (pizza: ItemData) => {
    const variant = pizza.variants.find(v => v.id === selectedVariant);
    return variant?.price || pizza.variants[0]?.price || 0;
  };

  const isVegetarian = (pizza: ItemData) => {
    return pizza.options.some(option => 
      option.optionType === 'VEGETARIENNE' && 
      JSON.parse(option.optionValue) === 'Oui'
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }



  const currentPizza = getCurrentPizza();

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className={`text-center mb-12 ${styles.fadeInUp}`}>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
          <Flame className="w-4 h-4" />
          PIZZA DU MOMENT
        </div>
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
          Découvrez Notre Création Exclusive
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Une sélection unique de pizzas artisanales, créées avec passion par nos chefs
        </p>
      </div>

      {/* Main Slider Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-50" />
        
        <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12">
          {/* Image Section */}
          <div key={currentIndex} className={`relative ${styles.slideIn}`}>
            <div 
              className={`relative aspect-square rounded-2xl overflow-hidden shadow-xl ${styles.steamEffect}`}
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            >
              <img
                key={`${currentIndex}-${currentImageIndex}`}
                src={getCurrentImage(currentPizza)}
                alt={`${currentPizza.name} - Image ${currentImageIndex + 1}`}
                className={`w-full h-full object-cover ${styles.pizzaImage}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              {/* Image Navigation Arrows */}
              {getSortedImages(currentPizza).length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full shadow-md hover:bg-black/70 transition-all duration-300 flex items-center justify-center text-white hover:scale-110 z-10"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full shadow-md hover:bg-black/70 transition-all duration-300 flex items-center justify-center text-white hover:scale-110 z-10"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
              
              {/* Floating Badge */}
              {isVegetarian(currentPizza) && (
                <div className={`absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 ${styles.floatingBadge}`}>
                  <img 
                    src="/sans-viande.svg" 
                    alt="Végétarien" 
                    className="w-16 h-16"
                  />
                </div>
              )}
              
              {/* Image Indicators */}
              {getSortedImages(currentPizza).length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                  {getSortedImages(currentPizza).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'bg-white w-6' 
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                    >
                      {/* Auto-scroll progress indicator */}
                      {index === currentImageIndex && !isImageHovered && getSortedImages(currentPizza).length > 1 && (
                        <div className="absolute inset-0 rounded-full border border-white/30">
                          <div 
                            className="absolute inset-0 rounded-full bg-white/20 animate-pulse"
                            style={{
                              animation: 'progress 3s linear infinite'
                            }}
                          />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {pizzas.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setCurrentImageIndex(0); // Reset to first image when changing pizza
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-orange-500 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div key={`content-${currentIndex}`} className={`flex flex-col justify-center ${styles.slideIn}`}>
            <div className="mb-6">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                {currentPizza.name}
              </h3>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {currentPizza.description || "Une création unique qui éveillera vos papilles avec des saveurs authentiques et des ingrédients de qualité premium."}
              </p>

              {/* Variants Selection */}
              {currentPizza.variants.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Choisissez votre taille</h4>
                  <div className="flex flex-wrap gap-3">
                    {currentPizza.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.id || null)}
                        className={`px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
                          selectedVariant === variant.id
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 hover:border-orange-300 text-gray-700'
                        }`}
                      >
                        <span className="font-medium">{variant.variantName}</span>
                        <span className="block text-sm font-bold">
                          {variant.price.toFixed(2)}€
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Display */}
              <div className={`flex items-center gap-4 mb-8 ${styles.priceAnimation}`}>
                <div className="text-3xl font-bold text-orange-600">
                  {getSelectedVariantPrice(currentPizza).toFixed(2)}€
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Préparation 15-20 min</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => openModal(currentPizza)}
                  className={`flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${styles.buttonHover}`}
                >
                  <Eye className="w-5 h-5" />
                  Voir les détails
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {pizzas.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-gray-700 hover:text-orange-500 transform hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center text-gray-700 hover:text-orange-500 transform hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
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
