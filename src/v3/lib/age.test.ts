import { describe, expect, it } from "vitest";
import { MAX_AGE_MONTHS, clampAgeMonths, parseAgeQuery, parseStoredAge } from "./age";

describe("age parsing", () => {
  it("reads query ages in years and preserves the true month unit", () => {
    expect(parseAgeQuery("?age=33")).toBe(396);
    expect(parseAgeQuery("?topic=sleep&age=2.5")).toBe(30);
  });

  it("rejects missing, empty, and non-finite query ages", () => {
    expect(parseAgeQuery("?topic=sleep")).toBeNull();
    expect(parseAgeQuery("?age=")).toBeNull();
    expect(parseAgeQuery("?age=Infinity")).toBeNull();
    expect(parseAgeQuery("?age=not-a-number")).toBeNull();
  });

  it("clamps query ages at the supported boundaries", () => {
    expect(parseAgeQuery("?age=-1")).toBe(0);
    expect(parseAgeQuery("?age=101")).toBe(MAX_AGE_MONTHS);
  });

  it("reads storage values in months and rejects invalid values", () => {
    expect(parseStoredAge("397")).toBe(397);
    expect(parseStoredAge("  ")).toBeNull();
    expect(parseStoredAge("NaN")).toBeNull();
    expect(parseStoredAge(null)).toBeNull();
  });
});

describe("clampAgeMonths", () => {
  it("rounds and clamps finite values", () => {
    expect(clampAgeMonths(12.6)).toBe(13);
    expect(clampAgeMonths(-10)).toBe(0);
    expect(clampAgeMonths(MAX_AGE_MONTHS + 1)).toBe(MAX_AGE_MONTHS);
  });

  it("does not allow NaN or infinities into application state", () => {
    expect(clampAgeMonths(Number.NaN)).toBe(0);
    expect(clampAgeMonths(Number.POSITIVE_INFINITY)).toBe(0);
    expect(clampAgeMonths(Number.NEGATIVE_INFINITY)).toBe(0);
  });
});
