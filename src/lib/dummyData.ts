import { Address } from "@/models/Address";
import { Branch } from "@/models/Branch";
import { Category } from "@/models/Category";
import { Favorite } from "@/models/Favorites";
import { Item } from "@/models/Item";
import { Slides } from "@/models/Slides";
import { Social } from "@/models/Social";
import { AddOn, User } from "@/types";

export const dummyCategories: Category[] = [
  {
    id: 1,
    title: "Burgers"
  },
  {
    id: 2,
    title: "Pizzas"
  },
  {
    id: 3,
    title: "Drinks"
  }
];

const burgerAddOns: AddOn[] = [
  {
    heading: "Choose Your Size",
    required: true,
    addOnOptions: [
      { label: "Regular", price: 0 },
      { label: "Large", price: 100 },
      { label: "Extra Large", price: 200 }
    ]
  },
  {
    heading: "Choose Your Bun",
    required: true,
    addOnOptions: [
      { label: "Regular Bun", price: 0 },
      { label: "Sesame Bun", price: 30 },
      { label: "Pretzel Bun", price: 50 }
    ]
  },
  {
    heading: "Add Extra Toppings",
    required: false,
    addOnOptions: [
      { label: "Extra Cheese", price: 50 },
      { label: "Extra Patty", price: 150 },
      { label: "Bacon", price: 100 },
      { label: "Caramelized Onions", price: 40 },
      { label: "Mushrooms", price: 60 }
    ]
  },
  {
    heading: "Add Sauces",
    required: false,
    addOnOptions: [
      { label: "Garlic Mayo", price: 20 },
      { label: "BBQ Sauce", price: 20 },
      { label: "Chipotle Sauce", price: 30 },
      { label: "Special Sauce", price: 40 }
    ]
  }
];

export const dummyItems: Item[] = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Juicy beef patty with fresh vegetables",
    price: 499,
    image: "/Special-Pizza.jpg",
    category_id: 1,
    status: 1,
    cat_name: "Burgers",
    tags: "burger,beef,classic",
    addOns: burgerAddOns
  },
  {
    id: 2,
    name: "Margherita Pizza",
    description: "Classic Italian pizza with tomato and mozzarella",
    price: 899,
    image: "/Special-Pizza.jpg", 
    category_id: 2,
    status: 1,
    cat_name: "Pizzas",
    tags: "pizza,margherita,vegetarian",
    addOns: [
      {
        heading: "Extra Toppings",
        required: false,
        addOnOptions: [
          { label: "Extra Cheese", price: 100 },
          { label: "Mushrooms", price: 80 },
          { label: "Olives", price: 50 }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Cola",
    description: "Refreshing cola drink",
    price: 100,
    image: "/Special-Pizza.jpg",
    category_id: 3,
    status: 1,
    cat_name: "Drinks",
    tags: "drinks,cola,cold"
  }
];

export const dummyFavorites: Favorite[] = [
  {
    id: 1,
    userid: 1,
    itemid: 1
  },
  {
    id: 2,
    userid: 1,
    itemid: 2
  }
];

export const dummyUser = {
  userId: 1,
  name: "Demo User",
  email: "demo@example.com",
  phone: "1234567890",
  isVerified: 1,
  id: 1,
  joined_at: "2024-01-01",
  image: "/default-avatar.jpg",
  gender: "Not Specified",
  dob: "1990-01-01",
  wallet: "0",
  addresses: []
};

export const dummySlides: Slides[] = [
  {
    id: 1,
    image: "/banner-1.webp"
  },
  {
    id: 2,
    image: "/banner-2.webp"
  },
  {
    id: 3,
    image: "/banner-3.webp"
  }
];

export const dummyBranches: Branch[] = [
  {
    id: 1,
    name: "Downtown Branch",
    area: "Downtown",
    city: "New York",
    address: "123 Main St",
    open_time: "09:00",
    end_time: "22:00",
    delivery_areas: "Downtown, Midtown",
    lat: "40.7128",
    lon: "-74.0060"
  },
  {
    id: 2,
    name: "Uptown Branch",
    area: "Uptown",
    city: "New York",
    address: "456 High St",
    open_time: "09:00",
    end_time: "22:00",
    delivery_areas: "Uptown, Upper West Side",
    lat: "40.7589",
    lon: "-73.9851"
  }
];

export const dummySocials: Social[] = [
  {
    id: 1,
    link_name: "facebook",
    link_text: "Visit us on Facebook",
    link_icon: "/icons/facebook.svg"
  },
  {
    id: 2,
    link_name: "instagram",
    link_text: "Follow us on Instagram",
    link_icon: "/icons/instagram.svg"
  }
];

export const dummyOrders = {
  currentPage: 1,
  totalPages: 1,
  orders: [
    {
      id: 1,
      userid: 1,
      total: "1000",
      order_total: 1000,
      status: "pending",
      order_created_on: "2024-01-01T12:00:00Z",
      deliveryCharge: "150",
      tax: "100",
      discount: "50",
      items: [
        {
          id: 1,
          qty: "2",
          price: "400",
          name: "Classic Burger",
          description: "Juicy beef patty with fresh vegetables"
        },
        {
          id: 2,
          qty: "1",
          price: "899",
          name: "Margherita Pizza",
          description: "Classic Italian pizza with tomato and mozzarella"
        }
      ]
    },
    {
      id: 2,
      userid: 1,
      total: "800",
      order_total: 800,
      status: "completed",
      order_created_on: "2024-01-02T15:30:00Z",
      deliveryCharge: "150",
      tax: "80",
      discount: "0",
      items: [
        {
          id: 3,
          qty: "4",
          price: "100",
          name: "Cola",
          description: "Refreshing cola drink"
        }
      ]
    }
  ]
};
