import { describe, expect, it } from "vitest";
import {
  TIME_CONSTANT,
  ageToPosition,
  positionToAge,
} from "./timeScale";

describe("timeScale", () => {
  it("maps objective age linearly", () => {
    expect(ageToPosition(0, "linear")).toBe(0);
    expect(ageToPosition(50, "linear")).toBe(0.5);
    expect(ageToPosition(100, "linear")).toBe(1);
  });

  it("maps relative time to the full normalized range", () => {
    expect(TIME_CONSTANT).toBe(5);
    expect(ageToPosition(0, "relative")).toBe(0);
    expect(ageToPosition(100, "relative")).toBeCloseTo(1, 12);
  });

  it("stays monotonic in relative mode", () => {
    expect(ageToPosition(5, "relative")).toBeLessThan(ageToPosition(10, "relative"));
    expect(ageToPosition(10, "relative")).toBeLessThan(ageToPosition(20, "relative"));
    expect(ageToPosition(20, "relative")).toBeLessThan(ageToPosition(50, "relative"));
  });

  it.each([0, 1, 3, 5, 8, 10, 18, 25, 33, 50, 65, 80, 100])(
    "round-trips age %s within 0.01 years",
    (age) => {
      const position = ageToPosition(age, "relative");
      expect(Math.abs(positionToAge(position, "relative") - age)).toBeLessThan(0.01);
    },
  );

  it("gives early years visibly more relative space than late years", () => {
    const early = ageToPosition(10, "relative") - ageToPosition(0, "relative");
    const late = ageToPosition(100, "relative") - ageToPosition(90, "relative");
    expect(early).toBeGreaterThan(late * 5);
  });
});
