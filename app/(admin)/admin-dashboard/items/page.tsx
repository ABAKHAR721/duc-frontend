"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { itemsService } from "@/services/itemsService";
import { categoriesService } from "@/services/categoriesService";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Package, Euro, Folder, Plus, Trash2, Image, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { itemOptionsData, optionTypes, OptionType } from "@/lib/itemOptionsData";

// #region Interfaces
interface Category {
  id: string;
  name: string;
}

interface ItemVariant {
  id?: string;
  variantName: string;
  price: number;
  sku?: string;
}

interface ItemImage {
  id?: string;
  imageUrl: string;
  isDefault: boolean;
  file?: File;
}
// optionValue will store a JSON string of the selected value(s)
// For ALLERGENES: '["Lait", "Soja"]'
// For VEGETARIENNE or BASE: '"Oui"' or '"Tomate"'
interface ItemOption {
  id?: string;
  optionType: OptionType;
  optionValue: string; 
}

interface Item {
  id: string;
  name: string;
  description?: string;
  status: string;
  categoryId: string;
  category?: Category;
  variants: ItemVariant[];
  images: ItemImage[];
  options: ItemOption[];
  createdAt: string;
  updatedAt: string;
}

interface ItemFormData {
  name: string;
  description: string;
  categoryId: string;
  status: string;
  variants: ItemVariant[];
  images: ItemImage[];
  options: ItemOption[];
}
// #endregion

