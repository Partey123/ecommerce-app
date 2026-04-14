import { Request, Response } from "express";
import { OrderModel } from "../models/Order";
import { ProductModel } from "../models/Product";
import { UserModel } from "../models/User";

export const adminController = {
  async getOverview(_req: Request, res: Response): Promise<void> {
    const [orders, users, products] = await Promise.all([
      OrderModel.listAll(),
      UserModel.listProfiles(),
      ProductModel.listAll(),
    ]);

    const revenue = orders.reduce(
      (sum, order) => sum + Number(order.total_ghs ?? 0),
      0
    );

    res.status(200).json({
      stats: {
        revenueGhs: revenue,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalProducts: products.length,
      },
    });
  },

  async listOrders(_req: Request, res: Response): Promise<void> {
    const orders = await OrderModel.listAll();
    res.status(200).json({ orders });
  },

  async listUsers(_req: Request, res: Response): Promise<void> {
    const users = await UserModel.listProfiles();
    res.status(200).json({ users });
  },
};

