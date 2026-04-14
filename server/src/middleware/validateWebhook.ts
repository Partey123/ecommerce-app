import { createHmac, timingSafeEqual } from "crypto";
import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";

const asBuffer = (value: string): Buffer => Buffer.from(value, "utf8");

export const validateWebhook = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const signature = req.header("x-paystack-signature");
  if (!signature) {
    res.status(401).json({ error: "Missing Paystack signature header" });
    return;
  }

  const rawPayload = JSON.stringify(req.body ?? {});
  const expectedSignature = createHmac("sha512", env.PAYSTACK_WEBHOOK_SECRET)
    .update(rawPayload)
    .digest("hex");

  const providedBuffer = asBuffer(signature);
  const expectedBuffer = asBuffer(expectedSignature);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    res.status(401).json({ error: "Invalid webhook signature" });
    return;
  }

  next();
};

