import type { CSSProperties } from "react";
import { MAX_AGE_MONTHS, formatCurrentAge } from "../lib/age";

interface AgeControllerProps {
  currentAgeMonths: number;
  onChange: (months: number) => void;
  compact?: boolean;
}

export function AgeController({ currentAgeMonths, onChange, compact = false }: AgeControllerProps) {
  const display = formatCurrentAge(currentAgeMonths);

  return (
    <section className={compact ? "v3-age v3-age--compact" : "v3-age"} aria-label="你的当前年龄">
      <div className="v3-age__readout">
        <span>你的当前年龄</span>
        <output htmlFor={compact ? "v3-age-slider-detail" : "v3-age-slider"}>
          <strong>{display.value}</strong>
          <small>{display.unit}</small>
        </output>
      </div>
      <div className="v3-age__control">
        <div className="v3-age__slider-row">
          <span aria-hidden="true">0</span>
          <input
            id={compact ? "v3-age-slider-detail" : "v3-age-slider"}
            type="range"
            min="0"
            max={MAX_AGE_MONTHS}
            step="1"
            value={currentAgeMonths}
            aria-label="当前年龄"
            aria-valuetext={`${display.value}${display.unit}`}
            style={{ "--v3-age-progress": `${(currentAgeMonths / MAX_AGE_MONTHS) * 100}%` } as CSSProperties}
            onChange={(event) => onChange(Number(event.currentTarget.value))}
          />
          <span aria-hidden="true">100</span>
        </div>
        {!compact ? <p>拖动年龄，看看哪些窗口仍在经过，又有哪些正在离开。</p> : null}
      </div>
    </section>
  );
}
