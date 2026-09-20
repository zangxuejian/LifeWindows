import { LayoutGroup } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { groupVisibleWindows } from "../lib/visibleWindows";
import { EventGroup } from "./EventGroup";

export function EventField({ currentAgeMonths, groups }: {
  currentAgeMonths: number;
  groups: ReturnType<typeof groupVisibleWindows>;
}) {
  return (
    <section className="v3-event-field" id="event-field" aria-label="此刻的人生窗口">
      <div className="v3-event-field__intro">
        <div><span>THE LIVING FIELD</span><p>年龄是观察的坐标，不是人生的截止日期。</p></div>
        <Link className="v3-text-link" to={`/v3/explore?age=${currentAgeMonths / 12}`}>探索全部窗口 <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
      <LayoutGroup id="life-windows-v3-field">
        <div className="v3-event-field__layout">
          <EventGroup group="thriving" items={groups.thriving} currentAgeMonths={currentAgeMonths} limit={4} />
          <EventGroup group="withering" items={groups.withering} currentAgeMonths={currentAgeMonths} limit={4} />
          <EventGroup group="memorial" items={groups.memorial} currentAgeMonths={currentAgeMonths} limit={2} />
        </div>
      </LayoutGroup>
    </section>
  );
}
