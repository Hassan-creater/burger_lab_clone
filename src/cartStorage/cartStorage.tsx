// utils/cartStorage.ts

// utils/cartStorage.ts

const CART_STORAGE_KEY = "my_cart_payload";
const CART_DEAL_STORAGE_KEY = "deal_paylod";

export const removeItems = ()=>{
  localStorage.removeItem(CART_STORAGE_KEY);
  localStorage.removeItem(CART_DEAL_STORAGE_KEY);
}


export const decreaseQuantity = (newItems: any[]) => {
  if (typeof window === "undefined") return;

  const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");

  const filteredNewItems = newItems.filter((item) => item.quantity > 0);

  const isSameAddonOrExtra = (a: any[], b: any[]) => {
    if (a.length !== b.length) return false;
    const sortById = (arr: any[]) => arr.slice().sort((x, y) => x.id.localeCompare(y.id));
    const strippedA = sortById(a).map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));
    const strippedB = sortById(b).map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));
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
      const newQuantity = existingItem.quantity - 1;
      // Do NOT decrease addon or extra quantities
      if (newQuantity <= 0) {
        updatedCart.splice(existingIndex, 1);
      } else {
        updatedCart[existingIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice:
            newQuantity * existingItem.variantPrice +
            (existingItem.addons?.reduce((sum: number, a: any) => sum + a.price * a.quantity, 0) || 0) +
            (existingItem.extras?.reduce((sum: number, a: any) => sum + a.price * a.quantity, 0) || 0),
        };
      }
    }
    // ⚠️ Don't add unmatched newItems — because this is decrease logic
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
};

export const increaseQuantity = (newItems: any[]) => {
  if (typeof window === "undefined") return;

  const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");

  const filteredNewItems = newItems.filter((item) => item.quantity > 0);

  const isSameAddonOrExtra = (a: any[], b: any[]) => {
    if (a.length !== b.length) return false;
    const sortById = (arr: any[]) => arr.slice().sort((x, y) => x.id.localeCompare(y.id));
    const strippedA = sortById(a).map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));
    const strippedB = sortById(b).map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));
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
      const newQuantity = existingItem.quantity + 1;
      // Do NOT increase addon or extra quantities
      updatedCart[existingIndex] = {
        ...existingItem,
        quantity: newQuantity,
        totalPrice:
          newQuantity * existingItem.variantPrice +
          (existingItem.addons?.reduce((sum: number, a: any) => sum + a.price * a.quantity, 0) || 0) +
          (existingItem.extras?.reduce((sum: number, a: any) => sum + a.price * a.quantity, 0) || 0),
      };
    } else {
      updatedCart.push(newItem);
    }
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
};




