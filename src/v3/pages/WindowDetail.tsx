import { ArrowLeft, ArrowUpRight, BookOpen, Compass } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { AgeController } from "../components/AgeController";
import { ActionChecklist } from "../components/ActionChecklist";
import { CopyLink } from "../components/CopyLink";
import { WindowIcon } from "../components/WindowIcon";
import { categoryLabels, expiringWindows, getExpiringWindow } from "../data/windows";
import { getWindowContent } from "../data/windowContent";
import { useV3Age } from "../hooks/useV3Age";
import { formatAge, formatAgeRange, getWindowBounds } from "../lib/age";
import { getLifecycleLabel, getLifecycleState, getLifecycleVisuals } from "../lib/windowLifecycle";

const typeLabels = { hard: "时间敏感事项", institutional: "制度与身份相关", biological: "生长与健康阶段", golden: "经验性参考阶段" };

export function V3WindowDetail() {
  const { slug } = useParams();
  const item = getExpiringWindow(slug);
  const { currentAgeMonths, setCurrentAgeMonths } = useV3Age();
  if (!item) return <main id="main-content" className="v3-shell v3-no-results"><h1>暂时找不到这个窗口</h1><p>它可能已改名，也可能是链接不完整。</p><Link className="v3-button" to={`/v3/explore?age=${currentAgeMonths / 12}`}>回到全部窗口</Link></main>;
  const state = getLifecycleState(item, currentAgeMonths);
  const visuals = getLifecycleVisuals(item, currentAgeMonths);
  const copy = getWindowContent(item);
  const ageQuery = `?age=${currentAgeMonths / 12}`;
  const { startMonths, endMonths } = getWindowBounds(item);
  const related = expiringWindows.filter((other) => other.id !== item.id && other.category === item.category).sort((a, b) => Math.abs(getWindowBounds(a).startMonths - startMonths) - Math.abs(getWindowBounds(b).startMonths - startMonths)).slice(0, 3);
  const stageMessage = state === "notBorn" ? `参考阶段从 ${formatAge(startMonths)} 开始，你可以提前了解。` : state === "gone" || state === "memorial" ? "这段参考阶段已经结束，相关选择未必随之消失。" : `你正处在这段参考阶段内，页面的结束标记为 ${formatAge(endMonths)}。`;
  return <main id="main-content" className="v3-detail v3-shell">
    <Link className="v3-detail__back" to={`/v3/explore${ageQuery}`}><ArrowLeft aria-hidden="true" />探索全部窗口</Link>
    <section className="v3-detail__hero">
      <div className="v3-detail__intro">
        <div className="v3-detail__icon" style={{ backgroundColor: visuals.background, borderColor: visuals.border, color: visuals.icon }}><WindowIcon name={item.icon} size={42} /></div>
        <p>{categoryLabels[item.category]} · {formatAgeRange(item)} <span className="v3-model-label">参考阶段</span></p>
        <h1>{item.title}</h1>
        <span className="v3-detail__status" style={{ color: visuals.badgeText, backgroundColor: visuals.badgeBackground }}>{getLifecycleLabel(state)}</span>
        <p className="v3-detail__summary">{copy.summary}</p>
        <CopyLink key={item.id} ageMonths={currentAgeMonths} />
      </div>
      <aside className="v3-detail__age"><AgeController compact currentAgeMonths={currentAgeMonths} onChange={setCurrentAgeMonths} /><p>{stageMessage}</p><button className="v3-text-link" type="button" onClick={() => setCurrentAgeMonths(Math.round((startMonths + endMonths) / 2))}>看看窗口内的自己 <ArrowUpRight size={16} aria-hidden="true" /></button></aside>
    </section>
    <div className="v3-detail__body">
      <div><section className="v3-editorial-section"><p className="v3-eyebrow">WHY IT MATTERS</p><h2>为什么值得留意</h2><p>{copy.whyItMatters}</p></section>
        <ActionChecklist key={item.id} id={item.id} actions={copy.actions} />
        <section className="v3-after-window"><Compass size={25} aria-hidden="true" /><div><h2>如果已经走过这段时间</h2><p>{copy.afterWindow}</p></div></section>
      </div>
      <aside className="v3-evidence"><BookOpen size={24} aria-hidden="true" /><h2>如何理解这张卡</h2><dl><div><dt>窗口性质</dt><dd>{typeLabels[item.type]}</dd></div><div><dt>年龄依据</dt><dd>编辑性阶段参考</dd></div><div><dt>适用范围</dt><dd>{item.region?.join("、") ?? "请结合个人与当地情况"}</dd></div></dl><p>{copy.evidenceNote}</p>
        <h3>{copy.sources.length ? "延伸阅读" : "来源说明"}</h3>
        {copy.sources.length ? <ul className="v3-sources">{copy.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<ArrowUpRight size={14} aria-hidden="true" /></a><p>{source.scope}</p></li>)}</ul> : <p>尚未接入支持这一年龄范围的直接来源。行动建议是生活规划提示，不代表统一的资格条件或研究结论。</p>}
        <Link className="v3-text-link" to={`/v3/about${ageQuery}`}>查看完整数据说明 <ArrowUpRight size={15} aria-hidden="true" /></Link>
      </aside>
    </div>
    {related.length ? <section className="v3-related"><div><p className="v3-eyebrow">KEEP EXPLORING</p><h2>也许与你有关</h2></div><div className="v3-related__grid">{related.map((other) => <Link key={other.id} to={`/v3/window/${other.slug}${ageQuery}`}><WindowIcon name={other.icon} size={24} /><span><strong>{other.title}</strong><small>{formatAgeRange(other)}</small></span><ArrowUpRight size={18} aria-hidden="true" /></Link>)}</div></section> : null}
  </main>;
}
