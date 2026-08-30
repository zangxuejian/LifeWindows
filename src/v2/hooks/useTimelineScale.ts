import { useContext } from "react";
import { TimelineScaleContext } from "../context/TimelineScaleContext";

export function useTimelineScale() {
  const context = useContext(TimelineScaleContext);
  if (!context) throw new Error("useTimelineScale must be used inside TimelineScaleProvider");
  return context;
}
