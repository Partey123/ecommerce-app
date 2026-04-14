import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const authRoutes = Router();

authRoutes.get("/me", authMiddleware, authController.me);

