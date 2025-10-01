'use client';

import React, { useState, useEffect } from 'react';
import { categoriesService, CategoryData } from '@/services/categoriesService';
import { itemsService, ItemData, ItemVariant } from '@/services/itemsService';
import MenuCategories from '@/components/notre-carte/MenuCategories';
import SubCategorySection from '@/components/notre-carte/SubCategorySection';
import PizzaCustomizationModal from '@/components/notre-carte/PizzaCustomizationModal';
import OrderModal from '@/components/notre-carte/OrderModal';
import Header from '@/components/Header/Header';
import MobileBottomNav from '@/components/Header/MobileBottomNav';

const NotreCarte: React.FC = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryData, setSelectedCategoryData] = useState<CategoryData | null>(null);
  const [filteredItems, setFilteredItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Size filter state
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [showVegetarianOnly, setShowVegetarianOnly] = useState(false);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  // Apply filters to items
  const applyFilters = (items: ItemData[]) => {
    let filtered = items;

    // Filter by vegetarian preference
    if (showVegetarianOnly) {
      filtered = filtered.filter(item => {
        const vegetarianOption = item.options?.find(opt => opt.optionType === 'VEGETARIENNE');
        if (!vegetarianOption) return false; // Hide items without vegetarian option when filtering for vegetarian
        
        try {
          const parsedVeg = JSON.parse(vegetarianOption.optionValue);
          // When vegetarian filter is checked, show only vegetarian items
          console.log(`Item: ${item.name}, VEGETARIENNE: ${parsedVeg}, showing vegetarian only: ${parsedVeg === 'Oui'}`);
          return parsedVeg === 'Oui';
        } catch {
          console.log(`Item: ${item.name}, VEGETARIENNE (raw): ${vegetarianOption.optionValue}, showing vegetarian only: ${vegetarianOption.optionValue === 'Oui'}`);
          return vegetarianOption.optionValue === 'Oui';
        }
      });
    }

    // Filter by size if selected
    if (selectedSize) {
      filtered = filtered.filter(item => {
        return item.variants?.some(variant => variant.variantName === selectedSize);
      });
    }

    return filtered;
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadCategoryData();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory) {
      loadCategoryData();
    }
  }, [showVegetarianOnly]);

  useEffect(() => {
    if (selectedCategory) {
      loadCategoryData();
    }
  }, [selectedSize]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, itemsData] = await Promise.all([
        categoriesService.getAll(),
        itemsService.getAll(),
      ]);
      
      setCategories(categoriesData);
      setItems(itemsData);
      
      // Auto-select first main category
      const mainCategories = categoriesData.filter((cat: CategoryData) => !cat.parentId);
      if (mainCategories.length > 0) {
        setSelectedCategory(mainCategories[0].id!);
      }
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryData = async () => {
    if (!selectedCategory) return;

    try {
      const categoryData = await categoriesService.getById(selectedCategory);
      setSelectedCategoryData(categoryData);

      // Special handling for different category types
      let categoryItems: ItemData[] = [];
      
      // For "pizza-moment" category, include items from the parent category
      if (categoryData.name.toLowerCase().includes('pizza-moment') || categoryData.name.toLowerCase().includes('pizza du moment')) {
        categoryItems = items.filter(item => item.categoryId === categoryData.id);
      } 
      // For other categories, only include items from subcategories
      else if (categoryData.children && categoryData.children.length > 0) {
        const subCategoryIds = categoryData.children.map((child: CategoryData) => child.id!);
        categoryItems = items.filter(item => subCategoryIds.includes(item.categoryId));
      }
      
      // Extract available sizes from all items
      const sizes = new Set<string>();
      categoryItems.forEach(item => {
        item.variants?.forEach(variant => {
          sizes.add(variant.variantName);
        });
      });
      setAvailableSizes(Array.from(sizes).sort());
      
      setFilteredItems(applyFilters(categoryItems));
    } catch (err) {
      console.error('Error loading category data:', err);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleCustomizeItem = (item: ItemData) => {
    setSelectedItem(item);
    setIsCustomizationModalOpen(true);
  };

  const handleOrderItem = (item: ItemData, variant?: ItemVariant) => {
    const orderData = {
      item,
      variant,
      quantity: 1,
      totalPrice: variant?.price || 0,
    };
    setOrderDetails(orderData);
    setIsOrderModalOpen(true);
  };

  const handleCustomOrder = (customization: any) => {
    setOrderDetails(customization);
    setIsOrderModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header with Navigation */}
      <Header variant="transparent" />
      
      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/artisan-pizza-oven-with-flames-and-fresh-pizza-2.jpg" 
            alt="Pizza Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-medium mb-6 relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20">
              <span className="relative z-10 tracking-wide text-white">🍕 NOTRE CARTE COMPLÈTE 🍕</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light mb-6 text-white leading-tight">
              Notre Carte
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 md:w-24 h-0.5 bg-gradient-to-r from-white to-white/50"></div>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
              Découvrez nos créations artisanales, préparées avec passion et des ingrédients de qualité premium
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative -mt-20 z-20 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          {/* Menu Categories Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border border-white/20">
            <MenuCategories
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />

            {/* Filters */}
            {selectedCategoryData && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Size Filter */}
                  {availableSizes.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 mr-2">Tailles:</span>
                      {availableSizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            selectedSize === size
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-md'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Vegetarian Filter */}
                  <div className="flex items-center gap-3 ml-auto">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showVegetarianOnly}
                        onChange={(e) => setShowVegetarianOnly(e.target.checked)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Je mange</span>
                    </label>
                    <div className="w-16 h-16 rounded-full  p-2 flex items-center justify-center">
                      <img 
                        src="/sans-viande.svg" 
                        alt="Végétarien" 
                        className="w-16 h-16"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Selected Category Items */}
          {selectedCategoryData && (
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <SubCategorySection
                category={selectedCategoryData}
                items={filteredItems}
                onCustomizeItem={handleCustomizeItem}
                onOrderItem={handleOrderItem}
              />
            </div>
          )}
        </div>

        {/* Modals */}
        <PizzaCustomizationModal
          isOpen={isCustomizationModalOpen}
          onClose={() => setIsCustomizationModalOpen(false)}
          item={selectedItem}
          onOrder={handleCustomOrder}
        />
        
        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          orderDetails={orderDetails}
        />

        <MobileBottomNav />
      </div>
    </div>
  );
};

export default NotreCarte;
