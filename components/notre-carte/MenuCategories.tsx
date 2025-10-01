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
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-light mb-3" style={{ color: 'var(--foreground)' }}>
          Choisissez votre catégorie
        </h2>
        <div className="w-12 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto"></div>
      </div>
      
      {/* Horizontal Scrollable Categories */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3 md:gap-4 px-2" style={{ minWidth: 'max-content' }}>
          {mainCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id!)}
              className={`
                group relative overflow-hidden rounded-2xl flex-shrink-0 transition-all duration-500 transform hover:scale-105
                ${selectedCategory === category.id 
                  ? 'shadow-2xl ring-3 ring-orange-300' 
                  : 'shadow-lg hover:shadow-xl'
                }
              `}
              style={{ 
                width: '120px', 
                height: '120px',
                minWidth: '120px'
              }}
            >
              {/* Full Background Image */}
              {category.imageUrl ? (
                <div className="absolute inset-0">
                  <img 
                    src={category.imageUrl} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  {selectedCategory === category.id && (
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/40 via-orange-500/10 to-transparent"></div>
                  )}
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <span className="text-4xl">
                    {category.name.includes('pizza') ? '🍕' : 
                     category.name.toLowerCase().includes('boisson') ? '🥤' : 
                     category.name.toLowerCase().includes('dessert') ? '🍰' : 
                     category.name.toLowerCase().includes('kiosquito') ? '🥪' : '🍽️'}
                  </span>
                </div>
              )}
              
              {/* Text Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-3 text-center">
                <h3 className="text-xs font-bold uppercase tracking-wide leading-tight text-white drop-shadow-lg">
                  {category.name}
                </h3>
                {category._count?.items !== undefined && (
                  <p className="text-xs text-white/90 drop-shadow-md mt-1">
                    {category._count.items} item{category._count.items !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Selection Indicator */}
              {selectedCategory === category.id && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuCategories;
