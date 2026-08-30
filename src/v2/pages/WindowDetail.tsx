import { ArrowLeft, ArrowRight, CheckCircle2, Info, MapPin, Stethoscope } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAge } from "../../hooks/useAge";
import { AgeController } from "../components/AgeController";
import { AgeTicks } from "../components/AgeTicks";
import { TimelineScaleToggle } from "../components/TimelineScaleToggle";
import { WindowIcon } from "../components/WindowIcon";
import { categoryMeta } from "../config";
import { lifeWindowsBySlug, lifeWindowsV2 } from "../data/windows";
import { useTimelineScale } from "../hooks/useTimelineScale";
import { ageToRangePosition, getAgeTicks } from "../lib/timeScale";
import { formatAgeRange, getRemainingTime, getWindowColor, getWindowLabel, getWindowRangeYears, getWindowStatus } from "../lib/windowStatus";

const orthodonticStages = [
  { start: 0, end: 6, range: "0–6 岁", label: "乳牙期 / 习惯干预", icon: "baby" as const },
  { start: 6, end: 12, range: "6–12 岁", label: "替牙期观察", icon: "smile" as const },
  { start: 12, end: 18, range: "12–18 岁", label: "青少年矫正常见期", icon: "tooth" as const, tone: "golden" },
  { start: 18, end: 40, range: "18 岁以后", label: "成年矫正", icon: "users" as const, tone: "possible" },
];

