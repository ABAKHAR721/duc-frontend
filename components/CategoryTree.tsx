"use client";

import { Folder, ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { TreeCategory } from '@/types/category'; 

interface CategoryTreeProps {
  categories: TreeCategory[];
  onEdit: (category: TreeCategory) => void;
  onDelete: (category: TreeCategory) => void;
  onAddSubCategory: (parentId: string) => void;
  emptyMessage?: string;
}

const CategoryNode = ({ category, onEdit, onDelete, onAddSubCategory }: { category: TreeCategory; onEdit: (category: TreeCategory) => void; onDelete: (category: TreeCategory) => void; onAddSubCategory: (parentId: string) => void; }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="ml-4 my-1">
      <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 group">
        <div className="flex items-center flex-grow min-w-0">
          {hasChildren ? (
            <button onClick={() => setIsOpen(!isOpen)} className="mr-2 p-1 rounded-full hover:bg-gray-200 self-center">
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <div className="w-6 mr-2"></div> // Placeholder for alignment
          )}
          {category.imageUrl ? (
            <img src={category.imageUrl} alt={category.name} className="h-10 w-10 rounded-md object-cover mr-3 flex-shrink-0" />
          ) : (
            <Folder size={18} className="mr-3 text-gray-600 flex-shrink-0 self-center" />
          )}
          <div className="flex-grow min-w-0">
            <span className="font-medium truncate" title={category.name}>{category.name}</span>
            {category.description && (
              <p className="text-sm text-gray-500 truncate" title={category.description}>
                {category.description}
              </p>
            )}
            <div className="flex items-center space-x-4 mt-1">
              <div className="flex items-center text-xs text-slate-500">
                <span className="font-semibold text-slate-600 mr-1">Ordre:</span>
                <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md">{category.displayOrder}</span>
              </div>
              <div className="flex items-center text-xs text-slate-500">
                <span className="font-semibold text-slate-600 mr-1">Articles:</span>
                <span className="font-mono text-slate-700">{category._count?.items || 0}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity space-x-2">
          <button onClick={() => onAddSubCategory(category.id)} className="text-xs px-2 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600">Ajouter sous-catégorie</button>
          <button onClick={() => onEdit(category)} className="text-xs px-2 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600">Modifier</button>
          <button onClick={() => onDelete(category)} className="text-xs px-2 py-1 rounded-md bg-red-500 text-white hover:bg-red-600">Supprimer</button>
        </div>
      </div>
      {isOpen && hasChildren && (
        <div className="pl-6 border-l-2 border-gray-200">
          {category.children.map(child => (
            <CategoryNode key={child.id} category={child} onEdit={onEdit} onDelete={onDelete} onAddSubCategory={onAddSubCategory} />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryTree = ({ categories, onEdit, onDelete, onAddSubCategory, emptyMessage = "Aucune catégorie à afficher" }: CategoryTreeProps) => {
  if (categories.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      {categories.map(category => (
        <CategoryNode key={category.id} category={category} onEdit={onEdit} onDelete={onDelete} onAddSubCategory={onAddSubCategory} />
      ))}
    </div>
  );
};

export default CategoryTree;
