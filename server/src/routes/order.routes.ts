import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const orderRoutes = Router();

orderRoutes.get("/", authMiddleware, orderController.listMyOrders);
orderRoutes.post("/", authMiddleware, orderController.createOrder);

