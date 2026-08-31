import { LayoutGroup } from "framer-motion";
import { groupVisibleWindows } from "../lib/visibleWindows";
import { EventGroup } from "./EventGroup";

const visibleLimits = {
  thriving: 4,
  withering: 4,
  memorial: 2,
} as const;

export function EventField({ currentAgeMonths }: { currentAgeMonths: number }) {
  const groups = groupVisibleWindows(currentAgeMonths);

  return (
    <section className="v3-event-field" id="event-field" aria-label="此刻的人生窗口">
      <div className="v3-event-field__intro">
        <span>THE LIVING FIELD</span>
        <p>窗口不会同时打开。它们正以不同的速度经过你。</p>
      </div>
      <LayoutGroup id="life-windows-v3-field">
        <div className="v3-event-field__layout">
          <EventGroup
            group="thriving"
            items={groups.thriving.slice(0, visibleLimits.thriving)}
            totalCount={groups.thriving.length}
            currentAgeMonths={currentAgeMonths}
          />
          <EventGroup
            group="withering"
            items={groups.withering.slice(0, visibleLimits.withering)}
            totalCount={groups.withering.length}
            currentAgeMonths={currentAgeMonths}
          />
          <EventGroup
            group="memorial"
            items={groups.memorial.slice(0, visibleLimits.memorial)}
            totalCount={groups.memorial.length}
            currentAgeMonths={currentAgeMonths}
          />
        </div>
      </LayoutGroup>
    </section>
  );
}
