import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { categoryOptions } from "../config";
import { lifeWindowsV2 } from "../data/windows";
import type { WindowCategory } from "../types";
import { WindowCard } from "../components/WindowCard";
import { useAge } from "../../hooks/useAge";

export function Explore() {
  const { age } = useAge();
  const [category, setCategory] = useState<"all" | WindowCategory>("all");
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return lifeWindowsV2.filter((window) => {
      const matchesCategory = category === "all" || window.category === category;
      const matchesQuery = !normalized || `${window.title}${window.summary}`.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <main className="v2-explore v2-shell">
      <header className="v2-page-title">
        <h1>主题探索</h1>
        <p>从身体、学习、职业、家庭与体验出发，寻找此刻与你有关的窗口。</p>
      </header>
      <label className="v2-search">
        <Search size={19} aria-hidden="true" />
        <span className="sr-only">搜索人生窗口</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索：正畸、语言、职业、家庭…" />
        <small>{results.length} 个结果</small>
      </label>
      <div className="v2-category-tabs v2-category-tabs--explore" role="tablist" aria-label="主题分类">
        {categoryOptions.map((option) => (
          <button key={option.id} type="button" role="tab" aria-selected={category === option.id} className={category === option.id ? "is-active" : ""} onClick={() => setCategory(option.id)}>
            {option.label}
          </button>
        ))}
      </div>
      <section className="v2-explore__grid" aria-live="polite">
        {results.map((window) => <WindowCard key={window.slug} window={window} age={age} />)}
      </section>
    </main>
  );
}