export function V2WindowDetail() {
  const { slug } = useParams();
  const { age, setAge } = useAge();
  const { scale } = useTimelineScale();
  const window = slug ? lifeWindowsBySlug.get(slug) : undefined;

  if (!window) {
    return (
      <main className="v2-not-found v2-shell">
        <h1>没有找到这扇窗口</h1>
        <Link to="/">返回人生时间轴</Link>
      </main>
    );
  }

  const status = getWindowStatus(window, age);
  const color = getWindowColor(status);
  const currentIndex = lifeWindowsV2.indexOf(window);
  const previous = lifeWindowsV2[(currentIndex - 1 + lifeWindowsV2.length) % lifeWindowsV2.length];
  const next = lifeWindowsV2[(currentIndex + 1) % lifeWindowsV2.length];
  const isOrthodontics = window.slug === "orthodontics-golden-period";
  const detailEndAge = isOrthodontics ? 40 : 100;
  const windowRange = getWindowRangeYears(window);
  const detailTicks = getAgeTicks(scale, 0, detailEndAge);
  const currentAgeVisible = age <= detailEndAge;

  return (
    <main className="v2-detail v2-shell" style={{ "--detail-color": color } as React.CSSProperties}>
      <Link className="v2-back" to="/#timeline"><ArrowLeft size={17} aria-hidden="true" />返回人生时间轴</Link>
      <section className="v2-detail__hero">
        <div className="v2-detail__intro">
          <div className="v2-detail__title-row">
            <span className="v2-detail__icon"><WindowIcon name={window.icon} size={48} /></span>
            <div>
              <h1>{window.title}</h1>
              <p>{categoryMeta[window.category].label} · {formatAgeRange(window)}</p>
            </div>
          </div>
          <div className="v2-detail__state" data-status={status}>
            <i />{getWindowLabel(window, age)}
          </div>
          <h2>{window.detail.question ?? `${age} 岁，这扇窗口还开着吗？`}</h2>
          <p className="v2-detail__answer">{window.detail.answer}</p>
          {isOrthodontics ? (
            <aside className="v2-detail__distinction">
              <strong>黄金窗口已过 ≠ 硬限制关闭</strong>
              <span>12–18 岁常被视为生长发育相关的便利阶段；成年后并非自动失去正畸可能，只是治疗目标、速度与风险评估会不同。</span>
            </aside>
          ) : null}
        </div>
        <AgeController age={age} onChange={setAge} compact />
      </section>

      <section className="v2-detail-timeline" aria-labelledby="detail-timeline-heading">
        <div className="v2-detail-timeline__heading">
          <div><h2 id="detail-timeline-heading">{isOrthodontics ? "正畸相关时间阶段" : "事件时间轴"}</h2><p>切换模式，只改变视觉坐标；年龄与窗口判断保持不变。</p></div>
          <TimelineScaleToggle compact />
        </div>
        <div className="v2-detail-timeline__viewport">
          <div className="v2-detail-timeline__canvas" data-scale={scale} data-testid="detail-timeline-canvas">
            <AgeTicks scale={scale} startAge={0} endAge={detailEndAge} className="v2-detail-timeline__ruler" />
            <div className="v2-detail-timeline__grid" aria-hidden="true">
              {detailTicks.map((tick) => <i key={tick} style={{ left: `${ageToRangePosition(tick, 0, detailEndAge, scale) * 100}%` }} />)}
            </div>
            {currentAgeVisible ? <div className="v2-detail-timeline__now" style={{ left: `${ageToRangePosition(age, 0, detailEndAge, scale) * 100}%` }}><span>{age}</span></div> : null}
            {isOrthodontics ? orthodonticStages.map((stage) => {
              const left = ageToRangePosition(stage.start, 0, detailEndAge, scale) * 100;
              const right = ageToRangePosition(stage.end, 0, detailEndAge, scale) * 100;
              return (
                <article
                  key={stage.range}
                  className={stage.tone ? `is-${stage.tone}` : ""}
                  style={{ left: `calc(${left}% + 3px)`, width: `calc(${right - left}% - 6px)` }}
                >
                  <WindowIcon name={stage.icon} size={28} />
                  <div><strong>{stage.range}</strong><span>{stage.label}</span></div>
                </article>
              );
            }) : (
              <article
                className="v2-detail-timeline__window"
                data-status={status}
                style={{
                  left: `calc(${ageToRangePosition(windowRange.start, 0, detailEndAge, scale) * 100}% + 3px)`,
                  width: `calc(${Math.max(3, (ageToRangePosition(Math.min(windowRange.end, detailEndAge), 0, detailEndAge, scale) - ageToRangePosition(windowRange.start, 0, detailEndAge, scale)) * 100)}% - 6px)`,
                }}
              >
                <WindowIcon name={window.icon} size={28} />
                <div><strong>{window.title}</strong><span>{formatAgeRange(window)} · {getWindowLabel(window, age)}</span></div>
              </article>
            )}
          </div>
        </div>
      </section>

      <section className="v2-detail__content">
        <div className="v2-detail__explanations">
          <article><MapPin aria-hidden="true" /><div><h3>你现在处于哪里</h3><p>{age} 岁时，这扇窗口的状态是“{getWindowLabel(window, age)}”。{getRemainingTime(window, age)}。</p></div></article>
          <article><Info aria-hidden="true" /><div><h3>为什么这个窗口会变化</h3><p>{window.detail.whyChanges}</p></div></article>
          <article><CheckCircle2 aria-hidden="true" /><div><h3>现在还能做什么</h3><ul>{window.detail.whatNow.map((item) => <li key={item}>{item}</li>)}</ul></div></article>
          <article><Stethoscope aria-hidden="true" /><div><h3>证据与边界</h3><ul>{window.detail.boundaries.map((item) => <li key={item}>{item}</li>)}</ul></div></article>
        </div>
        <aside className="v2-detail__actions">
          <h2>接下来你可以</h2>
          <div><span><Stethoscope aria-hidden="true" /></span><div><strong>{isOrthodontics ? "寻找专业评估" : "确认当前条件"}</strong><p>{isOrthodontics ? "预约口腔科或正畸专科，进行个体化检查与方案评估。" : "把目标、资源、风险和替代路径放在一起判断。"}</p></div></div>
          <Link to="/#timeline"><span><ArrowLeft aria-hidden="true" /></span><div><strong>回到时间轴</strong><p>查看你的整体人生时间轴与其他重要窗口。</p></div></Link>
          <p className="v2-detail__disclaimer">示例内容仅用于产品演示，不替代医疗、教育、法律或财务专业意见。</p>
        </aside>
      </section>

      <section className="v2-evidence">
        <div><span>证据类型</span><strong>{window.evidence.type}</strong></div>
        <div><span>来源</span>{window.evidence.url ? <a href={window.evidence.url} target="_blank" rel="noreferrer">{window.evidence.label}</a> : <strong>{window.evidence.label}</strong>}</div>
        <p>{window.evidence.note}</p>
      </section>

      <nav className="v2-detail__pagination" aria-label="相邻窗口">
        <Link to={`/window/${previous.slug}`}><ArrowLeft aria-hidden="true" /><span><small>上一扇窗口</small>{previous.title}</span></Link>
        <Link to={`/window/${next.slug}`}><span><small>下一扇窗口</small>{next.title}</span><ArrowRight aria-hidden="true" /></Link>
      </nav>
    </main>
  );
}
