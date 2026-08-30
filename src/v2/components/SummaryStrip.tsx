import { Hourglass, LockKeyhole, Sprout, Waves } from "lucide-react";
import { useMemo } from "react";
import { lifeWindowsV2 } from "../data/windows";
import { getWindowStatus } from "../lib/windowStatus";

const items = [
  { id: "missed", label: "已错过", description: "阶段或硬性入口已结束", Icon: LockKeyhole },
  { id: "active", label: "正在经历", description: "包括仍可重新进入的窗口", Icon: Waves },
  { id: "closing", label: "即将关闭", description: "常见阶段接近尾声", Icon: Hourglass },
  { id: "future", label: "未来开启", description: "尚未到来的窗口", Icon: Sprout },
] as const;

export function SummaryStrip({ age }: { age: number }) {
  const counts = useMemo(() => {
    const next = { missed: 0, active: 0, closing: 0, future: 0 };
    for (const window of lifeWindowsV2) {
      const status = getWindowStatus(window, age);
      if (status === "possible") next.active += 1;
      else next[status] += 1;
    }
    return next;
  }, [age]);

  return (
    <section className="v2-summary" aria-label={`${age} 岁的人生窗口摘要`} data-testid="summary-strip">
      {items.map(({ id, label, description, Icon }) => (
        <article key={id} className={`v2-summary__item is-${id}`} data-status={id}>
          <Icon aria-hidden="true" />
          <div>
            <span>{label}</span>
            <strong>{counts[id]}</strong>
            <small>{description}</small>
          </div>
        </article>
      ))}
    </section>
  );
}
