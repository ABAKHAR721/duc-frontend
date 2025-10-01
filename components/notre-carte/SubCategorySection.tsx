'use client';

import React from 'react';
import { CategoryData } from '@/services/categoriesService';
import { ItemData, ItemVariant } from '@/services/itemsService';
import ItemCard from './ItemCard';

interface SubCategorySectionProps {
  category: CategoryData;
  items: ItemData[];
  onCustomizeItem: (item: ItemData) => void;
  onOrderItem: (item: ItemData, variant?: ItemVariant) => void;
}

const SubCategorySection: React.FC<SubCategorySectionProps> = ({
  category,
  items,
  onCustomizeItem,
  onOrderItem,
}) => {
  // Group items by subcategory
  const itemsBySubCategory = React.useMemo(() => {
    const grouped: { [key: string]: ItemData[] } = {};
    
    // Special case for "pizza-moment" - show items from parent category
    if (category.name.toLowerCase().includes('pizza-moment') || category.name.toLowerCase().includes('pizza du moment')) {
      grouped[category.name] = items.filter(item => item.categoryId === category.id);
    } 
    // If category has children (subcategories), group items by subcategory only
    else if (category.children && category.children.length > 0) {
      category.children.forEach(subCat => {
        const subCategoryItems = items.filter(item => item.categoryId === subCat.id);
        if (subCategoryItems.length > 0) {
          grouped[subCat.name] = subCategoryItems;
        }
      });
    } 
    // For other parent categories without children, don't show any items
    // (items should only be in subcategories)
    
    return grouped;
  }, [category, items]);

  return (
    <div className="w-full">
      {Object.entries(itemsBySubCategory).map(([subCategoryName, categoryItems]) => {
        if (categoryItems.length === 0) return null;
        
        return (
          <div key={subCategoryName} className="mb-12 last:mb-0">
            {/* Subcategory Header */}
            <div className="relative mb-8">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-6 px-8 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl md:text-2xl font-light uppercase tracking-wide">
                      {subCategoryName}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-8 h-0.5 bg-white/60"></div>
                      <span className="text-sm text-white/80">{categoryItems.length} produit{categoryItems.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">
                        {subCategoryName.toLowerCase().includes('pizza') ? '🍕' : 
                         subCategoryName.toLowerCase().includes('boisson') ? '🥤' : 
                         subCategoryName.toLowerCase().includes('dessert') ? '🍰' : 
                         subCategoryName.toLowerCase().includes('kiosquito') ? '🥪' : '🍽️'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -bottom-2 left-8 w-16 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-8">
              {categoryItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onCustomize={() => onCustomizeItem(item)}
                  onOrder={(variant?: ItemVariant) => onOrderItem(item, variant)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubCategorySection;
