import { useMemo, useState } from "react";
import { categoryOptions, lifeStageOptions } from "../config";
import { featuredLifeWindows, lifeWindowsV2 } from "../data/windows";
import { getWindowRangeYears } from "../lib/windowStatus";
import type { LifeStage, LifeWindowV2, WindowCategory } from "../types";
import { WindowCard } from "./WindowCard";

interface CardLayout {
  window: LifeWindowV2;
  left: number;
  lane: number;
}

function overlapsRange(window: LifeWindowV2, start: number, end: number): boolean {
  const range = getWindowRangeYears(window);
  return range.start <= end && range.end >= start;
}

function layoutCards(windows: LifeWindowV2[], start: number, end: number): { cards: CardLayout[]; lanes: number } {
  const span = Math.max(0.25, end - start);
  const cardFootprint = span <= 3 ? 30 : span <= 15 ? 22 : span <= 35 ? 17 : 13;
  const laneEnds: number[] = [];
  const ordered = [...windows].sort((a, b) => {
    const aStart = getWindowRangeYears(a).start;
    const bStart = getWindowRangeYears(b).start;
    return aStart - bStart || (b.priority ?? 0) - (a.priority ?? 0);
  });

  const cards = ordered.map((window) => {
    const range = getWindowRangeYears(window);
    const rawLeft = ((Math.max(start, range.start) - start) / span) * 100;
    const left = Math.min(96, Math.max(4, rawLeft));
    let lane = laneEnds.findIndex((laneEnd) => left >= laneEnd);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = left + cardFootprint;
    return { window, left, lane };
  });

  return { cards, lanes: Math.max(1, laneEnds.length) };
}

function buildTicks(start: number, end: number): number[] {
  const span = end - start;
  const step = span <= 1 ? 0.25 : span <= 3 ? 0.5 : span <= 12 ? 1 : span <= 25 ? 2 : span <= 50 ? 5 : 10;
  const ticks: number[] = [];
  for (let tick = start; tick <= end + 0.001; tick += step) ticks.push(Number(tick.toFixed(2)));
  return ticks;
}

function formatTick(tick: number, span: number): string {
  if (span <= 3 && tick < 1) return `${Math.round(tick * 12)}月`;
  return Number.isInteger(tick) ? `${tick}` : tick.toFixed(1);
}

export function LifeTimeline({ age }: { age: number }) {
  const [stage, setStage] = useState<"all" | LifeStage>("all");
  const [category, setCategory] = useState<"all" | WindowCategory>("all");
  const stageOption = lifeStageOptions.find((option) => option.id === stage) ?? lifeStageOptions[0];
  const { startYear, endYear } = stageOption;

  const visibleWindows = useMemo(() => {
    const pool = stage === "all" && category === "all" ? featuredLifeWindows : lifeWindowsV2;
    return pool.filter((window) => {
      const categoryMatches = category === "all" || window.category === category;
      return categoryMatches && overlapsRange(window, startYear, endYear);
    });
  }, [category, endYear, stage, startYear]);

  const layout = useMemo(
    () => layoutCards(visibleWindows, startYear, endYear),
    [endYear, startYear, visibleWindows],
  );
  const ticks = useMemo(() => buildTicks(startYear, endYear), [endYear, startYear]);
  const span = endYear - startYear;
  const agePosition = ((age - startYear) / Math.max(0.25, span)) * 100;
  const ageInRange = age >= startYear && age <= endYear;

  return (
    <section className="v2-timeline" id="timeline" aria-labelledby="timeline-heading">
      <div className="v2-timeline__heading">
        <div>
          <h2 id="timeline-heading">人生时间轴</h2>
          <p>每一张卡片，都是一段有边界的机会。</p>
        </div>
        <p className="v2-timeline__hint">左右滑动，查看完整人生</p>
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
        <span className="is-possible"><i />仍可进行</span>
      </div>

      <div className="v2-timeline__viewport" tabIndex={0} aria-label="可横向滚动的人生窗口卡片时间轴">
        <div className="v2-timeline__canvas" style={{ "--timeline-height": `${84 + layout.lanes * 94}px` } as React.CSSProperties} data-testid="timeline-canvas">
          <div className="v2-timeline__ruler" aria-hidden="true">
            {ticks.map((tick) => <span key={tick} style={{ left: `${((tick - startYear) / span) * 100}%` }}>{formatTick(tick, span)}</span>)}
          </div>
          <div className="v2-timeline__grid" aria-hidden="true">
            {ticks.map((tick) => <i key={tick} style={{ left: `${((tick - startYear) / span) * 100}%` }} />)}
          </div>
          {ageInRange ? <div className="v2-timeline__now" style={{ left: `${agePosition}%` }} data-testid="current-age-line"><span>{age}</span></div> : null}
          {layout.cards.map(({ window, left, lane }) => (
            <WindowCard key={window.slug} window={window} age={age} compact style={{ left: `clamp(98px, ${left}%, calc(100% - 98px))`, top: `${62 + lane * 94}px` }} />
          ))}
          {layout.cards.length === 0 ? <p className="v2-timeline__empty">这一视图暂无匹配窗口，试试其他主题。</p> : null}
        </div>
      </div>
      <p className="v2-timeline__caption">当前聚焦：{stageOption.label} · {categoryOptions.find((item) => item.id === category)?.label}</p>
    </section>
  );
}
