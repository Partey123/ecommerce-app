import { Router } from "express";
import { cartController } from "../controllers/cart.controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const cartRoutes = Router();

cartRoutes.get("/", authMiddleware, cartController.getCart);
cartRoutes.post("/items", authMiddleware, cartController.addOrUpdateItem);
cartRoutes.delete("/items/:productId", authMiddleware, cartController.removeItem);

