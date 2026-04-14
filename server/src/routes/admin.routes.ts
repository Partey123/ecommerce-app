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
adminRoutes.get("/orders/:id", authMiddleware, adminMiddleware, adminController.getOrder);
adminRoutes.get("/users", authMiddleware, adminMiddleware, adminController.listUsers);
adminRoutes.get("/products", authMiddleware, adminMiddleware, adminController.listProducts);
adminRoutes.get("/products/:id", authMiddleware, adminMiddleware, adminController.getProduct);
adminRoutes.post("/products", authMiddleware, adminMiddleware, adminController.createProduct);
adminRoutes.put("/products/:id", authMiddleware, adminMiddleware, adminController.updateProduct);
adminRoutes.get("/categories", authMiddleware, adminMiddleware, adminController.listCategories);
adminRoutes.post("/categories", authMiddleware, adminMiddleware, adminController.createCategory);
adminRoutes.put("/categories/:id", authMiddleware, adminMiddleware, adminController.updateCategory);
adminRoutes.delete("/categories/:id", authMiddleware, adminMiddleware, adminController.deleteCategory);

