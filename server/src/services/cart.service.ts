import { CartModel } from "../models/Cart";
import { ProductModel } from "../models/Product";

export const cartService = {
  async getCart(userId: string) {
    return CartModel.listItems(userId);
  },

  async addOrUpdateItem(userId: string, productId: string, quantity: number) {
    const product = await ProductModel.getById(productId);
    if (!product || !product.is_active) {
      throw new Error("Product not found or inactive");
    }

    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    return CartModel.upsertItem(userId, productId, quantity, product.price_ghs);
  },

  async removeItem(userId: string, productId: string) {
    await CartModel.removeItem(userId, productId);
  },
};

