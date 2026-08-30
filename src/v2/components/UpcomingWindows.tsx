import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { lifeWindowsV2 } from "../data/windows";
import { formatAgeRange, getWindowStartMonths, getWindowStatus } from "../lib/windowStatus";
import { WindowIcon } from "./WindowIcon";

const horizons = [1, 3, 5] as const;

export function UpcomingWindows({ age }: { age: number }) {
  const [horizon, setHorizon] = useState<(typeof horizons)[number]>(5);
  const upcoming = useMemo(() => {
    const currentMonths = age * 12;
    return lifeWindowsV2
      .filter((window) => {
        const start = getWindowStartMonths(window);
        return getWindowStatus(window, age) === "future" && start <= currentMonths + horizon * 12;
      })
      .slice()
      .sort((a, b) => getWindowStartMonths(a) - getWindowStartMonths(b))
      .slice(0, 6);
  }, [age, horizon]);

  return (
    <section className="v2-upcoming" aria-labelledby="upcoming-heading">
      <div className="v2-section-heading v2-section-heading--stacked">
        <div>
          <h2 id="upcoming-heading">接下来会开启什么</h2>
          <p>按未来时间距离查看，不把人生排成必做清单。</p>
        </div>
        <div className="v2-upcoming__tabs" role="tablist" aria-label="未来时间范围">
          {horizons.map((year) => (
            <button key={year} type="button" role="tab" aria-selected={horizon === year} className={horizon === year ? "is-active" : ""} onClick={() => setHorizon(year)}>
              {year} 年
            </button>
          ))}
        </div>
      </div>
      <div className="v2-upcoming__list" data-testid="upcoming-window-list">
        {upcoming.length ? upcoming.map((window) => {
          const waitMonths = getWindowStartMonths(window) - age * 12;
          const wait = waitMonths < 12 ? `${Math.ceil(waitMonths)} 个月后` : `${Number((waitMonths / 12).toFixed(1))} 年后`;
          return (
            <Link key={window.slug} to={`/window/${window.slug}`} className="v2-upcoming__row">
              <WindowIcon name={window.icon} size={23} />
              <div>
                <strong>{window.title}</strong>
                <span>{formatAgeRange(window)} · {window.summary}</span>
              </div>
              <time>{wait}</time>
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          );
        }) : <p className="v2-empty">未来 {horizon} 年没有新窗口开启，但长期开放的窗口仍在。</p>}
      </div>
    </section>
  );
}
