import { describe, expect, it } from "vitest";
import { expiringWindows } from "../data/windows";
import { filterWindows, type ExploreStage } from "./exploration";

const noFilters = { query: "", category: "all" as const };

function idsAtStage(ageYears: number, stage: ExploreStage): string[] {
  return filterWindows(ageYears * 12, { ...noFilters, stage }).map((item) => item.id);
}

describe("exploration lifecycle partitions", () => {
  it.each([0, 33, 60, 100])(
    "partitions every event exactly once at age %i",
    (ageYears) => {
      const current = idsAtStage(ageYears, "current");
      const upcoming = idsAtStage(ageYears, "upcoming");
      const past = idsAtStage(ageYears, "past");
      const combined = [...current, ...upcoming, ...past];

      expect(new Set(combined).size).toBe(combined.length);
      expect(new Set(combined)).toEqual(new Set(expiringWindows.map((item) => item.id)));
    },
  );

  it("keeps an event current through its exact end, then moves it to past", () => {
    const atEnd = filterWindows(35 * 12, { query: "职业探索", category: "career", stage: "current" });
    const afterEnd = filterWindows(35 * 12 + 1, { query: "职业探索", category: "career", stage: "past" });

    expect(atEnd.map((item) => item.id)).toContain("career-exploration");
    expect(afterEnd.map((item) => item.id)).toContain("career-exploration");
    expect(
      filterWindows(35 * 12 + 1, { query: "职业探索", category: "career", stage: "current" }),
    ).toHaveLength(0);
  });
});

describe("exploration text and category filters", () => {
  it("combines category with multiple terms matched across title and summary", () => {
    const results = filterWindows(33 * 12, {
      query: "职业 试验",
      category: "career",
      stage: "all",
    });

    expect(results.map((item) => item.id)).toContain("career-exploration");
    expect(results.every((item) => item.category === "career")).toBe(true);
    expect(
      filterWindows(33 * 12, { query: "职业 不存在的词", category: "career", stage: "all" }),
    ).toHaveLength(0);
  });

  it("treats whitespace-only queries as no text filter", () => {
    const blank = filterWindows(60 * 12, { query: " \t  \n", category: "health", stage: "all" });
    const empty = filterWindows(60 * 12, { query: "", category: "health", stage: "all" });

    expect(blank.map((item) => item.id)).toEqual(empty.map((item) => item.id));
    expect(blank.length).toBeGreaterThan(0);
  });
});
