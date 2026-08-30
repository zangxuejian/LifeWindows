import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { lifeWindowsV2 } from "../data/windows";
import { getWindowStatus } from "../lib/windowStatus";
import { WindowCard } from "./WindowCard";

export function CurrentWindows({ age }: { age: number }) {
  const current = useMemo(() => {
    const candidates = lifeWindowsV2
      .filter((window) => {
        const status = getWindowStatus(window, age);
        return status === "active" || status === "closing";
      })
      .slice()
      .sort((a, b) => {
        const scoreA = (a.priority ?? 0) * 100 + Math.min(a.startAge, age);
        const scoreB = (b.priority ?? 0) * 100 + Math.min(b.startAge, age);
        return scoreB - scoreA;
      });
    const selected = [];
    const categories = new Set();
    for (const window of candidates) {
      if (!categories.has(window.category)) {
        selected.push(window);
        categories.add(window.category);
      }
      if (selected.length === 6) break;
    }
    for (const window of candidates) {
      if (selected.length === 6) break;
      if (!selected.includes(window)) selected.push(window);
    }
    return selected;
  }, [age]);

  return (
    <section className="v2-current" id="current" aria-labelledby="current-heading">
      <div className="v2-section-heading">
        <div><h2 id="current-heading">正在经历的窗口</h2><p><i className="is-active" />{current.length} 个优先展示</p></div>
        <Link to="/explore">查看全部 <ArrowRight size={17} aria-hidden="true" /></Link>
      </div>
      <div className="v2-current__grid" data-testid="current-window-list">
        {current.map((window) => <WindowCard key={window.slug} window={window} age={age} />)}
      </div>
    </section>
  );
}
