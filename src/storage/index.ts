import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, Folder, Category, Supermarket } from '../types';

const STORAGE_KEYS = {
  PRODUCTS: '@products',
  FOLDERS: '@folders',
  CATEGORIES: '@categories',
  SUPERMARKETS: '@supermarkets',
};

// Generic helpers
async function getData<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error reading data:', e);
    return null;
  }
}

async function setData<T>(key: string, value: T): Promise<boolean> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (e) {
    console.error('Error saving data:', e);
    return false;
  }
}

// Products
export async function getProducts(): Promise<Product[]> {
  const data = await getData<Product[]>(STORAGE_KEYS.PRODUCTS);
  return data || [];
}

export async function saveProducts(products: Product[]): Promise<boolean> {
  return setData(STORAGE_KEYS.PRODUCTS, products);
}

export async function addProduct(product: Product): Promise<boolean> {
  const products = await getProducts();
  products.push(product);
  return saveProducts(products);
}

export async function updateProduct(product: Product): Promise<boolean> {
  const products = await getProducts();
  const index = products.findIndex(p => p.id === product.id);
  if (index !== -1) {
    products[index] = product;
    return saveProducts(products);
  }
  return false;
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const products = await getProducts();
  const filtered = products.filter(p => p.id !== productId);
  return saveProducts(filtered);
}

// Folders
export async function getFolders(): Promise<Folder[]> {
  const data = await getData<Folder[]>(STORAGE_KEYS.FOLDERS);
  return data || [];
}

export async function saveFolders(folders: Folder[]): Promise<boolean> {
  return setData(STORAGE_KEYS.FOLDERS, folders);
}

export async function addFolder(folder: Folder): Promise<boolean> {
  const folders = await getFolders();
  folders.push(folder);
  return saveFolders(folders);
}

export async function updateFolder(folder: Folder): Promise<boolean> {
  const folders = await getFolders();
  const index = folders.findIndex(f => f.id === folder.id);
  if (index !== -1) {
    folders[index] = folder;
    return saveFolders(folders);
  }
  return false;
}

export async function deleteFolder(folderId: string): Promise<boolean> {
  const folders = await getFolders();
  const filtered = folders.filter(f => f.id !== folderId);
  return saveFolders(filtered);
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const data = await getData<Category[]>(STORAGE_KEYS.CATEGORIES);
  return data || [];
}

export async function saveCategories(categories: Category[]): Promise<boolean> {
  return setData(STORAGE_KEYS.CATEGORIES, categories);
}

// Supermarkets
export async function getSupermarkets(): Promise<Supermarket[]> {
  const data = await getData<Supermarket[]>(STORAGE_KEYS.SUPERMARKETS);
  return data || [];
}

export async function saveSupermarkets(supermarkets: Supermarket[]): Promise<boolean> {
  return setData(STORAGE_KEYS.SUPERMARKETS, supermarkets);
}

export async function addSupermarket(supermarket: Supermarket): Promise<boolean> {
  const supermarkets = await getSupermarkets();
  supermarkets.push(supermarket);
  return saveSupermarkets(supermarkets);
}

// Utility functions
export function generateId(): string {
  // Use crypto.randomUUID() if available, fallback to a more robust method
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback: use Date.now() with random bytes for better uniqueness
  const randomPart = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('');
  return Date.now().toString(36) + '-' + randomPart;
}

export async function initializeDefaultCategories(): Promise<void> {
  const categories = await getCategories();
  if (categories.length === 0) {
    const defaultCategories: Category[] = [
      { id: '1', name: 'Groceries', icon: '🛒' },
      { id: '2', name: 'Beverages', icon: '🥤' },
      { id: '3', name: 'Snacks', icon: '🍿' },
      { id: '4', name: 'Dairy', icon: '🥛' },
      { id: '5', name: 'Meat', icon: '🥩' },
      { id: '6', name: 'Fruits', icon: '🍎' },
      { id: '7', name: 'Vegetables', icon: '🥬' },
      { id: '8', name: 'Household', icon: '🏠' },
    ];
    await saveCategories(defaultCategories);
  }
}
