import { Request, Response } from "express";
import { orderService } from "../services/order.service";

export const orderController = {
  async listMyOrders(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const orders = await orderService.listMyOrders(userId);
    res.status(200).json({ orders });
  },

  async createOrder(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { shippingAddress, notes } = req.body as {
      shippingAddress?: Record<string, unknown>;
      notes?: string;
    };

    const order = await orderService.createFromCart(userId, shippingAddress, notes);
    res.status(201).json({ order });
  },
};

