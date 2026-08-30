import { Info, X } from "lucide-react";
import { useState } from "react";
import { useTimelineScale } from "../hooks/useTimelineScale";

export function TimelineScaleToggle({ compact = false }: { compact?: boolean }) {
  const { scale, setScale, introVisible } = useTimelineScale();
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className={`v2-scale-control ${compact ? "v2-scale-control--compact" : ""}`}>
      <div className="v2-scale-toggle" role="group" aria-label="时间轴显示模式">
        <button
          type="button"
          className={scale === "linear" ? "is-active" : ""}
          aria-pressed={scale === "linear"}
          data-testid="scale-linear"
          onClick={() => setScale("linear")}
        >
          客观年龄
        </button>
        <button
          type="button"
          className={scale === "relative" ? "is-active" : ""}
          aria-pressed={scale === "relative"}
          data-testid="scale-relative"
          onClick={() => setScale("relative")}
        >
          时间压缩视图
        </button>
        <button
          type="button"
          className="v2-scale-toggle__info"
          aria-label="了解相对时间模型"
          aria-expanded={infoOpen}
          onClick={() => setInfoOpen((open) => !open)}
        >
          <Info size={16} aria-hidden="true" />
        </button>
      </div>
      {scale === "relative" ? <small>相对时间模型（仅用于说明）</small> : null}
      {infoOpen ? (
        <aside className="v2-scale-popover" role="dialog" aria-label="为什么时间会被压缩">
          <button type="button" aria-label="关闭说明" onClick={() => setInfoOpen(false)}><X size={15} /></button>
          <h3>为什么时间会被压缩？</h3>
          <p>8 岁时，一年约占已经历人生的 1/8；80 岁时，一年约占 1/80。</p>
          <p>这里用对数化的相对时间模型给早年更多视觉空间。它用于探索时间尺度，不代表心理时间的精确测量。</p>
          <code>Relative time ∝ log(age + constant)</code>
        </aside>
      ) : null}
      {introVisible ? <p className="v2-scale-intro" role="status">同样是一年，它在人生中的相对位置并不相同。</p> : null}
    </div>
  );
}
