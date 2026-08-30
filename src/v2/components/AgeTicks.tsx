import { ageToRangePosition, getAgeTicks } from "../lib/timeScale";
import type { TimelineScale } from "../lib/timeScale";

function formatTick(tick: number, span: number): string {
  if (span <= 1 && tick < 1) return `${Math.round(tick * 12)}月`;
  if (Number.isInteger(tick)) return `${tick}`;
  return tick.toFixed(span <= 1 ? 2 : 1).replace(/0+$/, "").replace(/\.$/, "");
}

export function AgeTicks({
  scale,
  startAge = 0,
  endAge = 100,
  className = "",
}: {
  scale: TimelineScale;
  startAge?: number;
  endAge?: number;
  className?: string;
}) {
  const ticks = getAgeTicks(scale, startAge, endAge);
  const span = endAge - startAge;

  return (
    <div className={className} aria-hidden="true">
      {ticks.map((tick) => (
        <span
          key={tick}
          data-age-tick={tick}
          style={{ "--tick-position": `${ageToRangePosition(tick, startAge, endAge, scale) * 100}%` } as React.CSSProperties}
        >
          {formatTick(tick, span)}
        </span>
      ))}
    </div>
  );
}
