import { useMemo, useState } from "react";
import { AgeSlider } from "../components/AgeSlider/AgeSlider";
import { CategoryFilter, type CategorySelection } from "../components/CategoryFilter/CategoryFilter";
import { LifeTimeline } from "../components/LifeTimeline/LifeTimeline";
import { NowSummary } from "../components/NowSummary/NowSummary";
import { SectionHeading } from "../components/SectionHeading";
import { UpcomingWindows } from "../components/UpcomingWindows/UpcomingWindows";
import { WindowList } from "../components/WindowList/WindowList";
import { useAge } from "../hooks/useAge";
import { lifeWindows } from "../data/windows";
import { getAttentionEnd, getWindowStatus, isAvailableStatus } from "../lib/windowStatus";

export function Home() {
  const { age, setAge } = useAge();
  const [category, setCategory] = useState<CategorySelection>("all");

  const sections = useMemo(() => {
    const filtered = lifeWindows.filter(
      (window) => category === "all" || window.category === category,
    );
    const available = filtered
      .filter((window) => isAvailableStatus(getWindowStatus(window, age).status))
      .sort((a, b) => {
        const priority = { closingSoon: 0, active: 1, alwaysOpen: 2, goldenPassed: 3, future: 4, closed: 5 };
        return priority[getWindowStatus(a, age).status] - priority[getWindowStatus(b, age).status];
      })
      .slice(0, 7);
    const upcoming = filtered
      .map((window) => ({ window, end: getAttentionEnd(window) }))
      .filter((item): item is { window: typeof lifeWindows[number]; end: number } =>
        item.end !== null && item.end >= age && item.end - age <= 10,
      )
      .sort((a, b) => a.end - b.end)
      .slice(0, 6)
      .map((item) => item.window);
    const closed = filtered
      .filter((window) => getWindowStatus(window, age).status === "closed")
      .sort((a, b) => (getAttentionEnd(b) ?? 0) - (getAttentionEnd(a) ?? 0))
      .slice(0, 6);
    return { available, upcoming, closed };
  }, [age, category]);

  return (
    <main>
      <section className="hero page-shell">
        <div className="hero__heading">
          <h1>人生窗口期</h1>
          <p className="hero__english">Life Windows</p>
          <p className="hero__slogan">看看你还来得及什么。</p>
        </div>
        <AgeSlider age={age} onChange={setAge} />
        <NowSummary age={age} />
      </section>

      <section className="timeline-section page-shell">
        <CategoryFilter value={category} onChange={setCategory} />
        <LifeTimeline age={age} category={category} />
      </section>

      <section className="home-split page-shell">
        <div>
          <SectionHeading
            title="你现在还能做什么"
            description="正在开放、长期开放，以及黄金期已过但仍然可以的窗口。"
          />
          <WindowList windows={sections.available} age={age} />
        </div>
        <div>
          <SectionHeading
            title="接下来什么会关闭？"
            description="优先显示未来十年内最近的关键节点。"
            accent="amber"
          />
          <UpcomingWindows windows={sections.upcoming} age={age} />
        </div>
      </section>

      <section className="closed-section page-shell">
        <SectionHeading
          title="已经关闭的窗口"
          description="这里只记录真正不可逆或明确结束的窗口。常见年龄过去，不等于机会关闭。"
          accent="gray"
        />
        <WindowList
          windows={sections.closed}
          age={age}
          emptyText="当前年龄下，还没有真正关闭的窗口。"
        />
      </section>
    </main>
  );
}
