import { ArrowUpRight } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { lifeWindowsV2 } from "../data/windows";
import { formatAgeRange, getWindowLabel, getWindowStatus } from "../lib/windowStatus";
import { WindowIcon } from "./WindowIcon";

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
      if (selected.length === 5) break;
    }
    return selected;
  }, [age]);

  return (
    <section className="v2-current" id="current" aria-labelledby="current-heading">
      <div className="v2-section-heading">
        <div><h2 id="current-heading">你现在还能做什么</h2><p><i className="is-active" />{current.length} 个摘要</p></div>
        <Link to="/explore">查看全部 <ArrowUpRight size={15} aria-hidden="true" /></Link>
      </div>
      <div className="v2-current__list" data-testid="current-window-list">
        {current.map((window) => {
          const status = getWindowStatus(window, age);
          return (
            <Link key={window.slug} to={`/window/${window.slug}`} className="v2-support-row" data-status={status}>
              <WindowIcon name={window.icon} size={19} />
              <div><strong>{window.title}</strong><span>{formatAgeRange(window)}</span></div>
              <em>{getWindowLabel(window, age)}</em>
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
