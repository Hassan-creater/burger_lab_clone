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

  const filteredNewItems = newItems.filter((item) => item.quantity > 0);

  const isSameAddonOrExtra = (a: any[], b: any[]) => {
    if (a.length !== b.length) return false;
    const sortById = (arr: any[]) => arr.slice().sort((x, y) => x.id.localeCompare(y.id));
    const strippedA = sortById(a).map(({ id, name, price }) => ({ id, name, price }));
    const strippedB = sortById(b).map(({ id, name, price }) => ({ id, name, price }));
    return JSON.stringify(strippedA) === JSON.stringify(strippedB);
  };

  const isSameCartItem = (a: any, b: any) => {
    return (
      a.variantId === b.variantId &&
      a.variantName === b.variantName &&
      a.variantPrice === b.variantPrice &&
      a.itemImage === b.itemImage &&
      isSameAddonOrExtra(a.addons, b.addons) &&
      isSameAddonOrExtra(a.extras, b.extras)
    );
  };

  let updatedCart = [...stored];

  for (const newItem of filteredNewItems) {
    const existingIndex = updatedCart.findIndex((item) => isSameCartItem(item, newItem));

    if (existingIndex !== -1) {
      const existingItem = updatedCart[existingIndex];
      const combinedQuantity = existingItem.quantity + newItem.quantity;

      // Combine addons quantities if they match by id
      const combinedAddons = existingItem.addons.map((oldAddon: any) => {
        const match = newItem.addons.find((na: any) => na.id === oldAddon.id);
        return {
          ...oldAddon,
          quantity: oldAddon.quantity + (match?.quantity || 0),
        };
      });

      const combinedExtras = existingItem.extras.map((oldExtra: any) => {
        const match = newItem.extras.find((na: any) => na.id === oldExtra.id);
        return {
          ...oldExtra,
          quantity: oldExtra.quantity + (match?.quantity || 0),
        };
      });

      updatedCart[existingIndex] = {
        ...existingItem,
        quantity: combinedQuantity,
        addons: combinedAddons,
        extras: combinedExtras,
        totalPrice: combinedQuantity * newItem.variantPrice + combinedAddons.reduce((sum: number, a: any) => sum + a.price * a.quantity, 0) + combinedExtras.reduce((sum: number, a: any) => sum + a.price * a.quantity, 0),
      };
    } else {
      updatedCart.push(newItem);
    }
  }

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


const isSameCartItem = (a: any, b: any) => {
  const compareAddons = (a1: any[], a2: any[]) => {
    if (a1.length !== a2.length) return false;
    const sortedA = [...a1].sort((x, y) => x.id.localeCompare(y.id));
    const sortedB = [...a2].sort((x, y) => x.id.localeCompare(y.id));
    return sortedA.every((addon, i) =>
      addon.id === sortedB[i].id &&
      addon.name === sortedB[i].name &&
      addon.price === sortedB[i].price &&
      addon.quantity === sortedB[i].quantity // ← keep quantity here
    );
  };

  const compareExtras = compareAddons; // same logic

  return (
    a.variantId === b.variantId &&
    a.variantName === b.variantName &&
    a.variantPrice === b.variantPrice &&
    a.itemImage === b.itemImage &&
    a.quantity === b.quantity && // ← include this
    compareAddons(a.addons, b.addons) &&
    compareExtras(a.extras, b.extras)
  );
};


export const removeCartItem = (itemToRemove: any) => {
  if (typeof window === "undefined") return;

  const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");

  const updatedCart = stored.filter((item: any) => !isSameCartItem(item, itemToRemove));

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
};

export const removeVariantFromCart = (variantId: string) => {
   
};
