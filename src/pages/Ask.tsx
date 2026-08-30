import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { WindowStatus } from "../components/WindowStatus/WindowStatus";
import { useAge } from "../hooks/useAge";
import { lifeWindows } from "../data/windows";
import { getWindowStatus } from "../lib/windowStatus";

const presets = ["学钢琴", "学英语", "读大学", "考研究生", "转行", "创业", "跑马拉松", "留学"];

function normalize(value: string) {
  return value.replace(/[我还来得及了吗？?，,。\s\d岁]/g, "").toLowerCase();
}

function findWindow(query: string) {
  const needle = normalize(query);
  if (!needle) return undefined;
  return lifeWindows.find((window) => {
    const candidates = [window.title, window.shortTitle, ...(window.keywords ?? [])]
      .filter(Boolean)
      .map((value) => normalize(String(value)));
    return candidates.some((candidate) => candidate.includes(needle) || needle.includes(candidate));
  });
}

export function Ask() {
  const { age } = useAge();
  const [query, setQuery] = useState("学钢琴");
  const [submittedQuery, setSubmittedQuery] = useState("学钢琴");
  const result = useMemo(() => findWindow(submittedQuery), [submittedQuery]);
  const status = result ? getWindowStatus(result, age) : undefined;

  const submit = (value = query) => {
    setQuery(value);
    setSubmittedQuery(value);
  };

  return (
    <main className="page-shell ask-page">
      <header className="subpage__header ask-page__header">
        <h1>我还来得及吗？</h1>
        <p>答案取决于目标。第一版从本地人生窗口档案中查找，不使用 AI。</p>
      </header>

      <form
        className="ask-form"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <label htmlFor="ask-input">我 {age} 岁了，还来得及</label>
        <div className="ask-form__control">
          <input
            id="ask-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="学钢琴"
          />
          <span>吗？</span>
          <button type="submit" aria-label="查询人生窗口">
            <Search aria-hidden="true" />
          </button>
        </div>
      </form>

      <div className="ask-presets" aria-label="常见问题">
        {presets.map((preset) => (
          <button type="button" onClick={() => submit(preset)} key={preset}>
            {preset}
          </button>
        ))}
      </div>

      <section className="ask-result" aria-live="polite">
        {result && status ? (
          <>
            <p className="ask-result__query">{age} 岁 · {result.title}</p>
            <h2>{status.status === "closed" ? "这个具体窗口已经结束。" : status.status === "future" ? "还没到常见阶段。" : "来得及。"}</h2>
            <WindowStatus status={status.status} label={status.label} detail={status.detail} />
            <p className="ask-result__description">{result.description}</p>
            <div className="ask-result__goals">
              <h3>如果目标是：</h3>
              {(result.goals ?? [
                { name: "建立可持续能力", status: "open" as const, description: "可以从适合当前条件的路径开始。" },
                { name: "作为个人体验", status: "open" as const, description: "长期开放。" },
              ]).map((goal) => (
                <div key={goal.name}>
                  <strong>{goal.name}</strong>
                  <span>{goal.description}</span>
                </div>
              ))}
            </div>
            <Link className="text-link" to={`/window/${result.slug}`}>查看完整窗口档案 <span aria-hidden="true">→</span></Link>
          </>
        ) : (
          <>
            <h2>本地档案里还没有这一项。</h2>
            <p>这不代表答案是否定的，只表示 MVP 数据集中没有足够信息。</p>
          </>
        )}
      </section>
    </main>
  );
}
