
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  seller: {
    id: string;
    username: string;
  };
  createdAt: string;
}

export type ProductCategory = 
  | "clothing"
  | "electronics"
  | "furniture"
  | "books"
  | "toys"
  | "sports"
  | "home"
  | "garden"
  | "other";

export const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "clothing", label: "Clothing" },
  { value: "electronics", label: "Electronics" },
  { value: "furniture", label: "Furniture" },
  { value: "books", label: "Books" },
  { value: "toys", label: "Toys" },
  { value: "sports", label: "Sports & Outdoors" },
  { value: "home", label: "Home Goods" },
  { value: "garden", label: "Garden" },
  { value: "other", label: "Other" }
];

// Mock data for demonstration
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Vintage Denim Jacket",
    description: "Pre-loved denim jacket in excellent condition. Perfect for layering in any season!",
    price: 35.99,
    category: "clothing",
    image: "/placeholder.svg",
    seller: { id: "1", username: "ecofriend" },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "2",
    title: "Refurbished iPhone 11",
    description: "Fully refurbished iPhone 11 with 128GB storage. Comes with charger and protective case.",
    price: 350.00,
    category: "electronics",
    image: "/placeholder.svg",
    seller: { id: "2", username: "techrecycler" },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    title: "Mid-Century Coffee Table",
    description: "Elegant mid-century modern coffee table with minor wear. Solid wood construction.",
    price: 120.50,
    category: "furniture",
    image: "/placeholder.svg",
    seller: { id: "3", username: "vintagehome" },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "4",
    title: "Classic Literature Collection",
    description: "Set of 5 classic novels in good condition including works by Austen, Dickens, and Bronte.",
    price: 25.00,
    category: "books",
    image: "/placeholder.svg",
    seller: { id: "1", username: "ecofriend" },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "5",
    title: "Wooden Building Blocks Set",
    description: "Handcrafted wooden building blocks, perfect for imaginative play. Suitable for ages 3+.",
    price: 18.99,
    category: "toys",
    image: "/placeholder.svg",
    seller: { id: "4", username: "greencrafts" },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "6",
    title: "Yoga Mat",
    description: "Lightly used eco-friendly yoga mat. Non-slip surface, great for all types of yoga.",
    price: 15.00,
    category: "sports",
    image: "/placeholder.svg",
    seller: { id: "5", username: "zenlife" },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export let products = [...MOCK_PRODUCTS];

// Mock function to get user's listings
export const getUserListings = (userId: string): Product[] => {
  return products.filter(product => product.seller.id === userId);
};

// Mock function to get user's purchases
export const getUserPurchases = (userId: string): Product[] => {
  // In a real app, this would come from a purchases table
  // For demo, we'll just return some of the products
  return products.slice(0, 3);
};

// Mock function to get a product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

// Mock function to add a new product
export const addProduct = (product: Omit<Product, "id" | "createdAt">): Product => {
  const newProduct = {
    ...product,
    id: `${products.length + 1}`,
    createdAt: new Date().toISOString()
  };
  products = [...products, newProduct];
  return newProduct;
};

// Mock function to update a product
export const updateProduct = (id: string, updates: Partial<Product>): Product | undefined => {
  const productIndex = products.findIndex(product => product.id === id);
  if (productIndex === -1) return undefined;
  
  const updatedProduct = { ...products[productIndex], ...updates };
  products = [
    ...products.slice(0, productIndex),
    updatedProduct,
    ...products.slice(productIndex + 1)
  ];
  return updatedProduct;
};

// Mock function to delete a product
export const deleteProduct = (id: string): boolean => {
  const initialLength = products.length;
  products = products.filter(product => product.id !== id);
  return products.length < initialLength;
};
