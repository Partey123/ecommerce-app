import { describe, expect, it } from "vitest";
import { isValidPaystackSignature, signPaystackPayload } from "./paystackHelpers";

describe("paystackHelpers", () => {
  it("signs payloads deterministically", () => {
    const payload = { event: "charge.success", data: { reference: "abc-123" } };
    const secret = "test-secret";

    const signatureA = signPaystackPayload(payload, secret);
    const signatureB = signPaystackPayload(payload, secret);

    expect(signatureA).toBe(signatureB);
    expect(signatureA).toHaveLength(128);
  });

  it("validates matching signatures", () => {
    const payload = { event: "charge.success", data: { amount: 1200 } };
    const secret = "test-secret";
    const signature = signPaystackPayload(payload, secret);

    expect(isValidPaystackSignature(payload, signature, secret)).toBe(true);
  });

  it("rejects invalid signatures", () => {
    const payload = { event: "charge.success", data: { amount: 1200 } };
    const secret = "test-secret";

    expect(isValidPaystackSignature(payload, "invalid-signature", secret)).toBe(false);
  });
});