// Merge-and-save version
export const mergeAndSaveCart = (newItems: any[]) => {
  if (typeof window === "undefined") return;

  const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");

  const filteredNewItems = newItems.filter((item) => item.quantity > 0);

  const isSameAddonOrExtraWithQty = (a: any[], b: any[]) => {
    if (a.length !== b.length) return false;
    const sortById = (arr: any[]) => arr.slice().sort((x, y) => x.id.localeCompare(y.id));
    const strippedA = sortById(a).map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));
    const strippedB = sortById(b).map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));
    return JSON.stringify(strippedA) === JSON.stringify(strippedB);
  };

  const isSameCartItemWithQty = (a: any, b: any) => {
    return (
      a.variantId === b.variantId &&
      a.variantName === b.variantName &&
      a.variantPrice === b.variantPrice &&
      a.itemImage === b.itemImage &&
      a.quantity === b.quantity &&
      isSameAddonOrExtraWithQty(a.addons, b.addons) &&
      isSameAddonOrExtraWithQty(a.extras, b.extras)
    );
  };

  let updatedCart = [...stored];

  for (const newItem of filteredNewItems) {
    const existingIndex = updatedCart.findIndex((item) => isSameCartItemWithQty(item, newItem));

    if (existingIndex !== -1) {
      const existingItem = updatedCart[existingIndex];
      const combinedQuantity = existingItem.quantity + newItem.quantity;

      // Combine addons quantities if they match by id and quantity
      const combinedAddons = existingItem.addons.map((oldAddon: any) => {
        const match = newItem.addons.find((na: any) => na.id === oldAddon.id && na.quantity === oldAddon.quantity);
        return match
          ? { ...oldAddon, quantity: oldAddon.quantity + (match?.quantity || 0) }
          : oldAddon;
      });

      const combinedExtras = existingItem.extras.map((oldExtra: any) => {
        const match = newItem.extras.find((na: any) => na.id === oldExtra.id && na.quantity === oldExtra.quantity);
        return match
          ? { ...oldExtra, quantity: oldExtra.quantity + (match?.quantity || 0) }
          : oldExtra;
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



export const loadDealFromStorage = (): any[] => {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem(CART_DEAL_STORAGE_KEY);
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







export const removeDealItem = (itemToRemove: any) => {
  if (typeof window === "undefined") return;

  const stored = JSON.parse(localStorage.getItem(CART_DEAL_STORAGE_KEY) || "[]");

  const updatedCart = stored.filter((item: any) => !isSameDealCartItem(item, itemToRemove));

  localStorage.setItem(CART_DEAL_STORAGE_KEY, JSON.stringify(updatedCart));
};






export const removeVariantFromCart = (variantId: string) => {
   
};

// Save the custom deal cart data structure to localStorage
export const saveDealCartData = (dealCartData: any) => {
  if (typeof window === "undefined") return;
  const CART_DEAL_STORAGE_KEY = "deal_paylod";
  // If passed an empty array, clear storage
  if (Array.isArray(dealCartData) && dealCartData.length === 0) {
    localStorage.removeItem(CART_DEAL_STORAGE_KEY);
    return;
  }
  // If passed an array, store it directly (replace all)
  if (Array.isArray(dealCartData)) {
    localStorage.setItem(CART_DEAL_STORAGE_KEY, JSON.stringify(dealCartData));
    return;
  }
  // Otherwise, add a single deal (legacy behavior)
  const existing = localStorage.getItem(CART_DEAL_STORAGE_KEY);
  let arr = [];
  if (existing) {
    try {
      arr = JSON.parse(existing);
      if (!Array.isArray(arr)) arr = [];
    } catch {
      arr = [];
    }
  }
  // Check for duplicate by dealId AND identical addons/extras (with quantity)
  const isDuplicate = arr.some((item: any) =>
    item.dealId === dealCartData.dealId &&
    isSameAddonOrExtraWithQty(item.addons || [], dealCartData.addons || []) &&
    isSameAddonOrExtraWithQty(item.extras || [], dealCartData.extras || [])
  );
  if (!isDuplicate) {
    arr.push(dealCartData);
  }
  localStorage.setItem(CART_DEAL_STORAGE_KEY, JSON.stringify(arr));
};

// Helper for deep compare of addons/extras arrays (including quantity)
const isSameAddonOrExtraWithQty = (a: any[], b: any[]) => {
  if (a.length !== b.length) return false;
  const sortById = (arr: any[]) => arr.slice().sort((x, y) => x.id.localeCompare(y.id));
  const strippedA = sortById(a).map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));
  const strippedB = sortById(b).map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));
  return JSON.stringify(strippedA) === JSON.stringify(strippedB);
};

// Helper for deal comparison
const isSameDealCartItem = (a: any, b: any) => {
  return (
    a.dealId === b.dealId &&
    isSameAddonOrExtraWithQty(a.addons, b.addons) &&
    isSameAddonOrExtraWithQty(a.extras, b.extras)
  );
};

export const increaseDealQuantity = (newDeals: any[]) => {
  if (typeof window === "undefined") return;
  const stored = JSON.parse(localStorage.getItem(CART_DEAL_STORAGE_KEY) || "[]");
  let updatedCart = [...stored];

  for (const newDeal of newDeals) {
    const existingIndex = updatedCart.findIndex((item) => isSameDealCartItem(item, newDeal));
    if (existingIndex !== -1) {
      const existingDeal = updatedCart[existingIndex];
      const totalprice = existingDeal.variantTotalPrice;
      const newVariantQuantity = (existingDeal.variantQuantity || 1) + 1;
      const newTotolPrice = existingDeal.totalPrice + totalprice
      updatedCart[existingIndex] = {
        ...existingDeal,
        variantQuantity: newVariantQuantity,
        totalPrice: newTotolPrice,
      };
    } else {
      updatedCart.push({ ...newDeal, variantQuantity: 1 });
    }
  }
  localStorage.setItem(CART_DEAL_STORAGE_KEY, JSON.stringify(updatedCart));
};

export const decreaseDealQuantity = (newDeals: any[]) => {
  if (typeof window === "undefined") return;
  const stored = JSON.parse(localStorage.getItem(CART_DEAL_STORAGE_KEY) || "[]");
  let updatedCart = [...stored];

  for (const newDeal of newDeals) {
    const existingIndex = updatedCart.findIndex((item) => isSameDealCartItem(item, newDeal));
    if (existingIndex !== -1) {
      const existingDeal = updatedCart[existingIndex];
      const newVariantQuantity = (existingDeal.variantQuantity || 1) - 1;
      const totalprice = existingDeal?.variantTotalPrice
      if (newVariantQuantity <= 0) {
        updatedCart.splice(existingIndex, 1);
      } else {
        const newTotolPrice = existingDeal?.totalPrice - totalprice
        updatedCart[existingIndex] = {
          ...existingDeal,
          variantQuantity: newVariantQuantity,
          totalPrice: newTotolPrice,
        };
      }
    }
    // Do not add unmatched newDeals in decrease logic
  }
  localStorage.setItem(CART_DEAL_STORAGE_KEY, JSON.stringify(updatedCart));
};

export const increaseAddonQuantity = (cartItem: any, addonId: string) => {
  if (typeof window === "undefined") return;
  const stored = JSON.parse(localStorage.getItem(CART_DEAL_STORAGE_KEY) || "[]");
  const updatedCart = stored.map((item: any) => {
    if (isSameDealCartItem(item, cartItem)) {
      let addonPrice = 0;
      const newAddons = (item.addons || []).map((addon: any) => {
        if (addon.id === addonId) {
          addonPrice = addon.price || 0;
          return { ...addon, quantity: (addon.quantity || 1) + 1 };
        }
        return addon;
      });
      return {
        ...item,
        addons: newAddons,
        totalPrice: (item.totalPrice || 0) + addonPrice,
      };
    }
    return item;
  });
  localStorage.setItem(CART_DEAL_STORAGE_KEY, JSON.stringify(updatedCart));
};

export const decreaseAddonQuantity = (cartItem: any, addonId: string) => {
  if (typeof window === "undefined") return;
  const stored = JSON.parse(localStorage.getItem(CART_DEAL_STORAGE_KEY) || "[]");
  const updatedCart = stored.map((item: any) => {
    if (isSameDealCartItem(item, cartItem)) {
      let addonPrice = 0;
      let removedAddonPrice = 0;
      let removedAddonQty = 0;
      const newAddons = (item.addons || []).map((addon: any) => {
        if (addon.id === addonId) {
          addonPrice = addon.price || 0;
          const newQty = (addon.quantity || 1) - 1;
          if (newQty > 0) {
            return { ...addon, quantity: newQty };
          } else {
            removedAddonPrice = addon.price || 0;
            removedAddonQty = addon.quantity || 1;
            return null;
          }
        }
        return addon;
      }).filter(Boolean);
      let newTotal = item.totalPrice || 0;
      if (removedAddonPrice && removedAddonQty) {
        newTotal -= removedAddonPrice * removedAddonQty;
      } else {
        newTotal -= addonPrice;
      }
      return {
        ...item,
        addons: newAddons,
        totalPrice: newTotal,
      };
    }
    return item;
  });
  localStorage.setItem(CART_DEAL_STORAGE_KEY, JSON.stringify(updatedCart));
};

export const increaseExtraQuantity = (cartItem: any, extraId: string) => {
  if (typeof window === "undefined") return;
  const stored = JSON.parse(localStorage.getItem(CART_DEAL_STORAGE_KEY) || "[]");
  const updatedCart = stored.map((item: any) => {
    if (isSameDealCartItem(item, cartItem)) {
      let extraPrice = 0;
      const newExtras = (item.extras || []).map((extra: any) => {
        if (extra.id === extraId) {
          extraPrice = extra.price || 0;
          return { ...extra, quantity: (extra.quantity || 1) + 1 };
        }
        return extra;
      });
      return {
        ...item,
        extras: newExtras,
        totalPrice: (item.totalPrice || 0) + extraPrice,
      };
    }
    return item;
  });
  localStorage.setItem(CART_DEAL_STORAGE_KEY, JSON.stringify(updatedCart));
};

export const decreaseExtraQuantity = (cartItem: any, extraId: string) => {
  if (typeof window === "undefined") return;
  const stored = JSON.parse(localStorage.getItem(CART_DEAL_STORAGE_KEY) || "[]");
  const updatedCart = stored.map((item: any) => {
    if (isSameDealCartItem(item, cartItem)) {
      let extraPrice = 0;
      let removedExtraPrice = 0;
      let removedExtraQty = 0;
      const newExtras = (item.extras || []).map((extra: any) => {
        if (extra.id === extraId) {
          extraPrice = extra.price || 0;
          const newQty = (extra.quantity || 1) - 1;
          if (newQty > 0) {
            return { ...extra, quantity: newQty };
          } else {
            removedExtraPrice = extra.price || 0;
            removedExtraQty = extra.quantity || 1;
            return null;
          }
        }
        return extra;
      }).filter(Boolean);
      let newTotal = item.totalPrice || 0;
      if (removedExtraPrice && removedExtraQty) {
        newTotal -= removedExtraPrice * removedExtraQty;
      } else {
        newTotal -= extraPrice;
      }
      return {
        ...item,
        extras: newExtras,
        totalPrice: newTotal,
      };
    }
    return item;
  });
  localStorage.setItem(CART_DEAL_STORAGE_KEY, JSON.stringify(updatedCart));
};

export const increaseItemAddon = (cartItem: any, addonId: string) => {
  if (typeof window === "undefined") return;
  const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");

  // Deep compare full payload including quantities
  const isSameAddonOrExtraWithQty = (a: any[], b: any[]) => {
    if (a.length !== b.length) return false;
    const sortById = (arr: any[]) => arr.slice().sort((x, y) => x.id.localeCompare(y.id));
    const strippedA = sortById(a).map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));
    const strippedB = sortById(b).map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));
    return JSON.stringify(strippedA) === JSON.stringify(strippedB);
  };
  const isSameCartItemWithQty = (a: any, b: any) => {
    return (
      a.variantId === b.variantId &&
      a.variantName === b.variantName &&
      a.variantPrice === b.variantPrice &&
      a.itemImage === b.itemImage &&
      a.quantity === b.quantity &&
      isSameAddonOrExtraWithQty(a.addons, b.addons) &&
      isSameAddonOrExtraWithQty(a.extras, b.extras)
    );
  };

  const updatedCart = stored.map((item: any) => {
    if (isSameCartItemWithQty(item, cartItem)) {
      let addonPrice = 0;
      const newAddons = (item.addons || []).map((addon: any) => {
        if (addon.id === addonId) {
          addonPrice = addon.price || 0;
          return { ...addon, quantity: (addon.quantity || 1) + 1 };
        }
        return addon;
      });
      return {
        ...item,
        addons: newAddons,
        totalPrice: (item.totalPrice || 0) + addonPrice,
      };
    }
    return item;
  });
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
};

