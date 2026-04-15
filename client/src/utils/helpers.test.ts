import { describe, expect, it } from "vitest";
import { getRoleFromUser } from "./helpers";

describe("getRoleFromUser", () => {
  it("prefers app metadata role when present", () => {
    const role = getRoleFromUser({
      app_metadata: { role: "admin" },
      user_metadata: { role: "user" },
    });

    expect(role).toBe("admin");
  });

  it("falls back to user metadata role", () => {
    const role = getRoleFromUser({
      app_metadata: {},
      user_metadata: { role: "manager" },
    });

    expect(role).toBe("manager");
  });

  it("returns user as a safe default", () => {
    const role = getRoleFromUser({
      app_metadata: null,
      user_metadata: null,
    });

    expect(role).toBe("user");
  });
});
