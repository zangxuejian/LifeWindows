import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { EventMacroGroup } from "../types";
import type { VisibleWindow } from "../lib/visibleWindows";
import { EventCard } from "./EventCard";

const groupCopy: Record<EventMacroGroup, { title: string; kicker: string; empty: string }> = {
  thriving: { title: "正盛", kicker: "仍在生长，仍有空间", empty: "这一刻，没有处于正盛的窗口。" },
  withering: { title: "将谢", kicker: "正在离开，值得留意", empty: "这一刻，没有正在凋谢的窗口。" },
  memorial: { title: "余温", kicker: "它刚刚结束，还留着痕迹", empty: "这一刻，没有刚刚结束的窗口。" },
};

interface EventGroupProps {
  group: EventMacroGroup;
  items: VisibleWindow[];
  currentAgeMonths: number;
  totalCount: number;
}

export function EventGroup({ group, items, currentAgeMonths, totalCount }: EventGroupProps) {
  const copy = groupCopy[group];
  const reducedMotion = useReducedMotion();

  return (
    <motion.section className={`v3-event-group v3-event-group--${group}`} layout>
      <header className="v3-event-group__heading">
        <div>
          <h2>{copy.title}</h2>
          <i aria-hidden="true" />
        </div>
        <p>{copy.kicker}</p>
        <span>{totalCount}</span>
      </header>
      <motion.div className="v3-event-group__cards" layout>
        <AnimatePresence initial={false} mode={reducedMotion ? "sync" : "popLayout"}>
          {items.map((item) => (
            <EventCard
              key={item.window.id}
              window={item.window}
              state={item.state}
              currentAgeMonths={currentAgeMonths}
            />
          ))}
        </AnimatePresence>
        {items.length === 0 ? <p className="v3-event-group__empty">{copy.empty}</p> : null}
      </motion.div>
      {totalCount > items.length ? (
        <p className="v3-event-group__more">另有 {totalCount - items.length} 个窗口在这一场域中</p>
      ) : null}
    </motion.section>
  );
}
