import { createContext } from "react";
import type { TimelineScale } from "../lib/timeScale";

export interface TimelineScaleContextValue {
  scale: TimelineScale;
  setScale: (scale: TimelineScale) => void;
  introVisible: boolean;
}

export const TimelineScaleContext = createContext<TimelineScaleContextValue | null>(null);
