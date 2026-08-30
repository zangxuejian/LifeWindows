import { useAge } from "../../hooks/useAge";
import { AgeController } from "../components/AgeController";
import { CurrentWindows } from "../components/CurrentWindows";
import { LifeTimeline } from "../components/LifeTimeline";
import { SummaryStrip } from "../components/SummaryStrip";
import { UpcomingWindows } from "../components/UpcomingWindows";

export function V2Home() {
  const { age, setAge } = useAge();

  return (
    <main>
      <section className="v2-hero v2-shell">
        <div className="v2-hero__intro">
          <span>Life Windows · 人生事件时间地图</span>
          <h1>人生窗口期</h1>
          <p className="v2-hero__tagline">看看你已经错过了什么，还剩下什么。</p>
          <p>拖动年龄，查看已经关闭、正在发生、即将关闭与未来开启的人生窗口。</p>
        </div>
        <AgeController age={age} onChange={setAge} />
      </section>
      <div className="v2-shell">
        <SummaryStrip age={age} />
        <LifeTimeline age={age} />
        <div className="v2-supporting-grid">
          <CurrentWindows age={age} />
          <UpcomingWindows age={age} />
        </div>
      </div>
    </main>
  );
}
