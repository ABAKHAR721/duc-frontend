export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  displayOrder: number;
  parentId?: string;
  parent?: Category;
  _count?: {
    items: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TreeCategory extends Category {
  children: TreeCategory[];
}
