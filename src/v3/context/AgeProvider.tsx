import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clampAgeMonths, parseAgeQuery, parseStoredAge } from "../lib/age";
import { V3AgeContext } from "./AgeContext";

const STORAGE_KEY = "life-windows-v3-age-months";
const DEFAULT_AGE_MONTHS = 33 * 12;

function readStoredAge(): number | null {
  try {
    return parseStoredAge(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function persistAge(months: number): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(months));
  } catch {
    // Storage can be unavailable in private or policy-restricted contexts.
  }
}

export function V3AgeProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const locationRef = useRef(location);
  locationRef.current = location;
  const replaceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locationAgeParam = new URLSearchParams(location.search).get("age");
  const [currentAgeMonths, setAge] = useState(() => {
    const queryAge = parseAgeQuery(location.search);
    return queryAge ?? readStoredAge() ?? DEFAULT_AGE_MONTHS;
  });

  useEffect(() => {
    if (locationAgeParam === null) return;
    const queryAge = parseAgeQuery(`?age=${locationAgeParam}`);
    if (queryAge === null) return;

    if (replaceTimerRef.current !== null) {
      clearTimeout(replaceTimerRef.current);
      replaceTimerRef.current = null;
    }
    setAge(queryAge);
    persistAge(queryAge);
  }, [location.pathname, locationAgeParam]);

  useEffect(
    () => () => {
      if (replaceTimerRef.current !== null) clearTimeout(replaceTimerRef.current);
    },
    [],
  );

  const setCurrentAgeMonths = useCallback((months: number) => {
    const nextAge = clampAgeMonths(months);
    setAge(nextAge);
    persistAge(nextAge);

    if (replaceTimerRef.current !== null) clearTimeout(replaceTimerRef.current);
    replaceTimerRef.current = setTimeout(() => {
      const latestLocation = locationRef.current;
      const params = new URLSearchParams(latestLocation.search);
      params.set("age", String(nextAge / 12));
      replaceTimerRef.current = null;
      navigate(
        { pathname: latestLocation.pathname, search: `?${params.toString()}`, hash: latestLocation.hash },
        { replace: true },
      );
    }, 150);
  }, [navigate]);

  const value = useMemo(
    () => ({ currentAgeMonths, setCurrentAgeMonths }),
    [currentAgeMonths, setCurrentAgeMonths],
  );

  return <V3AgeContext.Provider value={value}>{children}</V3AgeContext.Provider>;
}
