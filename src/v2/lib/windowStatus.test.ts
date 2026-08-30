import { describe, expect, it } from "vitest";
import type { LifeWindowV2 } from "../types";
import {
  formatAgeRange,
  getRemainingTime,
  getWindowColor,
  getWindowLabel,
  getWindowStatus,
  toMonths,
} from "./windowStatus";

const base: LifeWindowV2 = {
  id: "test",
  slug: "test",
  title: "测试窗口",
  category: "body",
  lifeStage: "youth",
  icon: "heart",
  startAge: 20,
  endAge: 30,
  ageUnit: "year",
  summary: "测试",
  evidence: { type: "editorial", label: "测试", note: "测试" },
  detail: { answer: "测试", whyChanges: "测试", whatNow: ["测试"], boundaries: ["测试"] },
};

describe("V2 window status engine", () => {
  it("normalizes month and year units", () => {
    expect(toMonths(6, "month")).toBe(6);
    expect(toMonths(6, "year")).toBe(72);
  });

  it("handles future, active and closing boundaries", () => {
    expect(getWindowStatus(base, 19)).toBe("future");
    expect(getWindowStatus(base, 20)).toBe("active");
    expect(getWindowStatus(base, 28)).toBe("closing");
  });

  it("closes hard windows after the end", () => {
    expect(getWindowStatus({ ...base, hardEnd: true }, 31)).toBe("missed");
    expect(getWindowLabel({ ...base, hardEnd: true }, 31)).toBe("已错过");
  });

  it("keeps soft and golden windows possible after the common range", () => {
    const golden = { ...base, golden: { startAge: 20, endAge: 30 } };
    expect(getWindowStatus(golden, 33)).toBe("possible");
    expect(getWindowLabel(golden, 33)).toContain("仍可进行");
  });

  it("supports infant windows in months", () => {
    const infant = { ...base, ageUnit: "month" as const, startAge: 6, endAge: 9, lifeStage: "infant" as const };
    expect(getWindowStatus(infant, 0.25)).toBe("future");
    expect(getWindowStatus(infant, 0.5)).toBe("active");
    expect(formatAgeRange(infant)).toBe("6–9月");
  });

  it("reports remaining time and long-term openness", () => {
    expect(getRemainingTime(base, 29)).toBe("还剩 1 年");
    expect(getRemainingTime({ ...base, endAge: undefined, alwaysOpen: true }, 40)).toBe("没有预设截止年龄");
  });

  it("returns accessible semantic colors", () => {
    expect(getWindowColor("active")).toBe("#19713E");
    expect(getWindowColor("future")).toBe("#1671C9");
  });
});
