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
    <div className="w-full max-w-4xl mx-auto">
      {Object.entries(itemsBySubCategory).map(([subCategoryName, categoryItems]) => {
        if (categoryItems.length === 0) return null;
        
        return (
          <div key={subCategoryName} className="mb-12">
            {/* Subcategory Header */}
            <div className="bg-green-700 text-white py-4 px-6 mb-6">
              <h2 className="text-xl font-bold uppercase tracking-wide">
                {subCategoryName}
              </h2>
              <div className="h-1 bg-red-600 w-full mt-2"></div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
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
