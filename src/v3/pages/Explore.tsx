import { useDeferredValue } from "react";
import { ArrowUpRight, Search, SlidersHorizontal, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { categoryLabels, expiringWindows } from "../data/windows";
import { getWindowContent } from "../data/windowContent";
import { AgeController } from "../components/AgeController";
import { WindowIcon } from "../components/WindowIcon";
import { useV3Age } from "../hooks/useV3Age";
import { formatAge, formatAgeRange } from "../lib/age";
import { filterWindows, stageLabels, type ExploreStage } from "../lib/exploration";
import { getLifecycleLabel, getLifecycleState, getMacroGroup } from "../lib/windowLifecycle";
import type { WindowCategory } from "../types";

export function V3Explore() {
  const { currentAgeMonths, setCurrentAgeMonths } = useV3Age();
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const categoryParam = params.get("category") ?? "all";
  const category = Object.hasOwn(categoryLabels, categoryParam) ? categoryParam as WindowCategory : "all";
  const stageParam = params.get("stage") ?? "all";
  const stage = Object.hasOwn(stageLabels, stageParam) ? stageParam as ExploreStage : "all";
  const deferredQuery = useDeferredValue(query);
  const results = filterWindows(currentAgeMonths, { query: deferredQuery, category, stage });
  const rawPage = Number(params.get("page"));
  const pageCount = Math.max(1, Math.ceil(results.length / 12));
  const page = Math.min(pageCount, Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1);
  const shown = results.slice((page - 1) * 12, page * 12);
  function updateFilter(name: string, value: string) {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value && value !== "all") next.set(name, value); else next.delete(name);
      if (name !== "page") next.delete("page");
      return next;
    }, { replace: true });
  }
  function reset() { setParams({ age: String(currentAgeMonths / 12) }, { replace: true }); }
  const filtered = Boolean(query.trim() || category !== "all" || stage !== "all");

  return <main id="main-content" className="v3-shell v3-explore">
    <header className="v3-page-heading"><div><p className="v3-eyebrow">A LIFE, MANY POSSIBILITIES</p><h1>每个阶段，都值得看见。</h1><p>{expiringWindows.length} 个窗口，从成长、学习到职业与关系。找到与你有关的那一个。</p></div><Link className="v3-text-link" to={`/?age=${currentAgeMonths / 12}`}>回到此刻 <ArrowUpRight size={16} aria-hidden="true" /></Link></header>
    <div className="v3-explore__age"><AgeController compact currentAgeMonths={currentAgeMonths} onChange={setCurrentAgeMonths} /><p>正在以 <strong>{formatAge(currentAgeMonths)}</strong> 为坐标浏览。这里也能查看尚未出现和已经离场的窗口。</p></div>
    <section className="v3-explore__filters" aria-label="筛选窗口">
      <label className="v3-search"><Search size={19} aria-hidden="true" /><span className="sr-only">搜索窗口</span><input type="search" placeholder="试试：职业、正畸、退休…" value={query} onChange={(event) => updateFilter("q", event.target.value)} /></label>
      <label className="v3-select"><span>主题</span><select value={category} onChange={(event) => updateFilter("category", event.target.value)}><option value="all">全部主题</option>{Object.entries(categoryLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
      <label className="v3-select"><span>阶段</span><select value={stage} onChange={(event) => updateFilter("stage", event.target.value)}>{Object.entries(stageLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
    </section>
    <div className="v3-result-heading"><p role="status" aria-live="polite">找到 <strong>{results.length}</strong> 个窗口{results.length > 12 ? ` · 第 ${page} / ${pageCount} 页` : ""}</p>{filtered ? <button type="button" className="v3-text-link" onClick={reset}><X size={15} aria-hidden="true" />清除筛选</button> : <span>按参考开始年龄排列</span>}</div>
    {shown.length ? <div className="v3-library-grid">{shown.map((item) => {
      const state = getLifecycleState(item, currentAgeMonths);
      const tone = getMacroGroup(state) ?? "quiet";
      return <Link className={`v3-library-card is-${tone}`} key={item.id} to={`/v3/window/${item.slug}?age=${currentAgeMonths / 12}`}>
        <div className="v3-library-card__top"><WindowIcon name={item.icon} size={27} /><span>{getLifecycleLabel(state)}</span></div>
        <h2>{item.title}</h2><p className="v3-library-card__range">{formatAgeRange(item)} · {categoryLabels[item.category]}</p><p>{getWindowContent(item).summary}</p>
        <span className="v3-library-card__read">了解这个窗口 <ArrowUpRight size={16} aria-hidden="true" /></span>
      </Link>;
    })}</div> : <div className="v3-no-results"><SlidersHorizontal aria-hidden="true" /><h2>暂时没有符合条件的窗口</h2><p>换个关键词，或清除主题与阶段限制。未收录不代表没有机会。</p><button className="v3-button" type="button" onClick={reset}>查看全部窗口</button></div>}
    {pageCount > 1 ? <nav className="v3-pagination" aria-label="窗口分页"><button className="v3-button" type="button" disabled={page === 1} onClick={() => updateFilter("page", String(page - 1))}>上一页</button><span>{page} / {pageCount}</span><button className="v3-button" type="button" disabled={page === pageCount} onClick={() => updateFilter("page", String(page + 1))}>下一页</button></nav> : null}
  </main>;
}
