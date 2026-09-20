import { useId, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { MAX_AGE_MONTHS, formatCurrentAge } from "../lib/age";

interface AgeControllerProps { currentAgeMonths: number; onChange: (months: number) => void; compact?: boolean }

export function AgeController({ currentAgeMonths, onChange, compact = false }: AgeControllerProps) {
  const display = formatCurrentAge(currentAgeMonths);
  const id = useId();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const entryTrigger = useRef<HTMLButtonElement>(null);
  function closeEntry() { setEditing(false); entryTrigger.current?.focus(); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const age = Number(draft);
    if (draft.trim() && Number.isFinite(age) && age >= 0 && age <= 100) { onChange(age * 12); closeEntry(); }
  }
  return <section className={compact ? "v3-age v3-age--compact" : "v3-age"} aria-label="你的当前年龄">
    <div className="v3-age__readout"><span>你的当前年龄</span><output htmlFor={`${id}-slider`}><strong>{display.value}</strong><small>{display.unit}</small></output></div>
    <div className="v3-age__control">
      <div className="v3-age__slider-row"><span aria-hidden="true">0</span><input id={`${id}-slider`} type="range" min="0" max={MAX_AGE_MONTHS} step="1" value={currentAgeMonths} aria-label="当前年龄" aria-valuetext={`${Math.floor(currentAgeMonths / 12)}岁${currentAgeMonths % 12}个月`} style={{ "--v3-age-progress": `${currentAgeMonths / MAX_AGE_MONTHS * 100}%` } as CSSProperties} onChange={(event) => onChange(Number(event.currentTarget.value))} /><span aria-hidden="true">100</span></div>
      {!compact ? <p>拖动年龄，看见窗口如何经过。也可以直接输入。</p> : null}
      <div className="v3-age-tools"><span>看看</span>{[6, 18, 33, 60].map((age) => <button type="button" key={age} aria-pressed={currentAgeMonths === age * 12} onClick={() => onChange(age * 12)}>{age} 岁</button>)}<button ref={entryTrigger} type="button" aria-expanded={editing} aria-controls={`${id}-entry`} onClick={() => { setDraft(String(Number((currentAgeMonths / 12).toFixed(2)))); setEditing((value) => !value); }}>{editing ? "取消" : "输入年龄"}</button></div>
      {editing ? <form id={`${id}-entry`} className="v3-age-entry" onSubmit={submit}><label className="sr-only" htmlFor={`${id}-number`}>输入年龄（岁）</label><input id={`${id}-number`} type="number" min="0" max="100" step="any" required inputMode="decimal" autoFocus value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); closeEntry(); } }} /><span>岁</span><button type="submit">确定</button></form> : null}
    </div>
  </section>;
}
