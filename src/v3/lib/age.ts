import type { AgePoint, ExpiringLifeWindow } from "../types";

export const MONTHS_PER_YEAR = 12;
export const MAX_AGE_MONTHS = 100 * MONTHS_PER_YEAR;

function parseFiniteNumber(value: string | null): number | null {
  if (value === null || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Parses the public `age` query parameter, whose unit is years. */
export function parseAgeQuery(search: string): number | null {
  const years = parseFiniteNumber(new URLSearchParams(search).get("age"));
  return years === null ? null : clampAgeMonths(years * MONTHS_PER_YEAR);
}

/** Parses the persisted value, whose unit is months. */
export function parseStoredAge(value: string | null): number | null {
  const months = parseFiniteNumber(value);
  return months === null ? null : clampAgeMonths(months);
}

export function agePointToMonths(point: AgePoint): number {
  return point.unit === "year" ? Math.round(point.value * MONTHS_PER_YEAR) : Math.round(point.value);
}

export function getWindowBounds(window: ExpiringLifeWindow) {
  return {
    startMonths: agePointToMonths(window.start),
    endMonths: agePointToMonths(window.end),
  };
}

export function clampAgeMonths(months: number): number {
  if (!Number.isFinite(months)) return 0;
  return Math.min(MAX_AGE_MONTHS, Math.max(0, Math.round(months)));
}

export function formatAge(months: number, options?: { compact?: boolean }): string {
  const safeMonths = clampAgeMonths(months);
  if (safeMonths < 36) {
    return `${safeMonths}个月`;
  }

  const years = safeMonths / MONTHS_PER_YEAR;
  if (Number.isInteger(years)) {
    return `${years}岁`;
  }

  return `${years.toFixed(options?.compact ? 1 : 1)}岁`;
}

export function formatAgeRange(window: ExpiringLifeWindow): string {
  const { startMonths, endMonths } = getWindowBounds(window);

  if (endMonths <= 36) {
    return `${startMonths}–${endMonths}个月`;
  }

  const start = startMonths / MONTHS_PER_YEAR;
  const end = endMonths / MONTHS_PER_YEAR;
  const startLabel = Number.isInteger(start) ? String(start) : start.toFixed(1);
  const endLabel = Number.isInteger(end) ? String(end) : end.toFixed(1);
  return `${startLabel}–${endLabel}岁`;
}

export function formatCurrentAge(months: number): { value: string; unit: string } {
  if (months < 36) {
    return { value: String(months), unit: "个月" };
  }

  const years = months / MONTHS_PER_YEAR;
  return { value: Number.isInteger(years) ? String(years) : years.toFixed(1), unit: "岁" };
}
