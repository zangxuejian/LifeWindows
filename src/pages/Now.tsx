import { useMemo } from "react";
import { AgeSlider } from "../components/AgeSlider/AgeSlider";
import { SectionHeading } from "../components/SectionHeading";
import { WindowList } from "../components/WindowList/WindowList";
import { useAge } from "../hooks/useAge";
import { lifeWindows } from "../data/windows";
import { getWindowStatus, isAvailableStatus } from "../lib/windowStatus";

export function Now() {
  const { age, setAge } = useAge();
  const windows = useMemo(
    () => lifeWindows.filter((window) => isAvailableStatus(getWindowStatus(window, age).status)),
    [age],
  );

  return (
    <main className="page-shell subpage">
      <header className="subpage__header">
        <h1>此时此刻</h1>
        <p>{age} 岁仍然开放、正在发生，以及仍然可以开始的窗口。</p>
      </header>
      <AgeSlider age={age} onChange={setAge} compact />
      <section className="now-page__list">
        <SectionHeading title={`${windows.length} 个仍然可做的窗口`} />
        <WindowList windows={windows} age={age} />
      </section>
    </main>
  );
}
