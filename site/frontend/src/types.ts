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

export interface Address {
  _id: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}