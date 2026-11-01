import { createContext, useContext, useEffect, useState } from "react";
import { useProducts } from "./ProductContext";
import { STORAGE_KEYS, loadFromStorage, saveToStorage } from "../utils/storage";
import { calculateShipping, roundMoney } from "../utils/format";

// The shopping cart.
// In localStorage we only save [{ productId, quantity }].
// The full product details are looked up from ProductContext, so the cart
// always shows the latest price and stock.

const CartContext = createContext();

export function CartProvider({ children }) {
  const { getProductById } = useProducts();
  const [cart, setCart] = useState(() => loadFromStorage(STORAGE_KEYS.cart, []));

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.cart, cart);
  }, [cart]);

  // Build the list shown on the cart page: [{ product, quantity }]
  const cartItems = [];
  for (const item of cart) {
    const product = getProductById(item.productId);
    if (product === null) {
      continue; // product was deleted by the admin
    }
    // Never show more than what is in stock
    const quantity = Math.min(item.quantity, product.stock);
    if (quantity < 1) {
      continue; // sold out
    }
    cartItems.push({ product: product, quantity: quantity });
  }

  let cartCount = 0;
  let subtotal = 0;
  for (const item of cartItems) {
    cartCount = cartCount + item.quantity;
    subtotal = subtotal + item.product.price * item.quantity;
  }
  subtotal = roundMoney(subtotal);
  const shipping = calculateShipping(subtotal);
  const total = roundMoney(subtotal + shipping);

  function getQuantityInCart(productId) {
    for (const item of cart) {
      if (item.productId === productId) {
        return item.quantity;
      }
    }
    return 0;
  }

  // Returns { success, message } so pages can show a toast.
  function addToCart(productId, quantity) {
    const product = getProductById(productId);
    if (product === null) {
      return { success: false, message: "Product not found" };
    }
    if (product.stock === 0) {
      return { success: false, message: "Sorry, this product is out of stock" };
    }

    const currentQuantity = getQuantityInCart(productId);
    const newQuantity = currentQuantity + quantity;

    if (newQuantity > product.stock) {
      return {
        success: false,
        message: "Only " + product.stock + " in stock (you already have " + currentQuantity + " in your cart)",
      };
    }

    if (currentQuantity === 0) {
      setCart([...cart, { productId: productId, quantity: quantity }]);
    } else {
      const updatedCart = cart.map((item) => {
        if (item.productId === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCart(updatedCart);
    }
    return { success: true, message: product.name + " added to cart" };
  }

  // Set an exact quantity (used by the + and - buttons in the cart)
  function updateQuantity(productId, newQuantity) {
    const product = getProductById(productId);
    if (product === null || newQuantity < 1) {
      return { success: false, message: "Invalid quantity" };
    }
    if (newQuantity > product.stock) {
      return { success: false, message: "Only " + product.stock + " in stock" };
    }

    const updatedCart = cart.map((item) => {
      if (item.productId === productId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
    return { success: true, message: "Cart updated" };
  }

  function removeFromCart(productId) {
    setCart(cart.filter((item) => item.productId !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  const value = {
    cartItems,
    cartCount,
    subtotal,
    shipping,
    total,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
