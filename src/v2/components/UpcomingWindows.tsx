import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { lifeWindowsV2 } from "../data/windows";
import { formatAgeRange, getWindowEndMonths, getWindowStatus } from "../lib/windowStatus";
import { WindowIcon } from "./WindowIcon";

const horizons = [1, 3, 5] as const;

function formatWait(months: number): string {
  if (months < 12) return `${Math.max(1, Math.ceil(months))} 个月后`;
  const years = months / 12;
  return `${Number(years.toFixed(1))} 年后`;
}

export function UpcomingWindows({ age }: { age: number }) {
  const [horizon, setHorizon] = useState<(typeof horizons)[number]>(5);
  const closing = useMemo(() => {
    const currentMonths = age * 12;
    return lifeWindowsV2
      .filter((window) => {
        const end = getWindowEndMonths(window);
        const status = getWindowStatus(window, age);
        return end !== undefined && end > currentMonths && end <= currentMonths + horizon * 12 && (status === "active" || status === "closing");
      })
      .slice()
      .sort((a, b) => (getWindowEndMonths(a) ?? Infinity) - (getWindowEndMonths(b) ?? Infinity))
      .slice(0, 5);
  }, [age, horizon]);

  return (
    <section className="v2-upcoming" aria-labelledby="upcoming-heading">
      <div className="v2-section-heading v2-section-heading--stacked">
        <div><h2 id="upcoming-heading">接下来什么会关闭</h2><p>只提示时间临近的窗口，不制造焦虑。</p></div>
        <div className="v2-upcoming__tabs" role="tablist" aria-label="未来时间范围">
          {horizons.map((year) => (
            <button key={year} type="button" role="tab" aria-selected={horizon === year} className={horizon === year ? "is-active" : ""} onClick={() => setHorizon(year)}>
              {year} 年
            </button>
          ))}
        </div>
      </div>
      <div className="v2-upcoming__list" data-testid="upcoming-window-list">
        {closing.length ? closing.map((window) => {
          const waitMonths = (getWindowEndMonths(window) ?? age * 12) - age * 12;
          return (
            <Link key={window.slug} to={`/window/${window.slug}`} className="v2-support-row" data-status={getWindowStatus(window, age)}>
              <WindowIcon name={window.icon} size={19} />
              <div><strong>{window.title}</strong><span>{formatAgeRange(window)}</span></div>
              <time>{formatWait(waitMonths)}</time>
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          );
        }) : <p className="v2-empty">未来 {horizon} 年没有窗口接近关闭。</p>}
      </div>
    </section>
  );
}
