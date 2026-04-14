import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

export const adminRoutes = Router();

adminRoutes.get("/health", authMiddleware, adminMiddleware, (_req, res) =>
  res.status(200).json({ ok: true, area: "admin" })
);
adminRoutes.get("/overview", authMiddleware, adminMiddleware, adminController.getOverview);
adminRoutes.get("/orders", authMiddleware, adminMiddleware, adminController.listOrders);
adminRoutes.get("/users", authMiddleware, adminMiddleware, adminController.listUsers);

