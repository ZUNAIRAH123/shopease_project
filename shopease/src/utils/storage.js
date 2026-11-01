// Helper functions for reading and writing localStorage.
// localStorage only stores text, so we convert data with JSON.

// All the keys used by the app, in one place.
export const STORAGE_KEYS = {
  users: "shopease_users",
  currentUser: "shopease_current_user",
  products: "shopease_products",
  cart: "shopease_cart",
  orders: "shopease_orders",
};

// Read a value. If nothing is saved (or the data is broken), return defaultValue.
export function loadFromStorage(key, defaultValue) {
  try {
    const savedText = localStorage.getItem(key);
    if (savedText === null) {
      return defaultValue;
    }
    return JSON.parse(savedText);
  } catch (error) {
    console.error("Could not read from localStorage:", key, error);
    return defaultValue;
  }
}

// Save a value (object, array, string, number...).
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Could not save to localStorage:", key, error);
  }
}

// Delete a saved value.
export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Could not remove from localStorage:", key, error);
  }
}
