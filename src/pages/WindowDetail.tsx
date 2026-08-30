import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { DetailTimeline } from "../components/DetailTimeline/DetailTimeline";
import { WindowStatus } from "../components/WindowStatus/WindowStatus";
import { useAge } from "../hooks/useAge";
import { lifeWindows, lifeWindowsBySlug } from "../data/windows";
import { formatAgeRange, getWindowStatus } from "../lib/windowStatus";
import { evidenceLabels, windowTypeLabels, type WindowGoal } from "../types/window";

function defaultGoals(canDoAfter: boolean): WindowGoal[] {
  return [
    {
      name: "达到专业顶尖水平",
      status: canDoAfter ? "difficult" : "closed",
      description: canDoAfter ? "通常更依赖早期投入与长期积累。" : "受该窗口本身限制。",
    },
    { name: "建立可持续能力", status: "open", description: "可按当前条件重新规划。" },
    { name: "作为个人体验", status: "open", description: "目标改变时，窗口也会改变。" },
  ];
}

export function WindowDetail() {
  const { slug } = useParams();
  const { age } = useAge();
  const window = slug ? lifeWindowsBySlug.get(slug) : undefined;

  useEffect(() => {
    document.title = window
      ? `${window.title} - 人生窗口期`
      : "未找到窗口 - 人生窗口期";
    return () => {
      document.title = "人生窗口期 - 看看你还来得及什么";
    };
  }, [window]);

  if (!window) {
    return (
      <main className="page-shell not-found">
        <h1>没有找到这个窗口</h1>
        <Link to="/">返回人生时间轴</Link>
      </main>
    );
  }

  const status = getWindowStatus(window, age);
  const index = lifeWindows.findIndex((item) => item.id === window.id);
  const previous = index > 0 ? lifeWindows[index - 1] : lifeWindows.at(-1);
  const next = index < lifeWindows.length - 1 ? lifeWindows[index + 1] : lifeWindows[0];
  const goals = window.goals ?? defaultGoals(window.canDoAfterWindow);

  return (
    <main className="page-shell detail-page">
      <Link className="back-link" to="/">
        <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" />
        返回人生时间轴
      </Link>
      <header className="detail-page__header">
        <h1>{window.title}</h1>
        <WindowStatus status={status.status} label={status.label} detail={status.detail} />
        <p>{window.description}</p>
      </header>

      <DetailTimeline window={window} age={age} />

      <section className="archive-facts" aria-label="窗口档案">
        <div><span>黄金窗口</span><strong>{formatAgeRange(window.goldenStartAge, window.goldenEndAge)}</strong></div>
        <div><span>常见阶段</span><strong>{formatAgeRange(window.typicalStartAge, window.typicalEndAge, window.alwaysOpen)}</strong></div>
        <div><span>硬性年龄限制</span><strong>{window.hardEndAge === undefined ? "无" : formatAgeRange(window.hardStartAge, window.hardEndAge)}</strong></div>
        <div><span>{age} 岁还能不能做？</span><strong>{window.canDoAfterWindow || status.status !== "closed" ? "可以" : "该窗口已结束"}</strong></div>
      </section>

      <section className="goals-section">
        <h2>不同目标，窗口不同</h2>
        <div className="goals-table" role="table" aria-label="不同目标对应的窗口">
          <div className="goals-table__head" role="row">
            <span>目标</span><span>窗口状态</span><span>说明</span>
          </div>
          {goals.map((goal) => (
            <div className="goals-table__row" role="row" key={goal.name}>
              <strong>{goal.name}</strong>
              <span className={`goal-state goal-state--${goal.status}`}>
                <i aria-hidden="true" />
                {goal.status === "open" ? "仍然开放" : goal.status === "difficult" ? "难度较高" : "窗口已关闭"}
              </span>
              <span>{goal.description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="evidence-strip" aria-label="数据依据">
        <div><span>依据</span><strong>{evidenceLabels[window.evidenceLevel]}</strong></div>
        <div><span>窗口类型</span><strong>{windowTypeLabels[window.type]}</strong></div>
        <p>{window.sourceNote}</p>
        <div><span>最后核对</span><strong>{window.lastReviewed ?? "待核对"}</strong></div>
      </section>

      <nav className="detail-pagination" aria-label="相邻人生窗口">
        {previous ? (
          <Link to={`/window/${previous.slug}`}>
            <ArrowLeft aria-hidden="true" />
            <span><small>上一窗口</small>{previous.title}</span>
          </Link>
        ) : null}
        {next ? (
          <Link to={`/window/${next.slug}`}>
            <span><small>下一窗口</small>{next.title}</span>
            <ArrowRight aria-hidden="true" />
          </Link>
        ) : null}
      </nav>
    </main>
  );
}
