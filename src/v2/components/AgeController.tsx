import { Edit3 } from "lucide-react";

export function AgeController({ age, onChange, compact = false }: { age: number; onChange: (age: number) => void; compact?: boolean }) {
  const updateAge = (next: number) => onChange(Math.min(100, Math.max(0, Number.isFinite(next) ? next : 0)));

  return (
    <section className={`v2-age ${compact ? "v2-age--compact" : ""}`} aria-labelledby={compact ? "detail-age-label" : "hero-age-label"}>
      <div className="v2-age__topline">
        <h2 id={compact ? "detail-age-label" : "hero-age-label"}>{compact ? "当前年龄" : "你今年几岁？"}</h2>
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
          max="100"
          step="1"
          value={age}
          aria-label="当前年龄"
          onChange={(event) => updateAge(Number(event.target.value))}
          style={{ "--v2-age-progress": `${age}%` } as React.CSSProperties}
        />
        <div className="v2-age__ticks" aria-hidden="true">
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((tick) => <span key={tick}>{tick}</span>)}
        </div>
      </div>
      {compact ? <p>年龄只用于展示所处阶段，不构成医疗建议。</p> : null}
    </section>
  );
}
