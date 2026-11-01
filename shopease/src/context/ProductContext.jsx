import { createContext, useContext, useEffect, useState } from "react";
import { initialProducts } from "../data/products";
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from "../utils/storage";

// Holds all products. Admin changes are saved to localStorage,
// so they stay after refreshing and show up on the storefront straight away.

const ProductContext = createContext();

// Use the saved products if they exist, otherwise use the sample data.
function getInitialProducts() {
  const savedProducts = loadFromStorage(STORAGE_KEYS.products, null);
  if (savedProducts === null) {
    return initialProducts;
  }
  return savedProducts;
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(getInitialProducts);
  // Small "loading" flag so pages can show a spinner when the app first opens.
  // (The data itself is already available, this just gives a smooth first load.)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.products, products);
  }, [products]);

  function getProductById(id) {
    for (const product of products) {
      if (product.id === Number(id)) {
        return product;
      }
    }
    return null;
  }

  function addProduct(productData) {
    // New id = highest existing id + 1
    let highestId = 0;
    for (const product of products) {
      if (product.id > highestId) {
        highestId = product.id;
      }
    }

    const newProduct = {
      id: highestId + 1,
      name: productData.name.trim(),
      price: Number(productData.price),
      category: productData.category.trim(),
      description: productData.description.trim(),
      image: productData.image.trim(),
      stock: Number(productData.stock),
      createdAt: new Date().toISOString(),
    };
    setProducts([...products, newProduct]);
  }

  function updateProduct(id, productData) {
    const updatedList = products.map((product) => {
      if (product.id !== id) {
        return product;
      }
      return {
        ...product,
        name: productData.name.trim(),
        price: Number(productData.price),
        category: productData.category.trim(),
        description: productData.description.trim(),
        image: productData.image.trim(),
        stock: Number(productData.stock),
      };
    });
    setProducts(updatedList);
  }

  function deleteProduct(id) {
    setProducts(products.filter((product) => product.id !== id));
  }

  // Called when an order is placed: lowers the stock of each ordered product.
  // items looks like [{ productId: 1, quantity: 2 }, ...]
  function reduceStock(items) {
    const updatedList = products.map((product) => {
      for (const item of items) {
        if (item.productId === product.id) {
          const newStock = Math.max(0, product.stock - item.quantity);
          return { ...product, stock: newStock };
        }
      }
      return product;
    });
    setProducts(updatedList);
  }

  // Called when an order is cancelled: puts the stock back.
  function restoreStock(items) {
    const updatedList = products.map((product) => {
      for (const item of items) {
        if (item.productId === product.id) {
          return { ...product, stock: product.stock + item.quantity };
        }
      }
      return product;
    });
    setProducts(updatedList);
  }

  // Unique list of category names, e.g. ["Electronics", "Fashion"]
  const categories = [];
  for (const product of products) {
    if (!categories.includes(product.category)) {
      categories.push(product.category);
    }
  }

  const value = {
    products,
    categories,
    loading,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    reduceStock,
    restoreStock,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  return useContext(ProductContext);
}
