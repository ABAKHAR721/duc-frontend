'use client';

import React from 'react';
import { CategoryData } from '@/services/categoriesService';

interface MenuCategoriesProps {
  categories: CategoryData[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
}

const MenuCategories: React.FC<MenuCategoriesProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  // Filter only parent categories with items > 0 and sort by displayOrder
  const mainCategories = categories
    .filter(cat => !cat.parentId && (cat._count?.items || 0) > 0)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const getCategoryImage = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('pizza')) return '/images/pizza-icon.png';
    if (name.includes('kiosquito') || name.includes('sandwich')) return '/images/sandwich-icon.png';
    if (name.includes('dessert')) return '/images/dessert-icon.png';
    if (name.includes('boisson') || name.includes('drink')) return '/images/drink-icon.png';
    return '/images/default-category.png';
  };

  return (
    <div className="w-full mb-8">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-8">
        NOTRE CARTE
      </h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-start gap-3 mb-4">
        {mainCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id!)}
            className={`
              relative overflow-hidden rounded-2xl p-3 w-36 h-36 flex flex-col items-center justify-center
              transition-all duration-300
              ${selectedCategory === category.id 
                ? 'bg-green-700 text-white shadow-2xl transform scale-105 ring-2 ring-orange-400' 
                : 'bg-green-600 text-white hover:bg-green-700'
              }
            `}
          >
            {/* Category Image */}
            <div className="relative z-10 mb-2">
              {category.imageUrl ? (
                <img 
                  src={category.imageUrl} 
                  alt={category.name}
                  className="w-16 h-16 object-cover rounded-lg mx-auto"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto">
                  <span className="text-2xl">
                    {category.name.includes('pizza') ? '🍕' : 
                     category.name.toLowerCase().includes('boisson') ? '🥤' : 
                     category.name.toLowerCase().includes('dessert') ? '🍰' : 
                     category.name.toLowerCase().includes('kiosquito') ? '🥪' : '🍽️'}
                  </span>
                </div>
              )}
            </div>
            
            {/* Category content */}
            <div className="relative z-10 text-center">
              <h3 className="text-sm font-bold uppercase tracking-wide">
                {category.name}
              </h3>
              {category._count?.items !== undefined && (
                <p className="text-xs mt-1 opacity-80">
                  {category._count.items} item{category._count.items !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </button>
        ))}
        </div>
      </div>
    </div>
  );
};

export default MenuCategories;