export const decreaseItemAddon = (cartItem: any, addonId: string) => {
  if (typeof window === "undefined") return;
  const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");

  // Deep compare full payload including quantities
  const isSameAddonOrExtraWithQty = (a: any[], b: any[]) => {
    if (a.length !== b.length) return false;
    const sortById = (arr: any[]) => arr.slice().sort((x, y) => x.id.localeCompare(y.id));
    const strippedA = sortById(a).map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));
    const strippedB = sortById(b).map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));
    return JSON.stringify(strippedA) === JSON.stringify(strippedB);
  };
  const isSameCartItemWithQty = (a: any, b: any) => {
    return (
      a.variantId === b.variantId &&
      a.variantName === b.variantName &&
      a.variantPrice === b.variantPrice &&
      a.itemImage === b.itemImage &&
      a.quantity === b.quantity &&
      isSameAddonOrExtraWithQty(a.addons, b.addons) &&
      isSameAddonOrExtraWithQty(a.extras, b.extras)
    );
  };

  const updatedCart = stored.map((item: any) => {
    if (isSameCartItemWithQty(item, cartItem)) {
      let addonPrice = 0;
      let removedAddonPrice = 0;
      let removedAddonQty = 0;
      const newAddons = (item.addons || []).map((addon: any) => {
        if (addon.id === addonId) {
          addonPrice = addon.price || 0;
          const newQty = (addon.quantity || 1) - 1;
          if (newQty > 0) {
            return { ...addon, quantity: newQty };
          } else {
            removedAddonPrice = addon.price || 0;
            removedAddonQty = addon.quantity || 1;
            return null;
          }
        }
        return addon;
      }).filter(Boolean);
      let newTotal = item.totalPrice || 0;
      if (removedAddonPrice && removedAddonQty) {
        newTotal -= removedAddonPrice * removedAddonQty;
      } else {
        newTotal -= addonPrice;
      }
      return {
        ...item,
        addons: newAddons,
        totalPrice: newTotal,
      };
    }
    return item;
  });
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
};

