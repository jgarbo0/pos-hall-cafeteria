
export const menuItems = [
  {
    id: "1",
    title: "Fresh Basil Salad",
    available: 18,
    price: 1.57,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "appetizers",
    popular: true,
    description: "A refreshing salad with fresh basil, tomatoes, and mozzarella cheese."
  },
  {
    id: "2",
    title: "Salad with Berries",
    available: 18,
    price: 2.00,
    image: "https://images.unsplash.com/photo-1564093497595-593b96d80180?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "appetizers",
    description: "Mixed greens with seasonal berries, feta cheese, and balsamic vinaigrette."
  },
  {
    id: "3",
    title: "Green Linguine Noodles",
    available: 18,
    price: 2.82,
    image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "main",
    popular: true,
    description: "Spinach linguine pasta with garlic, olive oil, and Parmesan cheese."
  },
  {
    id: "4",
    title: "Lumpiang Sariwa",
    available: 18,
    price: 2.65,
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "appetizers",
    description: "Fresh Filipino spring rolls with vegetables and a sweet sauce."
  },
  {
    id: "5",
    title: "Curry Garlic Noodles",
    available: 18,
    price: 3.62,
    image: "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "main",
    popular: true,
    description: "Flavorful curry noodles with garlic, vegetables, and your choice of protein."
  },
  {
    id: "6",
    title: "Sunrise Sirloin Special",
    available: 18,
    price: 3.20,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "main",
    description: "Tender sirloin steak cooked to perfection, served with seasonal vegetables."
  },
  {
    id: "7",
    title: "Somali Beef Suqaar",
    available: 12,
    price: 9.99,
    image: "https://images.unsplash.com/photo-1547496502-affa22d38842?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "main",
    popular: true,
    description: "Traditional Somali beef dish with cubed meat, peppers, and spices."
  },
  {
    id: "8",
    title: "Somali Rice (Bariis)",
    available: 20,
    price: 5.50,
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "main",
    description: "Fragrant Somali spiced rice with raisins, cinnamon, and cardamom."
  },
  {
    id: "9",
    title: "Sambusa",
    available: 15,
    price: 2.99,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "appetizers",
    popular: true,
    description: "Crispy pastry triangles filled with spiced meat or vegetables."
  },
  {
    id: "10",
    title: "Malawah (Sweet Pancake)",
    available: 18,
    price: 3.50,
    image: "https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "dessert",
    description: "Sweet Somali crepe-like pancake served with honey or sugar."
  },
  {
    id: "11",
    title: "Shaah (Somali Tea)",
    available: 25,
    price: 2.00,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "beverages",
    description: "Traditional spiced Somali tea with cardamom, cinnamon, and cloves."
  },
  {
    id: "12",
    title: "Somali Cake",
    available: 8,
    price: 5.99,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=500&q=80",
    category: "cake",
    popular: true,
    description: "Delicious sponge cake flavored with cardamom and vanilla."
  }
];

export const categories = [
  { id: "all", name: "All Menu" },
  { id: "main", name: "Main Courses" },
  { id: "appetizers", name: "Appetizers" },
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

export const bookings = [
  {
    id: '1',
    date: '2023-10-15',
    startTime: '10:00',
    endTime: '12:00',
    customerName: 'Ahmed Hassan',
    purpose: 'Birthday Party',
    attendees: 25
  },
  {
    id: '2',
    date: '2023-10-15',
    startTime: '14:00',
    endTime: '16:00',
    customerName: 'Fatima Ali',
    purpose: 'Business Meeting',
    attendees: 12
  },
  {
    id: '3',
    date: '2023-10-16',
    startTime: '18:00',
    endTime: '22:00',
    customerName: 'Mohammed Omar',
    purpose: 'Wedding Reception',
    attendees: 50
  }
];

export const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', 
  '20:00', '21:00', '22:00'
];
