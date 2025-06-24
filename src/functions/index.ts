import {
  dummyBranches,
  dummyCategories,
  dummyFavorites,
  dummyItems,
  dummyOrders,
  dummySlides,
  dummySocials,
  dummyUser,
} from "@/lib/dummyData";
import { Address } from "@/models/Address";
import { Branch } from "@/models/Branch";
import { Category } from "@/models/Category";
import { CouponValidation } from "@/models/Coupon";
import { Favorite } from "@/models/Favorites";
import { Item } from "@/models/Item";
import { Order, OrderDetails, OrderResult } from "@/models/Order";
import { Slides } from "@/models/Slides";
import { Social } from "@/models/Social";
import { CartItem, SearchResults, User, UserDetails } from "@/types";
import { formatOrderData, parseOrderItems } from '@/lib/orderUtils';

// Comment out the actual backend URL since we're using dummy data
// const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getAllCategories() {
  return {
    status: 200,
    categories: dummyCategories,
  };
}

export async function getAllSlides() {
  return {
    status: 200,
    slides: dummySlides,
  };
}

export async function getItemsByCategory(categoryId: string) {
  const items = dummyItems.filter((item) => item.categoryId === categoryId);
  return {
    status: 200,
    items,
  };
}

export async function getAllBranches() {
  return {
    status: 200,
    branches: dummyBranches,
  };
}

export async function getItemsByTag(query: string) {
  const items = dummyItems.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      (item.description?.toLowerCase() || '').includes(query.toLowerCase())
  );
  return {
    status: 200,
    items,
  };
}

export async function getItemById(id: string) {
  const item = dummyItems.find((item) => item.id === id);
  return {
    status: item ? 200 : 404,
    item: item || null,
  };
}

export async function getAllFavorites(userId: string) {
  const favorites = dummyFavorites.filter((fav) => fav.userid === userId);
  return {
    status: 200,
    favorites,
  };
}

export async function addFavorite(userId: string, itemId: string) {
  const newFavorite: Favorite = {
    id: "1",
    userid: userId,
    itemid: itemId,
  };
  dummyFavorites.push(newFavorite);
  return {
    status: 200,
    favorite: newFavorite,
  };
}

export async function removeFavorite(userId: string, itemId: string) {
  const index = dummyFavorites.findIndex(
    (fav) => fav.userid === userId && fav.itemid === itemId
  );
  if (index !== -1) {
    dummyFavorites.splice(index, 1);
  }
  return {
    status: 200,
    message: "Favorite removed successfully",
  };
}

export async function addAddress() {
  return {
    status: 200,
    address: {
      id: 1,
      userid: 1,
      city: "Demo City",
      line1: "123 Street",
      line2: "Apt 4",
      status: "1",
    },
  };
}

export async function getAllAddresses() {
  return {
    status: 200,
    addresses: [
      {
        id: 1,
        userid: 1,
        city: "Demo City",
        line1: "123 Street",
        line2: "Apt 4",
        status: "1",
      },
    ],
  };
}

export async function deleteAddress() {
  return {
    status: 200,
    message: "Address deleted successfully",
  };
}

export async function updateAddress() {
  return {
    status: 200,
    address: {
      id: 1,
      userid: 1,
      city: "Updated City",
      line1: "Updated Street",
      line2: "Updated Apt",
      status: "1",
    },
  };
}

export async function getTax() {
  return {
    status: 200,
    tax: "10",
  };
}

export async function validateCoupon() {
  return {
    status: 200,
    validation: {
      isValid: true,
      message: "Coupon applied successfully",
      discount: "10%",
    },
  };
}

export async function placeOrder() {
  return {
    status: 200,
    order: {
      id: 1,
      userid: 1,
      total: 1000,
      status: "pending",
      created_at: new Date().toISOString(),
    },
  };
}

export async function getOrders(userId: string, page: number = 1) {
  return {
    status: 200,
    orders: {
      ...dummyOrders,
      orders: dummyOrders.orders.map(order => formatOrderData(order))
    }
  };
}

export async function getOrder() {
  return {
    status: 200,
    order: {
      id: 1,
      userid: 1,
      total: 1000,
      status: "pending",
      created_at: new Date().toISOString(),
      items: dummyItems.slice(0, 2),
    },
  };
}

export async function getSocials() {
  return {
    status: 200,
    links: dummySocials,
  };
}

export async function login() {
  return {
    status: 200,
    user: dummyUser,
    loginDetails: dummyUser,
  };
}

export async function register() {
  return {
    status: 200,
    message: "Registration successful",
  };
}

export async function logoutAction() {
  return {
    status: true,
    message: "Logged out successfully",
  };
}

export async function getUser() {
  return {
    status: true,
    user: dummyUser,
  };
}

export async function getUserDetails() {
  return {
    status: 200,
    user: {
      ...dummyUser,
      addresses: [],
    },
  };
}

export async function updateUserDetails() {
  return {
    status: 200,
    user: dummyUser,
  };
}