export const increaseItemExtra = (cartItem: any, extraId: string) => {
  if (typeof window === "undefined") return;
  const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");

  // Deep compare full payload including quantities
  const isSameAddonOrExtraWithQty = (a: any[], b: any[]) => {
    if (a.length !== b.length) return false;
    const sortById = (arr: any[]) => arr.slice().sort((x, y) => x.id.localeCompare(y.id));
    const strippedA = sortById(a).map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));
    const strippedB = sortById(b).map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));
    return JSON.stringify(strippedA) === JSON.stringify(strippedB);
  };
  const isSameCartItemWithQty = (a: any, b: any) => {
    return (
      a.variantId === b.variantId &&
      a.variantName === b.variantName &&
      a.variantPrice === b.variantPrice &&
      a.itemImage === b.itemImage &&
      a.quantity === b.quantity &&
      isSameAddonOrExtraWithQty(a.addons, b.addons) &&
      isSameAddonOrExtraWithQty(a.extras, b.extras)
    );
  };

  const updatedCart = stored.map((item: any) => {
    if (isSameCartItemWithQty(item, cartItem)) {
      let extraPrice = 0;
      const newExtras = (item.extras || []).map((extra: any) => {
        if (extra.id === extraId) {
          extraPrice = extra.price || 0;
          return { ...extra, quantity: (extra.quantity || 1) + 1 };
        }
        return extra;
      });
      return {
        ...item,
        extras: newExtras,
        totalPrice: (item.totalPrice || 0) + extraPrice,
      };
    }
    return item;
  });
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
};

