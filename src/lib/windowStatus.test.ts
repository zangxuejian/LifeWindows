import { describe, expect, it } from "vitest";
import type { LifeWindow } from "../types/window";
import { getWindowStatus } from "./windowStatus";

const baseWindow: LifeWindow = {
  id: "test",
  slug: "test",
  title: "测试窗口",
  category: "growth",
  type: "hard",
  description: "测试",
  hardStartAge: 6,
  hardEndAge: 12,
  evidenceLevel: "editorial",
  canDoAfterWindow: false,
};

describe("getWindowStatus", () => {
  it("returns future before a window starts", () => {
    expect(getWindowStatus(baseWindow, 5).status).toBe("future");
  });

  it("treats the start boundary as active", () => {
    expect(getWindowStatus(baseWindow, 6).status).toBe("active");
  });

  it("returns active during the main interval", () => {
    expect(getWindowStatus(baseWindow, 8).status).toBe("active");
  });

  it("returns closing soon within two years of a hard end", () => {
    expect(getWindowStatus(baseWindow, 10).status).toBe("closingSoon");
  });

  it("closes a hard window after its end", () => {
    expect(getWindowStatus(baseWindow, 13).status).toBe("closed");
  });

  it("keeps a golden window possible after its golden period", () => {
    const golden: LifeWindow = {
      ...baseWindow,
      type: "golden",
      goldenStartAge: 5,
      goldenEndAge: 15,
      hardStartAge: undefined,
      hardEndAge: undefined,
      canDoAfterWindow: true,
    };
    expect(getWindowStatus(golden, 33).status).toBe("goldenPassed");
  });

  it("keeps an always-open window open", () => {
    const open: LifeWindow = {
      ...baseWindow,
      type: "open",
      hardStartAge: undefined,
      hardEndAge: undefined,
      typicalStartAge: 18,
      alwaysOpen: true,
      canDoAfterWindow: true,
    };
    expect(getWindowStatus(open, 60).status).toBe("alwaysOpen");
  });
});
