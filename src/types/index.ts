// Core data models for the Supermarket Price Compare app

export interface Product {
  id: string;
  name: string;
  price: number;
  supermarketId: string;
  categoryId: string;
  websiteUrl?: string;
  imageUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  productIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface Supermarket {
  id: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  websiteUrl?: string;
  distance?: number;
}

export interface Location {
  latitude: number;
  longitude: number;
}
