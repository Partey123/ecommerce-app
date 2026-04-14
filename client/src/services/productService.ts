import { api } from "./api";
import type { Category, Product } from "../features/products/productTypes";

export const productService = {
  listProducts() {
    return api.get<{ products: Product[] }>("/api/products");
  },

  listCategories() {
    return api.get<{ categories: Category[] }>("/api/products/categories");
  },
};

