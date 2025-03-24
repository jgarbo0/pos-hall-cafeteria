
export const menuItems = [
  {
    id: "1",
    title: "Fresh Basil Salad",
    available: 18,
    price: 1.57,
    image: "/lovable-uploads/38d9cb5d-08d6-4a42-95fe-fa0e714f6f33.png",
    category: "salad"
  },
  {
    id: "2",
    title: "Salad with Berries",
    available: 18,
    price: 2.00,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "salad"
  },
  {
    id: "3",
    title: "Green Linguine Noodles",
    available: 18,
    price: 2.82,
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "noodles"
  },
  {
    id: "4",
    title: "Lumpiang Sariwa",
    available: 18,
    price: 2.65,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "appetizers"
  },
  {
    id: "5",
    title: "Curry Garlic Noodles",
    available: 18,
    price: 3.62,
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "noodles"
  },
  {
    id: "6",
    title: "Sunrise Sirloin Special",
    available: 18,
    price: 3.20,
    image: "https://images.unsplash.com/photo-1529694177890-8b1b3e319ab6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "main"
  },
  {
    id: "7",
    title: "Chocolate Cake",
    available: 10,
    price: 4.50,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "cake"
  },
  {
    id: "8",
    title: "Strawberry Dessert",
    available: 12,
    price: 3.75,
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "dessert"
  },
  {
    id: "9",
    title: "Mango Smoothie",
    available: 15,
    price: 2.25,
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "beverages"
  },
  {
    id: "10",
    title: "Chicken Curry",
    available: 8,
    price: 4.99,
    image: "https://images.unsplash.com/photo-1604152135912-04a022e23696?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "main"
  },
  {
    id: "11",
    title: "Vegetable Stir Fry",
    available: 14,
    price: 3.49,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "main"
  },
  {
    id: "12",
    title: "Iced Coffee",
    available: 20,
    price: 1.99,
    image: "https://images.unsplash.com/photo-1578314675249-a6910f90493a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "beverages"
  }
];

export const categories = [
  { id: "salad", name: "Salads" },
  { id: "appetizers", name: "Appetizers" },
  { id: "main", name: "Main Courses" },
  { id: "noodles", name: "Noodles" },
  { id: "beverages", name: "Beverages" },
  { id: "cake", name: "Cake" },
  { id: "dessert", name: "Dessert" }
];

export const generateOrderNumber = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateTableNumber = () => {
  return Math.floor(1 + Math.random() * 50);
};
