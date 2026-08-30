import { ArrowLeft, ArrowRight, CheckCircle2, Info, MapPin, Stethoscope } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAge } from "../../hooks/useAge";
import { AgeController } from "../components/AgeController";
import { WindowIcon } from "../components/WindowIcon";
import { categoryMeta } from "../config";
import { lifeWindowsBySlug, lifeWindowsV2 } from "../data/windows";
import { formatAgeRange, getRemainingTime, getWindowColor, getWindowLabel, getWindowStatus } from "../lib/windowStatus";

const orthodonticStages = [
  { range: "0–6 岁", label: "乳牙与颌面发育观察", icon: "baby" as const },
  { range: "6–12 岁", label: "替牙期评估", icon: "smile" as const },
  { range: "12–18 岁", label: "常见生长发育窗口", icon: "tooth" as const, tone: "golden" },
  { range: "18 岁以后", label: "成年人仍可评估", icon: "users" as const, tone: "possible" },
];

export function V2WindowDetail() {
  const { slug } = useParams();
  const { age, setAge } = useAge();
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
              <strong>黄金期 ≠ 硬性截止</strong>
              <span>12–18 岁常被视为生长发育相关的便利阶段；成年后并非自动失去正畸可能，只是治疗目标、速度与风险评估会不同。</span>
            </aside>
          ) : null}
        </div>
        <AgeController age={age} onChange={setAge} compact />
      </section>

      {isOrthodontics ? (
        <section className="v2-detail__stages" aria-labelledby="stage-heading">
          <h2 id="stage-heading">正畸相关时间阶段 <small>示意</small></h2>
          <div>
            {orthodonticStages.map((stage) => (
              <article key={stage.range} className={stage.tone ? `is-${stage.tone}` : ""}>
                <WindowIcon name={stage.icon} size={34} />
                <div><strong>{stage.range}</strong><span>{stage.label}</span></div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="v2-detail__range" aria-label="窗口年龄范围">
          <span>常见范围</span><strong>{formatAgeRange(window)}</strong><span>当前</span><strong>{age} 岁</strong>
        </section>
      )}

      <section className="v2-detail__content">
        <div className="v2-detail__explanations">
          <article><MapPin aria-hidden="true" /><div><h3>你现在处于哪里</h3><p>{age} 岁时，这扇窗口的状态是“{getWindowLabel(window, age)}”。{getRemainingTime(window, age)}。</p></div></article>
          <article><Info aria-hidden="true" /><div><h3>为什么这个窗口会变化</h3><p>{window.detail.whyChanges}</p></div></article>
          <article><CheckCircle2 aria-hidden="true" /><div><h3>现在还能做什么</h3><ul>{window.detail.whatNow.map((item) => <li key={item}>{item}</li>)}</ul></div></article>
          <article><Stethoscope aria-hidden="true" /><div><h3>证据与边界</h3><ul>{window.detail.boundaries.map((item) => <li key={item}>{item}</li>)}</ul></div></article>
        </div>
        <aside className="v2-detail__actions">
          <h2>接下来你可以</h2>
          <div>
            <span><Stethoscope aria-hidden="true" /></span>
            <div><strong>{isOrthodontics ? "寻找专业评估" : "确认当前条件"}</strong><p>{isOrthodontics ? "预约口腔科或正畸专科，进行个体化检查与方案评估。" : "把目标、资源、风险和替代路径放在一起判断。"}</p></div>
          </div>
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
