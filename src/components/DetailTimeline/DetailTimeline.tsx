import type { LifeWindow } from "../../types/window";

const ticks = Array.from({ length: 11 }, (_, index) => index * 10);

function rangeStyle(start = 0, end = 100) {
  return {
    left: `${Math.max(0, Math.min(100, start))}%`,
    width: `${Math.max(1, Math.min(100, end) - Math.max(0, start))}%`,
  };
}

export function DetailTimeline({ window, age }: { window: LifeWindow; age: number }) {
  const goldenStart = window.goldenStartAge;
  const goldenEnd = window.goldenEndAge;
  const typicalStart = window.typicalStartAge ?? window.hardStartAge;
  const typicalEnd = window.typicalEndAge ?? window.hardEndAge;

  return (
    <div className="detail-timeline" aria-label={`${window.title}的人生时间轴`}>
      <div className="detail-timeline__axis">
        {ticks.map((tick) => (
          <span key={tick} style={{ left: `${tick}%` }}>{tick}</span>
        ))}
      </div>
      <div
        className="detail-timeline__age"
        style={{ left: `calc(${age}% + ${180 - age * 1.8}px)` }}
        aria-hidden="true"
      >
        <span>{age} 岁</span>
        <i />
        <small>你</small>
      </div>
      {goldenStart !== undefined && goldenEnd !== undefined ? (
        <div className="detail-timeline__row">
          <span className="detail-timeline__row-label">
            黄金窗口 <small>{goldenStart}—{goldenEnd} 岁</small>
          </span>
          <span className="detail-timeline__track">
            <i className="detail-timeline__bar detail-timeline__bar--golden" style={rangeStyle(goldenStart, goldenEnd)} />
            {window.canDoAfterWindow ? (
              <i className="detail-timeline__continue" style={rangeStyle(goldenEnd, 100)} />
            ) : null}
          </span>
        </div>
      ) : null}
      {typicalStart !== undefined ? (
        <div className="detail-timeline__row">
          <span className="detail-timeline__row-label">
            {window.alwaysOpen ? "开放阶段" : "常见阶段"}
            <small>{window.alwaysOpen ? `${typicalStart} 岁起` : `${typicalStart}—${typicalEnd} 岁`}</small>
          </span>
          <span className="detail-timeline__track">
            <i
              className="detail-timeline__bar detail-timeline__bar--typical"
              style={rangeStyle(typicalStart, window.alwaysOpen ? 100 : typicalEnd)}
            />
            {!window.alwaysOpen && window.canDoAfterWindow && typicalEnd !== undefined ? (
              <i className="detail-timeline__continue" style={rangeStyle(typicalEnd, 100)} />
            ) : null}
          </span>
        </div>
      ) : null}
    </div>
  );
}
