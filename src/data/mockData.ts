
export const menuItems = [
  {
    id: "1",
    title: "Somali Beef Suqaar",
    available: 12,
    price: 9.99,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "main"
  },
  {
    id: "2",
    title: "Somali Rice (Bariis)",
    available: 20,
    price: 5.50,
    image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "main"
  },
  {
    id: "3",
    title: "Sambusa",
    available: 15,
    price: 2.99,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "appetizers"
  },
  {
    id: "4",
    title: "Malawah (Sweet Pancake)",
    available: 18,
    price: 3.50,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "dessert"
  },
  {
    id: "5",
    title: "Shaah (Somali Tea)",
    available: 25,
    price: 2.00,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "beverages"
  },
  {
    id: "6",
    title: "Halwa",
    available: 14,
    price: 4.25,
    image: "https://images.unsplash.com/photo-1558326567-98166332163b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "dessert"
  },
  {
    id: "7",
    title: "Muufo (Somali Bread)",
    available: 22,
    price: 3.00,
    image: "https://images.unsplash.com/photo-1586444248879-9a345322d7f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "sides"
  },
  {
    id: "8",
    title: "Hilib Ari (Goat Meat)",
    available: 10,
    price: 12.99,
    image: "https://images.unsplash.com/photo-1583964342120-49299f9ab7f0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "main"
  },
  {
    id: "9",
    title: "Mango Juice",
    available: 18,
    price: 3.25,
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "beverages"
  },
  {
    id: "10",
    title: "Somali Coffee",
    available: 20,
    price: 2.50,
    image: "https://images.unsplash.com/photo-1497636577773-f1231844b336?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "beverages"
  },
  {
    id: "11",
    title: "Canjeero (Sourdough Pancake)",
    available: 15,
    price: 2.99,
    image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "sides"
  },
  {
    id: "12",
    title: "Somali Cake",
    available: 8,
    price: 5.99,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "cake"
  }
];

export const categories = [
  { id: "all", name: "All Menu" },
  { id: "main", name: "Main Dishes" },
  { id: "appetizers", name: "Appetizers" },
  { id: "sides", name: "Side Dishes" },
  { id: "beverages", name: "Beverages" },
  { id: "cake", name: "Cakes" },
  { id: "dessert", name: "Desserts" }
];

export const generateOrderNumber = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateTableNumber = () => {
  return Math.floor(1 + Math.random() * 50);
};

