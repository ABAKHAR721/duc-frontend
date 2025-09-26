export const itemOptionsData = {
  ALLERGENES: [
    "Arachide",
    "Céréales contenant du gluten",
    "Lait",
    "Œuf",
    "Fruits à coque",
    "Poisson",
    "Crustacés",
    "Mollusques",
    "Soja",
    "Sésame",
    "Moutarde",
    "Céleri",
    "Lupin",
    "Sulfites",
  ],
  VEGETARIENNE: ["Oui", "Non"],
  BASE: ["Tomate", "Crème"],
};

export type OptionType = keyof typeof itemOptionsData;

export const optionTypes = Object.keys(itemOptionsData) as OptionType[];
