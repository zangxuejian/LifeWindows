import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { TimelineScale } from "../lib/timeScale";
import { TimelineScaleContext } from "./TimelineScaleContext";

const INTRO_STORAGE_KEY = "relative-time-intro-seen";

export function TimelineScaleProvider({ children }: { children: ReactNode }) {
  const [scale, updateScale] = useState<TimelineScale>("linear");
  const [introVisible, setIntroVisible] = useState(false);
  const introTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (introTimer.current !== null) window.clearTimeout(introTimer.current);
  }, []);

  const setScale = useCallback((nextScale: TimelineScale) => {
    updateScale(nextScale);
    if (nextScale !== "relative" || window.localStorage.getItem(INTRO_STORAGE_KEY)) return;

    window.localStorage.setItem(INTRO_STORAGE_KEY, "true");
    setIntroVisible(true);
    if (introTimer.current !== null) window.clearTimeout(introTimer.current);
    introTimer.current = window.setTimeout(() => setIntroVisible(false), 1800);
  }, []);

  const value = useMemo(() => ({ scale, setScale, introVisible }), [introVisible, scale, setScale]);
  return <TimelineScaleContext.Provider value={value}>{children}</TimelineScaleContext.Provider>;
}
