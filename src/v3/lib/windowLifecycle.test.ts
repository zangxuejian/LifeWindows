import { describe, expect, it } from "vitest";
import type { ExpiringLifeWindow } from "../types";
import {
  getLifecycleProgress,
  getLifecycleState,
  getMacroGroup,
  getMemorialDurationMonths,
} from "./windowLifecycle";

const sample: ExpiringLifeWindow = {
  id: "sample",
  slug: "sample",
  title: "示例窗口",
  category: "career",
  icon: "briefcase",
  start: { value: 20, unit: "year" },
  end: { value: 30, unit: "year" },
  type: "golden",
  importance: "important",
  evidenceLevel: "editorial",
};

describe("windowLifecycle", () => {
  it("calculates lifecycle progress in months", () => {
    expect(getLifecycleProgress(sample, 20 * 12)).toBe(0);
    expect(getLifecycleProgress(sample, 25 * 12)).toBe(0.5);
    expect(getLifecycleProgress(sample, 30 * 12)).toBe(1);
  });

  it("moves through the seven lifecycle states", () => {
    expect(getLifecycleState(sample, 19 * 12)).toBe("notBorn");
    expect(getLifecycleState(sample, 21 * 12)).toBe("emerging");
    expect(getLifecycleState(sample, 24 * 12)).toBe("fresh");
    expect(getLifecycleState(sample, 26 * 12)).toBe("mature");
    expect(getLifecycleState(sample, 29 * 12)).toBe("withering");
    expect(getLifecycleState(sample, 30 * 12 + 1)).toBe("memorial");
    expect(getLifecycleState(sample, 32 * 12 + 1)).toBe("gone");
  });

  it("uses a memorial duration clamped between 6 and 24 months", () => {
    expect(getMemorialDurationMonths({ ...sample, end: { value: 22, unit: "year" } })).toBe(6);
    expect(getMemorialDurationMonths(sample)).toBe(18);
    expect(getMemorialDurationMonths({ ...sample, end: { value: 60, unit: "year" } })).toBe(24);
  });

  it("maps visible lifecycle states into the three homepage groups", () => {
    expect(getMacroGroup("fresh")).toBe("thriving");
    expect(getMacroGroup("mature")).toBe("thriving");
    expect(getMacroGroup("withering")).toBe("withering");
    expect(getMacroGroup("memorial")).toBe("memorial");
    expect(getMacroGroup("notBorn")).toBeNull();
    expect(getMacroGroup("gone")).toBeNull();
  });
});
