import { getWindowRangeYears } from "../lib/windowStatus";
import type { LifeWindowV2 } from "../types";
import { featuredLifeWindows } from "./windows";

const AGE_BUCKETS = [
  { start: 0, end: 10, limit: 3 },
  { start: 10, end: 20, limit: 3 },
  { start: 20, end: 40, limit: 4 },
  { start: 40, end: 101, limit: 6 },
] as const;

function rankOverviewWindow(a: LifeWindowV2, b: LifeWindowV2): number {
  return (b.priority ?? 0) - (a.priority ?? 0) || getWindowRangeYears(a).start - getWindowRangeYears(b).start;
}

export const overviewLifeWindows = AGE_BUCKETS.flatMap(({ start, end, limit }) => (
  featuredLifeWindows
    .filter((window) => {
      const windowStart = getWindowRangeYears(window).start;
      return windowStart >= start && windowStart < end;
    })
    .sort(rankOverviewWindow)
    .slice(0, limit)
));
