// utils/cartStorage.ts

// utils/cartStorage.ts

const CART_STORAGE_KEY = "my_cart_payload";

export const removeItems = ()=>{
  localStorage.removeItem(CART_STORAGE_KEY);
}

// Merge-and-save version
export const mergeAndSaveCart = (newItems: any[]) => {
  if (typeof window === "undefined") return;

  const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");

  // Only include new items with positive quantity
  const filteredNewItems = newItems.filter((item) => item.quantity > 0);

  // Always add as new entries
  const updatedCart = [...stored, ...filteredNewItems];

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
};






// Load cart payload from localStorage
export const loadCartFromStorage = (): any[] => {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(CART_STORAGE_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse cart data from localStorage", error);
    return [];
  }
};



export const removeVariantFromCart = (variantId: string) => {
  mergeAndSaveCart([{ variantId, quantity: 0 }]);
};
