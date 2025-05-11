// types.ts
export interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory: string;
  images: string[];
  sizes: string[]
}

export interface Category {
  _id: string;
  name: string;
  subcategories: string[];
}
