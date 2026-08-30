import { useMemo, useState } from "react";
import { categoryOptions, lifeStageOptions } from "../config";
import { overviewLifeWindows } from "../data/overviewWindows";
import { lifeWindowsV2 } from "../data/windows";
import { useTimelineScale } from "../hooks/useTimelineScale";
import { ageToRangePosition, getAgeTicks } from "../lib/timeScale";
import type { TimelineScale } from "../lib/timeScale";
import { getWindowRangeYears } from "../lib/windowStatus";
import type { LifeStage, LifeWindowV2, WindowCategory } from "../types";
import { AgeTicks } from "./AgeTicks";
import { TimelineScaleToggle } from "./TimelineScaleToggle";
import { WindowCard } from "./WindowCard";

interface CardLayout {
  window: LifeWindowV2;
  left: number;
  width: number;
  lane: number;
}

function overlapsRange(window: LifeWindowV2, start: number, end: number): boolean {
  const range = getWindowRangeYears(window);
  return range.start <= end && range.end >= start;
}

function layoutCards(
  windows: LifeWindowV2[],
  start: number,
  end: number,
  scale: TimelineScale,
): { cards: CardLayout[]; lanes: number } {
  const laneEnds: number[] = [];
  const ordered = [...windows].sort((a, b) => {
    const aStart = ageToRangePosition(getWindowRangeYears(a).start, start, end, scale);
    const bStart = ageToRangePosition(getWindowRangeYears(b).start, start, end, scale);
    return aStart - bStart || (b.priority ?? 0) - (a.priority ?? 0);
  });

  const cards = ordered.map((window) => {
    const range = getWindowRangeYears(window);
    const left = ageToRangePosition(Math.max(start, range.start), start, end, scale) * 100;
    const right = ageToRangePosition(Math.min(end, range.end), start, end, scale) * 100;
    const mappedSpan = Math.max(0.5, right - left);
    const width = Math.round(Math.min(344, Math.max(222, 205 + mappedSpan * 4.2)));
    const footprint = Math.max(18.5, width / 12.4) + 1.5;
    let lane = laneEnds.findIndex((laneEnd) => left >= laneEnd);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = left + footprint;
    return { window, left, width, lane };
  });

  return { cards, lanes: Math.max(1, laneEnds.length) };
}

export function LifeTimeline({ age }: { age: number }) {
  const { scale } = useTimelineScale();
  const [stage, setStage] = useState<"all" | LifeStage>("all");
  const [category, setCategory] = useState<"all" | WindowCategory>("all");
  const stageOption = lifeStageOptions.find((option) => option.id === stage) ?? lifeStageOptions[0];
  const { startYear, endYear } = stageOption;

  const visibleWindows = useMemo(() => {
    const pool = stage === "all" && category === "all" ? overviewLifeWindows : lifeWindowsV2;
    return pool.filter((window) => {
      const categoryMatches = category === "all" || window.category === category;
      return categoryMatches && overlapsRange(window, startYear, endYear);
    });
  }, [category, endYear, stage, startYear]);

  const layout = useMemo(
    () => layoutCards(visibleWindows, startYear, endYear, scale),
    [endYear, scale, startYear, visibleWindows],
  );
  const ticks = useMemo(() => getAgeTicks(scale, startYear, endYear), [endYear, scale, startYear]);
  const agePosition = ageToRangePosition(age, startYear, endYear, scale) * 100;
  const ageInRange = age >= startYear && age <= endYear;

  return (
    <section className="v2-timeline" id="timeline" aria-labelledby="timeline-heading">
      <div className="v2-timeline__heading">
        <div>
          <span>THE LIFE MAP</span>
          <h2 id="timeline-heading">人生时间轴</h2>
          <p>每一张卡片，都是一段有边界的机会。</p>
        </div>
        <div className="v2-timeline__heading-actions">
          <TimelineScaleToggle />
          <p className="v2-timeline__hint">左右滑动，查看完整人生</p>
        </div>
      </div>

      <div className="v2-stage-tabs" role="tablist" aria-label="按人生阶段聚焦">
        {lifeStageOptions.map((option) => (
          <button key={option.id} type="button" role="tab" aria-selected={stage === option.id} className={stage === option.id ? "is-active" : ""} onClick={() => setStage(option.id)}>
            <span>{option.label}</span><small>{option.shortLabel}</small>
          </button>
        ))}
      </div>

      <div className="v2-category-tabs" role="tablist" aria-label="按主题筛选">
        {categoryOptions.map((option) => (
          <button key={option.id} type="button" role="tab" aria-selected={category === option.id} className={category === option.id ? "is-active" : ""} onClick={() => setCategory(option.id)}>{option.label}</button>
        ))}
      </div>

      <div className="v2-legend" aria-label="窗口状态图例">
        <span className="is-missed"><i />已错过</span>
        <span className="is-active"><i />正在经历</span>
        <span className="is-closing"><i />即将关闭</span>
        <span className="is-future"><i />未来开启</span>
        <span className="is-possible"><i />黄金期已过 · 仍可进行</span>
      </div>

      <div className="v2-timeline__viewport" tabIndex={0} aria-label="可横向滚动的人生窗口卡片时间轴">
        <div
          className="v2-timeline__canvas"
          style={{ "--timeline-height": `${132 + layout.lanes * 112}px` } as React.CSSProperties}
          data-testid="timeline-canvas"
          data-scale={scale}
        >
          <AgeTicks scale={scale} startAge={startYear} endAge={endYear} className="v2-timeline__ruler" />
          <div className="v2-timeline__grid" aria-hidden="true">
            {ticks.map((tick) => <i key={tick} style={{ left: `${ageToRangePosition(tick, startYear, endYear, scale) * 100}%` }} />)}
          </div>
          {ageInRange ? <div className="v2-timeline__now" style={{ left: `${agePosition}%` }} data-testid="current-age-line"><span>{age}</span></div> : null}
          {layout.cards.map(({ window, left, width, lane }) => (
            <WindowCard
              key={window.slug}
              window={window}
              age={age}
              compact
              style={{
                left: `clamp(24px, ${left}%, calc(100% - ${width + 24}px))`,
                top: `${76 + lane * 112}px`,
                width: `${width}px`,
              }}
            />
          ))}
          {layout.cards.length === 0 ? <p className="v2-timeline__empty">这一视图暂无匹配窗口，试试其他主题。</p> : null}
        </div>
      </div>
      <p className="v2-timeline__caption">当前聚焦：{stageOption.label} · {categoryOptions.find((item) => item.id === category)?.label} · {scale === "linear" ? "客观年龄" : "时间压缩视图"}</p>
    </section>
  );
}
