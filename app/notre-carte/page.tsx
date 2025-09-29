'use client';

import React, { useState, useEffect } from 'react';
import { categoriesService, CategoryData } from '@/services/categoriesService';
import { itemsService, ItemData, ItemVariant } from '@/services/itemsService';
import MenuCategories from '@/components/notre-carte/MenuCategories';
import SubCategorySection from '@/components/notre-carte/SubCategorySection';
import PizzaCustomizationModal from '@/components/notre-carte/PizzaCustomizationModal';
import OrderModal from '@/components/notre-carte/OrderModal';
import Navbar from '@/components/Header/Navbar';
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
  const [showMeatOnly, setShowMeatOnly] = useState(false);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  // Apply filters to items
  const applyFilters = (items: ItemData[]) => {
    let filtered = items;

    // Filter by meat preference
    if (showMeatOnly) {
      filtered = filtered.filter(item => {
        const vegetarianOption = item.options?.find(opt => opt.optionType === 'VEGETARIENNE');
        if (!vegetarianOption) return true; // Show items without vegetarian option
        
        try {
          const parsedVeg = JSON.parse(vegetarianOption.optionValue);
          return parsedVeg === 'Non'; // Show only non-vegetarian items
        } catch {
          return vegetarianOption.optionValue === 'Non';
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
  }, [showMeatOnly]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />
      
      <div className="px-4 py-8">
        {/* Menu Categories */}
        <MenuCategories
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
            {/* Size Filter */}
            <div className="flex items-center gap-2">
              {availableSizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedSize === size
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Filter Button */}
            <button className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600 transition-colors">
              <span>≡</span>
              FILTRER
            </button>

            {/* Meat Filter */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="meat-only"
                checked={showMeatOnly}
                onChange={(e) => setShowMeatOnly(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="meat-only" className="text-sm text-gray-700">
                Je mange
              </label>
              <div className="bg-orange-500 rounded-full p-1">
                <img 
                  src="/sans-viande.svg" 
                  alt="Viande" 
                  className="w-4 h-4 filter invert"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Content */}
        {selectedCategoryData && (
          <SubCategorySection
            category={selectedCategoryData}
            items={filteredItems}
            onCustomizeItem={handleCustomizeItem}
            onOrderItem={handleOrderItem}
          />
        )}

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
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default NotreCarte;
