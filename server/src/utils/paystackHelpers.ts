import { createHmac, timingSafeEqual } from "crypto";

export const signPaystackPayload = (payload: unknown, secret: string): string =>
  createHmac("sha512", secret).update(JSON.stringify(payload ?? {})).digest("hex");

export const isValidPaystackSignature = (
  payload: unknown,
  signature: string,
  secret: string
): boolean => {
  const expected = signPaystackPayload(payload, secret);
  const providedBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  if (providedBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(providedBuffer, expectedBuffer);
};

export const paystackHelpers = {
  signPaystackPayload,
  isValidPaystackSignature,
};