export default function ItemsPageClient() {
  // #region State Management
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [formData, setFormData] = useState<ItemFormData>({
    name: "",
    description: "",
    categoryId: "",
    status: "Active",
    variants: [{ variantName: "29cm", price: 0, sku: "" }],
    images: [{ imageUrl: "", isDefault: true }],
    options: [],
  });

  const { toast } = useToast();
  // #endregion

  // #region Data Fetching
  const fetchData = useCallback(async () => {
    try {
      const [itemsData, categoriesData] = await Promise.all([
        itemsService.getAll(),
        categoriesService.getAll(),
      ]);
      setItems(itemsData);
      setCategories(categoriesData);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  // #endregion

  // #region Event Handlers (CRUD)
  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      categoryId: "",
      status: "Active",
      variants: [{ variantName: "29cm", price: 0, sku: "" }],
      images: [{ imageUrl: "", isDefault: true }],
      options: [],
    });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      categoryId: item.categoryId,
      status: item.status,
      variants: item.variants.length > 0 ? item.variants : [{ variantName: "Standard", price: 0, sku: "" }],
      images: item.images.length > 0 ? item.images : [{ imageUrl: "", isDefault: true }],
      options: item.options || [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item: Item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const processedImages = await Promise.all(
        formData.images.map(async (image) => {
          if (image.file) {
            const uploadedUrl = await uploadFile(image.file);
            return { ...image, imageUrl: uploadedUrl, file: undefined };
          }
          return image;
        })
      );

      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        categoryId: formData.categoryId,
        status: formData.status,
        variants: formData.variants
          .filter(v => v.variantName && v.price > 0)
          .map(v => ({ 
            variantName: v.variantName,
            price: Number(v.price),
            sku: v.sku
          })), // Sanitize variants to only include expected fields
        images: processedImages
          .filter(img => img.imageUrl)
          .map(image => ({ imageUrl: image.imageUrl, isDefault: image.isDefault })),
        options: formData.options
          .filter(opt => opt.optionType && opt.optionValue)
          .map(option => {
            const parsedValue = JSON.parse(option.optionValue);
            return {
              optionType: option.optionType,
              optionValue: parsedValue  // Keep as array for ALLERGENES, single value for others
            };
          })
      };

      if (editingItem) {
        await itemsService.update(editingItem.id, payload);
        toast({ title: "Succès", description: "Article mis à jour avec succès" });
      } else {
        await itemsService.create(payload);
        toast({ title: "Succès", description: "Article créé avec succès" });
      }
      
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await itemsService.delete(itemToDelete.id);
      toast({ title: "Succès", description: "Article supprimé avec succès" });
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      fetchData();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Erreur lors de la suppression",
        variant: "destructive",
      });
    }
  };
  // #endregion

  // #region Form Input Handlers
  const handleInputChange = (field: keyof Omit<ItemFormData, 'variants' | 'images' | 'options'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Variant Handlers
  const addVariant = () => setFormData(prev => ({ ...prev, variants: [...prev.variants, { variantName: "", price: 0, sku: "" }] }));
  const removeVariant = (index: number) => setFormData(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  const updateVariant = (index: number, field: keyof ItemVariant, value: any) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => i === index ? { ...v, [field]: value } : v)
    }));
  };

  // Image Handlers
  const addImage = () => setFormData(prev => ({ ...prev, images: [...prev.images, { imageUrl: "", isDefault: false }] }));
  const removeImage = (index: number) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  const updateImage = (index: number, field: keyof ItemImage, value: any) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? { ...img, [field]: value } : img)
    }));
  };

  const handleFileUpload = (index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      updateImage(index, 'imageUrl', e.target?.result as string);
      updateImage(index, 'file', file);
    };
    reader.readAsDataURL(file);
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();
    return data.url;
  };

  // New Option Handlers
  const addOption = (optionType: OptionType) => {
    const defaultValue = (optionType === 'ALLERGENES' || optionType === 'BASE') ? JSON.stringify([]) : JSON.stringify(null);
    setFormData(prev => ({ ...prev, options: [...prev.options, { optionType, optionValue: defaultValue }] }));
  };

  const removeOption = (optionType: OptionType) => {
    setFormData(prev => ({ ...prev, options: prev.options.filter(opt => opt.optionType !== optionType) }));
  };

  const updateOptionValue = (optionType: OptionType, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(opt => opt.optionType === optionType ? { ...opt, optionValue: JSON.stringify(value) } : opt)
    }));
  };

  const updateCheckboxValue = (optionType: OptionType, value: string, isChecked: boolean) => {
    setFormData(prev => {
      const newOptions = prev.options.map(opt => {
        if (opt.optionType === optionType) {
          const currentValues: string[] = JSON.parse(opt.optionValue) || [];
          const newValues = isChecked
            ? [...currentValues, value]
            : currentValues.filter(v => v !== value);
          return { ...opt, optionValue: JSON.stringify(newValues) };
        }
        return opt;
      });
      return { ...prev, options: newOptions };
    });
  };
  // #endregion

  // #region Render Helpers
  const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);

  const getMainPrice = (item: Item) => {
    if (!item.variants || item.variants.length === 0) return "N/A";
    const prices = item.variants.map(v => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return minPrice === maxPrice ? formatPrice(minPrice) : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  };

  const getMainImage = (item: Item) => {
    const defaultImage = item.images?.find(img => img.isDefault);
    return defaultImage?.imageUrl || item.images?.[0]?.imageUrl;
  };

  const renderOptionInput = (option: ItemOption) => {
    const { optionType, optionValue } = option;
    const values = itemOptionsData[optionType];

    switch (optionType) {
      case 'ALLERGENES':
      case 'BASE':
        const selectedValues: string[] = JSON.parse(optionValue) || [];
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {values.map(value => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${optionType}-${value}`}
                  checked={selectedValues.includes(value)}
                  onCheckedChange={(checked) => updateCheckboxValue(optionType, value, !!checked)}
                />
                <Label htmlFor={`${optionType}-${value}`} className="text-sm font-normal">{value}</Label>
              </div>
            ))}
          </div>
        );
      case 'VEGETARIENNE':
        const selectedValue = JSON.parse(optionValue);
        return (
          <div className="flex items-center space-x-4 mt-2">
            {values.map(val => (
              <div key={val} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${optionType}-${val}`}
                  name={optionType}
                  value={val}
                  checked={selectedValue === val}
                  onChange={(e) => updateOptionValue(optionType, e.target.value)}
                  className="form-radio h-4 w-4 text-green-600"
                />
                <Label htmlFor={`${optionType}-${val}`} className="text-sm font-normal">{val}</Label>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };
  // #endregion

  // #region Columns Definition
  const columns = [
    {
      key: 'name' as keyof Item,
      header: 'Nom',
      render: (value: unknown, item: Item) => (
        <div className="flex items-center space-x-3">
          {getMainImage(item) ? (
            <img src={getMainImage(item)} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
          ) : (
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <div className="font-medium">{item.name}</div>
        </div>
      ),
    },
    {
      key: 'category' as keyof Item,
      header: 'Catégorie',
      render: (value: unknown, item: Item) => (
        <div className="flex items-center space-x-2">
          <Folder className="h-4 w-4 text-gray-500" />
          <span>{item.category?.name || 'Non catégorisé'}</span>
        </div>
      ),
    },
    {
      key: 'variants' as keyof Item,
      header: 'Détails',
      render: (value: unknown, item: Item) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Euro className="h-4 w-4 text-gray-500" />
            <span className="font-medium text-sm">{getMainPrice(item)}</span>
          </div>
          <div className="text-xs text-gray-500">
            {`${item.variants?.length || 0} variante(s) • ${item.images?.length || 0} image(s) • ${item.options?.length || 0} option(s)`}
          </div>
        </div>
      ),
    },
    {
      key: 'status' as keyof Item,
      header: 'Statut',
      render: (value: unknown) => {
        const status = value as string;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {status === 'Active' ? 'Actif' : 'Inactif'}
          </span>
        );
      },
    },
  ];
  // #endregion

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Package className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Articles</h1>
          <p className="text-gray-600">Gérez votre catalogue de produits avec variantes et options</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">{items.length} article{items.length !== 1 ? 's' : ''} au total</div>
        <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
          <Package className="h-4 w-4 mr-2" />
          Ajouter un article
        </Button>
      </div>

      {/* Data Table */}
      <DataTable
        data={items}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        emptyMessage="Aucun article trouvé"
      />

      {/* Add/Edit Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? "Modifier l'article" : "Ajouter un article"}
        onSubmit={handleSubmit}
        isLoading={isSaving}
        maxWidth="2xl"
      >
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'article</Label>
              <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="Ex: Pizza Margherita" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Catégorie</Label>
              <select id="categoryId" value={formData.categoryId || ""} onChange={(e) => handleInputChange("categoryId", e.target.value)} className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm" required>
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <select id="status" value={formData.status} onChange={(e) => handleInputChange("status", e.target.value)} className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm">
                <option value="Active">Actif</option>
                <option value="Inactive">Inactif</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea id="description" className="w-full min-h-[100px] px-3 py-2 border border-input bg-background rounded-md text-sm" value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} placeholder="Description de l'article" />
            </div>
          </div>

          {/* Variants Section */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Variantes</h3>
              <Button type="button" onClick={addVariant} size="sm" variant="outline"><Plus className="h-4 w-4 mr-2" />Ajouter</Button>
            </div>
            <div className="space-y-3">
              {formData.variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  <div className="space-y-1"><Label>Nom</Label><Input value={variant.variantName} onChange={(e) => updateVariant(index, "variantName", e.target.value)} placeholder="Ex: 33cm" /></div>
                  <div className="space-y-1"><Label>Prix (€)</Label><Input type="number" step="0.01" min="0" value={variant.price} onChange={(e) => updateVariant(index, "price", parseFloat(e.target.value) || 0)} placeholder="12.50" /></div>
                  <div className="space-y-1"><Label>SKU</Label><Input value={variant.sku || ""} onChange={(e) => updateVariant(index, "sku", e.target.value)} placeholder="P-MAR-S" /></div>
                  {formData.variants.length > 1 && <Button type="button" onClick={() => removeVariant(index)} size="icon" variant="destructive"><Trash2 className="h-4 w-4" /></Button>}
                </div>
              ))}
            </div>
          </div>

          {/* Options Section (New) */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="text-lg font-medium">Options</h3>
            <div className="space-y-4">
              {optionTypes.map(optType => {
                const existingOption = formData.options.find(o => o.optionType === optType);
                return (
                  <div key={optType} className="p-3 border rounded-md">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold">{optType}</Label>
                      {existingOption ? (
                        <Button type="button" size="sm" variant="ghost" className="text-red-500" onClick={() => removeOption(optType)}><Trash2 className="h-4 w-4 mr-1"/>Retirer</Button>
                      ) : (
                        <Button type="button" size="sm" variant="outline" onClick={() => addOption(optType)}><Plus className="h-4 w-4 mr-1"/>Ajouter</Button>
                      )}
                    </div>
                    {existingOption && <div className="mt-2">{renderOptionInput(existingOption)}</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Images</h3>
              <Button type="button" onClick={addImage} size="sm" variant="outline"><Image className="h-4 w-4 mr-2" />Ajouter</Button>
            </div>
            <div className="space-y-3">
              {formData.images.map((image, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center p-3 border rounded-lg">
                  <div className="space-y-2 col-span-2">
                    <Label>URL de l'image ou Télécharger</Label>
                    <div className="flex items-center space-x-2">
                      <Input type="url" value={image.imageUrl} onChange={(e) => updateImage(index, "imageUrl", e.target.value)} placeholder="https://..." className="flex-1" />
                      <div className="relative"><input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileUpload(index, e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /><Button type="button" asChild variant="outline" size="icon"><Upload className="h-4 w-4" /></Button></div>
                    </div>
                    {image.imageUrl && <img src={image.imageUrl} alt="Preview" className="w-16 h-16 object-cover rounded mt-2" />}
                  </div>
                  <div className="flex flex-col items-start justify-between h-full">
                    <div className="flex items-center space-x-2"><Checkbox id={`isDefault-${index}`} checked={image.isDefault} onCheckedChange={(checked) => updateImage(index, "isDefault", !!checked)} /><Label htmlFor={`isDefault-${index}`}>Par défaut</Label></div>
                    {formData.images.length > 1 && <Button type="button" onClick={() => removeImage(index)} size="sm" variant="destructive" className="mt-2"><Trash2 className="h-4 w-4" /></Button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FormModal>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirmer la suppression</DialogTitle></DialogHeader>
          <p>Êtes-vous sûr de vouloir supprimer l'article "{itemToDelete?.name}"? Cette action est irréversible.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={confirmDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
