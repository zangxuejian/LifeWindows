import { Edit3, Info } from "lucide-react";
import { useTimelineScale } from "../hooks/useTimelineScale";
import { ageToPosition, getRelativeYearWeight, positionToAge } from "../lib/timeScale";
import { AgeTicks } from "./AgeTicks";

export function AgeController({ age, onChange, compact = false }: { age: number; onChange: (age: number) => void; compact?: boolean }) {
  const { scale } = useTimelineScale();
  const updateAge = (next: number) => onChange(Math.min(100, Math.max(0, Number.isFinite(next) ? next : 0)));
  const sliderPosition = ageToPosition(age, scale);
  const relativeYearWeight = getRelativeYearWeight(age);
  const relativeYearLabel = relativeYearWeight === null
    ? null
    : relativeYearWeight >= 2
      ? relativeYearWeight.toFixed(1)
      : relativeYearWeight.toFixed(2);

  const handleSliderKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Home") {
      event.preventDefault();
      updateAge(0);
    } else if (event.key === "End") {
      event.preventDefault();
      updateAge(100);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      updateAge(Math.round(age) - 1);
    } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      updateAge(Math.round(age) + 1);
    }
  };

  return (
    <section className={`v2-age ${compact ? "v2-age--compact" : ""}`} aria-labelledby={compact ? "detail-age-label" : "hero-age-label"}>
      <div className="v2-age__topline">
        <h2 id={compact ? "detail-age-label" : "hero-age-label"}>{compact ? "当前年龄" : "你的当前年龄"}</h2>
        <label className="v2-age__number-wrap">
          <span className="sr-only">输入当前年龄</span>
          <input
            data-testid="age-number"
            type="number"
            min="0"
            max="100"
            inputMode="numeric"
            value={age}
            onChange={(event) => updateAge(Number(event.target.value))}
            aria-label="输入当前年龄"
          />
          <span>岁</span>
          {compact ? null : <Edit3 size={15} aria-hidden="true" />}
        </label>
      </div>
      <div className="v2-age__track">
        <input
          data-testid="age-slider"
          type="range"
          min="0"
          max="10000"
          step="1"
          value={Math.round(sliderPosition * 10000)}
          aria-label="当前年龄"
          onChange={(event) => updateAge(Math.round(positionToAge(Number(event.target.value) / 10000, scale)))}
          onKeyDown={handleSliderKeyDown}
          style={{ "--v2-age-progress": `${sliderPosition * 100}%` } as React.CSSProperties}
        />
        <AgeTicks scale={scale} className="v2-age__ticks" />
      </div>
      {relativeYearLabel ? (
        <p className="v2-age__relative" data-testid="relative-year-weight" title="这是简单比例，不代表一年真实的心理感受长度。">
          <Info size={13} aria-hidden="true" />
          一年相对已有人生：{relativeYearLabel}%
        </p>
      ) : null}
      {compact ? <p className="v2-age__disclaimer">年龄只用于展示所处阶段，不构成医疗建议。</p> : null}
    </section>
  );
}
