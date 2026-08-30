import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { lifeWindows } from "../../data/windows";
import { getWindowRange, getWindowStatus } from "../../lib/windowStatus";
import { categoryLabels, type LifeWindow, type WindowCategory } from "../../types/window";
import type { CategorySelection } from "../CategoryFilter/CategoryFilter";

interface LifeTimelineProps {
  age: number;
  category: CategorySelection;
}

const categoryOrder = Object.keys(categoryLabels) as WindowCategory[];
const ticks = Array.from({ length: 11 }, (_, index) => index * 10);

function TimelineRow({ window, age }: { window: LifeWindow; age: number }) {
  const status = getWindowStatus(window, age);
  const { start, end } = getWindowRange(window);
  const safeStart = Math.max(0, Math.min(100, start));
  const safeEnd = Math.max(safeStart, Math.min(100, end));
  const width = Math.max(1.2, safeEnd - safeStart);
  const hasContinuation = window.canDoAfterWindow && !window.alwaysOpen && safeEnd < 100;

  return (
    <div className={`timeline-row timeline-row--${status.status}`}>
      <Link className="timeline-label" to={`/window/${window.slug}`}>
        <span>{window.shortTitle ?? window.title}</span>
        <small>{categoryLabels[window.category]}</small>
      </Link>
      <Link
        className="timeline-track"
        to={`/window/${window.slug}`}
        aria-label={`${window.title}，${status.label}`}
      >
        <span
          className={`timeline-span timeline-span--${status.status}`}
          style={{ left: `${safeStart}%`, width: `${width}%` }}
        >
          <span className="timeline-span__start">{safeStart}</span>
          {safeEnd < 100 ? <span className="timeline-span__end">{safeEnd}</span> : null}
        </span>
        {hasContinuation ? (
          <span
            className="timeline-continuation"
            style={{ left: `${safeEnd}%`, width: `${100 - safeEnd}%` }}
            aria-hidden="true"
          />
        ) : null}
      </Link>
    </div>
  );
}

export function LifeTimeline({ age, category }: LifeTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const grouped = useMemo(() => {
    const visible = lifeWindows.filter(
      (window) => window.featured && (category === "all" || window.category === category),
    );
    return categoryOrder
      .map((categoryName) => ({
        category: categoryName,
        windows: visible.filter((window) => window.category === categoryName),
      }))
      .filter((group) => group.windows.length > 0);
  }, [category]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element || element.scrollWidth <= element.clientWidth) return;
    const labelWidth = window.matchMedia("(max-width: 640px)").matches ? 150 : 224;
    const trackWidth = element.scrollWidth - labelWidth;
    const agePosition = labelWidth + trackWidth * (age / 100);
    const target = Math.max(0, agePosition - element.clientWidth * 0.56);
    element.scrollTo({ left: target, behavior: "smooth" });
  }, [age, category]);

  return (
    <section className="life-timeline" aria-labelledby="timeline-title">
      <div className="timeline-title-row">
        <h2 id="timeline-title">人生时间轴</h2>
        <p>左右滑动查看完整人生</p>
      </div>
      <div className="timeline-scroll" ref={scrollRef} tabIndex={0} aria-label="可横向滚动的人生时间轴">
        <div className="timeline-canvas">
          <div className="current-age-layer" aria-hidden="true">
            <span className="current-age-line" style={{ left: `${age}%` }}>
              <span className="current-age-label">{age} 岁</span>
              <span className="current-age-square" />
            </span>
          </div>
          <div className="timeline-axis-row">
            <div className="timeline-label timeline-axis-label">年龄</div>
            <div className="timeline-axis">
              {ticks.map((tick) => (
                <span key={tick} style={{ left: `${tick}%` }}>
                  {tick}
                </span>
              ))}
            </div>
          </div>
          {grouped.map((group) => (
            <div className="timeline-group" key={group.category}>
              <div className="timeline-group__heading">
                <span className="timeline-label">{categoryLabels[group.category]}</span>
                <span aria-hidden="true" />
              </div>
              {group.windows.map((window) => (
                <TimelineRow window={window} age={age} key={window.id} />
              ))}
            </div>
          ))}
          <div className="timeline-legend" aria-label="时间轴图例">
            <span><i className="legend-swatch legend-swatch--closed" />窗口已关闭</span>
            <span><i className="legend-swatch legend-swatch--active" />正在开放</span>
            <span><i className="legend-swatch legend-swatch--closing" />即将关闭</span>
            <span><i className="legend-swatch legend-swatch--passed" />黄金期已过 · 仍然可以</span>
            <span><i className="legend-swatch legend-swatch--future" />未来开启</span>
            <span><i className="legend-swatch legend-swatch--open" />长期开放</span>
          </div>
        </div>
      </div>
    </section>
  );
}
