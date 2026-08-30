import { useCallback, useState } from "react";
import { clampAge } from "../lib/age";

const STORAGE_KEY = "life-windows:age:v1";

function readInitialAge(): number {
  if (typeof window === "undefined") return 30;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return 30;
    const parsed = JSON.parse(value) as { age?: number };
    return clampAge(parsed.age ?? 30);
  } catch {
    return 30;
  }
}

export function usePersistentAge() {
  const [age, setAgeState] = useState(readInitialAge);

  const setAge = useCallback((nextAge: number) => {
    const safeAge = clampAge(nextAge);
    setAgeState(safeAge);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ age: safeAge }));
    } catch {
      // The UI remains usable when storage is unavailable.
    }
  }, []);

  return { age, setAge };
}
