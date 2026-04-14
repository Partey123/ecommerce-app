import { CartModel } from "../models/Cart";
import { OrderModel } from "../models/Order";

export const orderService = {
  async listMyOrders(userId: string) {
    return OrderModel.listByUser(userId);
  },

  async createFromCart(
    userId: string,
    shippingAddress?: Record<string, unknown>,
    notes?: string
  ) {
    const items = await CartModel.listItems(userId);
    if (items.length === 0) {
      throw new Error("Cannot create order from an empty cart");
    }

    const subtotal = items.reduce(
      (total, item) => total + Number(item.unit_price_ghs) * item.quantity,
      0
    );
    const shipping = 0;
    const total = subtotal + shipping;

    const order = await OrderModel.create({
      user_id: userId,
      subtotal_ghs: subtotal,
      shipping_ghs: shipping,
      total_ghs: total,
      shipping_address: shippingAddress ?? null,
      notes: notes ?? null,
    });

    await OrderModel.insertItems(
      items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product?.name ?? "Unknown product",
        quantity: item.quantity,
        unit_price_ghs: item.unit_price_ghs,
      }))
    );

    return order;
  },
};

