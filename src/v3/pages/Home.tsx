import { useDeferredValue } from "react";
import { Link } from "react-router-dom";
import { AgeController } from "../components/AgeController";
import { EventField } from "../components/EventField";
import { groupVisibleWindows } from "../lib/visibleWindows";
import { useV3Age } from "../hooks/useV3Age";

export function V3Home() {
  const { currentAgeMonths, setCurrentAgeMonths } = useV3Age();
  const visualAgeMonths = useDeferredValue(currentAgeMonths);
  const groups = groupVisibleWindows(visualAgeMonths);
  const currentCount = groups.thriving.length + groups.withering.length;

  return (
    <main id="main-content">
      <section className="v3-hero v3-shell">
        <div className="v3-hero__intro"><h1>人生窗口期</h1><p>有些事情，只会经过一次。</p></div>
        <div className="v3-hero__control">
          <AgeController currentAgeMonths={currentAgeMonths} onChange={setCurrentAgeMonths} />
          <div className="v3-moment-summary" aria-live="polite" aria-atomic="true">
            <span><i className="is-thriving" aria-hidden="true" />{currentCount} 个窗口正在经过</span>
            <span><i className="is-withering" aria-hidden="true" />{groups.withering.length} 个接近尾声</span>
          </div>
        </div>
      </section>
      <div className="v3-shell">
        <EventField currentAgeMonths={visualAgeMonths} groups={groups} />
        <aside className="v3-reading-note"><p>每张卡是一段值得留意的阶段。颜色随参考年龄变化，不代表能力、生育资格或人生价值的消失。</p><Link to={`/v3/about?age=${currentAgeMonths / 12}`}>这些窗口从哪里来？</Link></aside>
      </div>
    </main>
  );
}
