import { Request, Response } from "express";
import { paymentService } from "../services/payment.service";

type PaystackWebhookPayload = {
  event?: string;
  data?: {
    reference?: string;
    amount?: number;
    metadata?: {
      orderId?: string;
    };
  };
};

export const paymentController = {
  async handleWebhook(req: Request, res: Response): Promise<void> {
    const payload = req.body as PaystackWebhookPayload;
    const event = payload.event ?? "";
    const reference = payload.data?.reference;
    const orderId = payload.data?.metadata?.orderId;
    const amountInPesewas = payload.data?.amount ?? 0;
    const amountGhs = Number(amountInPesewas) / 100;

    if (!reference || !orderId) {
      res.status(400).json({ error: "Missing payment reference or orderId" });
      return;
    }

    if (event === "charge.success") {
      await paymentService.recordTransaction({
        orderId,
        providerReference: reference,
        amountGhs,
        status: "PAID",
        rawPayload: req.body as Record<string, unknown>,
      });
      await paymentService.markOrderPaid(orderId);
    }

    res.status(200).json({ received: true });
  },
};

