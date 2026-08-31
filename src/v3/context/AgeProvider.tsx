import { useCallback, useMemo, useState, type ReactNode } from "react";
import { clampAgeMonths } from "../lib/age";
import { V3AgeContext } from "./AgeContext";

const STORAGE_KEY = "life-windows-v3-age-months";
const DEFAULT_AGE_MONTHS = 33 * 12;

function getInitialAge(): number {
  if (typeof window === "undefined") return DEFAULT_AGE_MONTHS;
  const ageParam = new URLSearchParams(window.location.search).get("age");
  if (ageParam !== null) {
    const ageYears = Number(ageParam);
    if (Number.isFinite(ageYears)) return clampAgeMonths(ageYears * 12);
  }

  const savedValue = window.localStorage.getItem(STORAGE_KEY);
  if (savedValue === null) return DEFAULT_AGE_MONTHS;
  const saved = Number(savedValue);
  return Number.isFinite(saved) ? clampAgeMonths(saved) : DEFAULT_AGE_MONTHS;
}

export function V3AgeProvider({ children }: { children: ReactNode }) {
  const [currentAgeMonths, setAge] = useState(getInitialAge);

  const setCurrentAgeMonths = useCallback((months: number) => {
    const nextAge = clampAgeMonths(months);
    setAge(nextAge);
    window.localStorage.setItem(STORAGE_KEY, String(nextAge));
  }, []);

  const value = useMemo(
    () => ({ currentAgeMonths, setCurrentAgeMonths }),
    [currentAgeMonths, setCurrentAgeMonths],
  );

  return <V3AgeContext.Provider value={value}>{children}</V3AgeContext.Provider>;
}
