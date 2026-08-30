import { Edit3 } from "lucide-react";
import { MAX_AGE, MIN_AGE } from "../../lib/age";

interface AgeSliderProps {
  age: number;
  onChange: (age: number) => void;
  compact?: boolean;
}

export function AgeSlider({ age, onChange, compact = false }: AgeSliderProps) {
  return (
    <section className={`age-slider ${compact ? "age-slider--compact" : ""}`} aria-labelledby="age-question">
      <h2 id="age-question" className="age-slider__question">
        你今年几岁？
      </h2>
      <label className="age-slider__value-wrap">
        <span className="sr-only">输入当前年龄</span>
        <input
          className="age-slider__number"
          type="number"
          min={MIN_AGE}
          max={MAX_AGE}
          inputMode="numeric"
          value={age}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <Edit3 className="age-slider__edit" size={compact ? 16 : 20} aria-hidden="true" />
      </label>
      <div className="age-slider__track-wrap">
        <span aria-hidden="true">0</span>
        <input
          className="age-slider__range"
          type="range"
          min={MIN_AGE}
          max={MAX_AGE}
          step="1"
          value={age}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label="当前年龄"
          style={{ "--age-progress": `${age}%` } as React.CSSProperties}
        />
        <span aria-hidden="true">100</span>
      </div>
      <p className="age-slider__progress">
        你的人生已经走过 <strong>{age}%</strong>
      </p>
    </section>
  );
}
