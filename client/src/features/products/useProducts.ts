import { useEffect, useState } from "react";
import { productService } from "../../services/productService";
import type { Product } from "./productTypes";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productService.listProducts();
        setProducts(response.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, []);

  return { products, loading, error };
};

