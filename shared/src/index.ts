export interface User {
  id: string;
  email: string;
  role: "user" | "admin";
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}
