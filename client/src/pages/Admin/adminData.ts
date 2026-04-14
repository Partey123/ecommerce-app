export type AdminProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "draft";
};

export type AdminOrder = {
  id: string;
  customer: string;
  total: number;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED";
  createdAt: string;
};

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  role: "user" | "admin";
  orders: number;
};

export const adminProducts: AdminProduct[] = [
  { id: "P-1001", name: "Aurum Wristwatch", category: "Accessories", price: 3450, stock: 18, status: "active" },
  { id: "P-1002", name: "Noir Leather Brief", category: "Bags", price: 2280, stock: 12, status: "active" },
  { id: "P-1003", name: "Classic Loafers", category: "Footwear", price: 1310, stock: 9, status: "draft" },
];

export const adminOrders: AdminOrder[] = [
  { id: "O-7801", customer: "Ama Boateng", total: 3620, status: "PAID", createdAt: "2026-04-14" },
  { id: "O-7802", customer: "Kojo Mensah", total: 1240, status: "SHIPPED", createdAt: "2026-04-13" },
  { id: "O-7803", customer: "Esi Asante", total: 5290, status: "PENDING", createdAt: "2026-04-12" },
];

export const adminUsers: AdminUser[] = [
  { id: "U-2001", fullName: "Ama Boateng", email: "ama@luxemart.com", role: "user", orders: 8 },
  { id: "U-2002", fullName: "Kwame Owusu", email: "kwame@luxemart.com", role: "admin", orders: 3 },
  { id: "U-2003", fullName: "Esi Asante", email: "esi@luxemart.com", role: "user", orders: 5 },
];

export const adminCategories = ["Accessories", "Bags", "Footwear", "Fragrance", "Home"];
