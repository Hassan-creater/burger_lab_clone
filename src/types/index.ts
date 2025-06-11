import { Item } from "@/models/Item";

export type AddOnOption = {
  label: string;
  price?: number;
  isChecked?: boolean;
};

export type AddOn = {
  heading: string;
  required: boolean;
  labels?: string[];
  addOnOptions: AddOnOption[];
};

export type CartItem = {
  image: string;
  id: number;
  name: string;
  description?: string;
  quantity?: number;
  totalPerPriceWithAddOns: number;
  addOnOptions?: AddOnOption[];
};

export type MenuProduct = {
  itemImage: string;
  itemId: string;
  itemName: string;
  itemDescription?: string;
  price: number;
  discountedPrice?: number;
  category: string;
  addOns?: AddOn[];
};

export type CartState = {
  itemInCart?: CartItem;
  isItemInCart: boolean;
};

export type TabsListType = {
  name: "DELIVERY" | "PICK-UP" | "DINE-IN";
  value: "delivery" | "pickUp" | "dineIn";
};

export type SearchResults = {
  items: Record<string, Item[]>;
};

export type User = {
  userId: number;
  email: string;
  role: any;
  name: string;
};

export type UserDetails = Omit<User, "userId"> & {
  isVerified: number;
  id: number;
  phone: string;
  joined_at: string;
  image: string;
  gender: string;
  dob: string;
  wallet: string;
};
