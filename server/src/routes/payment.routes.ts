import { Router } from "express";
import { paymentController } from "../controllers/payment.controller";
import { validateWebhook } from "../middleware/validateWebhook";

export const paymentRoutes = Router();

paymentRoutes.post("/webhook", validateWebhook, paymentController.handleWebhook);

