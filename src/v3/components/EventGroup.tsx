import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { EventMacroGroup } from "../types";
import type { VisibleWindow } from "../lib/visibleWindows";
import { EventCard } from "./EventCard";

const groupCopy: Record<EventMacroGroup, { title: string; kicker: string; empty: string }> = {
  thriving: { title: "正盛", kicker: "仍有空间，慢慢生长", empty: "这一刻，没有匹配的正盛窗口。人生不只包含这份清单里的事情。" },
  withering: { title: "将谢", kicker: "参考阶段接近尾声", empty: "这一刻，没有接近尾声的窗口。不必为没有倒计时而着急。" },
  memorial: { title: "余温", kicker: "阶段结束，经验留下", empty: "这一刻，没有刚刚结束的窗口。继续拖动年龄，看看它们如何经过。" },
};

export function EventGroup({ group, items, currentAgeMonths, limit }: {
  group: EventMacroGroup;
  items: VisibleWindow[];
  currentAgeMonths: number;
  limit: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const copy = groupCopy[group];
  const reducedMotion = useReducedMotion();
  const visible = expanded ? items : items.slice(0, limit);

  return (
    <motion.section className={`v3-event-group v3-event-group--${group}`} layout transition={{ duration: reducedMotion ? 0 : 0.32, ease: "easeOut" }}>
      <header className="v3-event-group__heading">
        <div><h2 id={`group-${group}`}>{copy.title}</h2><i aria-hidden="true" /></div>
        <p>{copy.kicker}</p><span aria-label={`${items.length} 个窗口`}>{items.length}</span>
      </header>
      <motion.div id={`cards-${group}`} className="v3-event-group__cards" layout>
        <AnimatePresence initial={false} mode="sync">
          {visible.map((item) => <EventCard key={item.window.id} window={item.window} state={item.state} currentAgeMonths={currentAgeMonths} />)}
        </AnimatePresence>
        {items.length === 0 ? <p className="v3-event-group__empty">{copy.empty}</p> : null}
      </motion.div>
      {items.length > limit ? <button className="v3-event-group__more" type="button" aria-expanded={expanded} aria-controls={`cards-${group}`} onClick={() => setExpanded((value) => !value)}>
        {expanded ? "收起" : `展开其余 ${items.length - limit} 个窗口`}{expanded ? <ChevronUp size={15} aria-hidden="true" /> : <ChevronDown size={15} aria-hidden="true" />}
      </button> : null}
    </motion.section>
  );
}
