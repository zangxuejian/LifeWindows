import { describe, expect, it } from "vitest";
import { agePointToMonths } from "../lib/age";
import { expiringWindows } from "./windows";

describe("expiringWindows", () => {
  it("contains only finite windows with valid bounds", () => {
    expect(expiringWindows.length).toBeGreaterThanOrEqual(60);
    for (const window of expiringWindows) {
      expect(agePointToMonths(window.start)).toBeLessThan(agePointToMonths(window.end));
      expect(window.start).toBeDefined();
      expect(window.end).toBeDefined();
    }
  });

  it("keeps policy-sensitive sample data visibly qualified", () => {
    const policyWindows = expiringWindows.filter((window) => window.category === "policy");
    expect(policyWindows.length).toBeGreaterThan(0);
    for (const window of policyWindows) {
      expect(window.evidenceLevel).toBe("editorial");
      expect(window.region?.length).toBeGreaterThan(0);
      expect(window.sourceNote).toContain("示例");
      expect(window.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("includes finite windows around age 60", () => {
    const atSixty = expiringWindows.filter((window) => {
      const start = agePointToMonths(window.start);
      const end = agePointToMonths(window.end);
      return start <= 60 * 12 && end >= 60 * 12;
    });
    expect(atSixty.length).toBeGreaterThanOrEqual(6);
  });
});
