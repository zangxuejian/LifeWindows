import { ArrowLeft, Database, MapPin, Sparkles } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AgeController } from "../components/AgeController";
import { WindowIcon } from "../components/WindowIcon";
import { categoryLabels, getExpiringWindow } from "../data/windows";
import { useV3Age } from "../hooks/useV3Age";
import { formatAgeRange } from "../lib/age";
import { getLifecycleLabel, getLifecycleState, getLifecycleVisuals } from "../lib/windowLifecycle";

const typeLabels = {
  hard: "硬性时点",
  institutional: "制度窗口",
  biological: "生理阶段",
  golden: "黄金阶段",
};

const evidenceLabels = {
  official: "官方资料",
  research: "研究资料",
  clinical: "临床常见阶段",
  statistical: "统计阶段",
  editorial: "编辑性模型",
};

export function V3WindowDetail() {
  const { slug } = useParams();
  const window = getExpiringWindow(slug);
  const { currentAgeMonths, setCurrentAgeMonths } = useV3Age();

  if (!window) return <Navigate to="/" replace />;

  const state = getLifecycleState(window, currentAgeMonths);
  const visuals = getLifecycleVisuals(window, currentAgeMonths);

  return (
    <main className="v3-detail v3-shell">
      <Link className="v3-detail__back" to="/"><ArrowLeft aria-hidden="true" />返回事件场</Link>
      <section className="v3-detail__hero">
        <div className="v3-detail__intro">
          <div
            className="v3-detail__icon"
            style={{ backgroundColor: visuals.background, borderColor: visuals.border, color: visuals.icon }}
          >
            <WindowIcon name={window.icon} size={46} />
          </div>
          <p>{categoryLabels[window.category]} · {formatAgeRange(window)}</p>
          <h1>{window.title}</h1>
          <span className="v3-detail__status" style={{ color: visuals.badgeText, backgroundColor: visuals.badgeBackground }}>
            {getLifecycleLabel(state)}
          </span>
          <p className="v3-detail__summary">{window.summary ?? "这是一个会出现、成熟并在特定阶段后离场的人生窗口。"}</p>
        </div>
        <AgeController compact currentAgeMonths={currentAgeMonths} onChange={setCurrentAgeMonths} />
      </section>
      <section className="v3-detail__grid">
        <article>
          <Sparkles aria-hidden="true" />
          <h2>这个窗口是什么</h2>
          <p>它描述的是“{window.title}”这一段有限阶段，而不是把相关活动定义为终身不能再做。</p>
        </article>
        <article>
          <Database aria-hidden="true" />
          <h2>数据性质</h2>
          <p>{typeLabels[window.type]} · {evidenceLabels[window.evidenceLevel]}。{window.sourceNote}</p>
        </article>
        <article>
          <MapPin aria-hidden="true" />
          <h2>适用范围</h2>
          <p>{window.region?.join("、") ?? "常见阶段参考"}{window.lastVerified ? ` · 最近核对 ${window.lastVerified}` : ""}</p>
        </article>
      </section>
      <aside className="v3-detail__note">
        <strong>黄金窗口结束，不等于硬性能力消失。</strong>
        <p>例如青少年正畸黄金期结束后，成年仍可能进行正畸；这里表达的是特定生长阶段的结束。</p>
      </aside>
    </main>
  );
}
