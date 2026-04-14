import { Request, Response } from "express";
import { cartService } from "../services/cart.service";

export const cartController = {
  async getCart(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const items = await cartService.getCart(userId);
    res.status(200).json({ items });
  },

  async addOrUpdateItem(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { productId, quantity } = req.body as {
      productId?: string;
      quantity?: number;
    };

    if (!productId || typeof quantity !== "number") {
      res.status(400).json({ error: "productId and quantity are required" });
      return;
    }

    const item = await cartService.addOrUpdateItem(userId, productId, quantity);
    res.status(200).json({ item });
  },

  async removeItem(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const productIdParam = req.params.productId;
    const productId =
      typeof productIdParam === "string" ? productIdParam : undefined;
    if (!productId) {
      res.status(400).json({ error: "productId is required" });
      return;
    }

    await cartService.removeItem(userId, productId);
    res.status(204).send();
  },
};