export const decreaseItemExtra = (cartItem: any, extraId: string) => {
  if (typeof window === "undefined") return;
  const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");

  // Deep compare full payload including quantities
  const isSameAddonOrExtraWithQty = (a: any[], b: any[]) => {
    if (a.length !== b.length) return false;
    const sortById = (arr: any[]) => arr.slice().sort((x, y) => x.id.localeCompare(y.id));
    const strippedA = sortById(a).map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));
    const strippedB = sortById(b).map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));
    return JSON.stringify(strippedA) === JSON.stringify(strippedB);
  };
  const isSameCartItemWithQty = (a: any, b: any) => {
    return (
      a.variantId === b.variantId &&
      a.variantName === b.variantName &&
      a.variantPrice === b.variantPrice &&
      a.itemImage === b.itemImage &&
      a.quantity === b.quantity &&
      isSameAddonOrExtraWithQty(a.addons, b.addons) &&
      isSameAddonOrExtraWithQty(a.extras, b.extras)
    );
  };

  const updatedCart = stored.map((item: any) => {
    if (isSameCartItemWithQty(item, cartItem)) {
      let extraPrice = 0;
      let removedExtraPrice = 0;
      let removedExtraQty = 0;
      const newExtras = (item.extras || []).map((extra: any) => {
        if (extra.id === extraId) {
          extraPrice = extra.price || 0;
          const newQty = (extra.quantity || 1) - 1;
          if (newQty > 0) {
            return { ...extra, quantity: newQty };
          } else {
            removedExtraPrice = extra.price || 0;
            removedExtraQty = extra.quantity || 1;
            return null;
          }
        }
        return extra;
      }).filter(Boolean);
      let newTotal = item.totalPrice || 0;
      if (removedExtraPrice && removedExtraQty) {
        newTotal -= removedExtraPrice * removedExtraQty;
      } else {
        newTotal -= extraPrice;
      }
      return {
        ...item,
        extras: newExtras,
        totalPrice: newTotal,
      };
    }
    return item;
  });
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
};
