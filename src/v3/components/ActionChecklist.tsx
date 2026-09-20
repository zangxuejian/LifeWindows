import { useState } from "react";
import { CheckCheck } from "lucide-react";

export function ActionChecklist({ id, actions }: { id: string; actions: string[] }) {
  const storageKey = `life-windows-v3-actions:${id}`;
  const [checked, setChecked] = useState<string[]>(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      return Array.isArray(saved) ? Array.from(new Set(saved.filter((value): value is string => typeof value === "string" && actions.includes(value)))) : [];
    } catch { return []; }
  });
  const [sessionOnly, setSessionOnly] = useState(false);
  function update(next: string[]) {
    setChecked(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { setSessionOnly(true); }
  }
  return <section className="v3-actions" aria-labelledby="action-heading">
    <div className="v3-actions__heading"><div><p className="v3-eyebrow">ONE SMALL STEP</p><h2 id="action-heading">从一件小事开始</h2></div><span aria-live="polite"><CheckCheck size={18} aria-hidden="true" />{checked.length} / {actions.length}</span></div>
    <p>选择适合你的一步，完成后勾选。{sessionOnly ? "浏览器未允许保存，当前进度仅在本次页面保留。" : "进度仅保存在这个浏览器。"}</p>
    <ul>{actions.map((action, index) => <li key={action}><label><input type="checkbox" checked={checked.includes(action)} onChange={() => update(checked.includes(action) ? checked.filter((item) => item !== action) : [...checked, action])} /><span className="v3-actions__number" aria-hidden="true">0{index + 1}</span><span>{action}</span></label></li>)}</ul>
    {checked.length > 0 ? <button type="button" className="v3-text-link" onClick={() => update([])}>重置这份清单</button> : null}
  </section>;
}
