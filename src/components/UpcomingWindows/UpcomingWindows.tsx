import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getAttentionEnd, getAttentionLabel } from "../../lib/windowStatus";
import type { LifeWindow } from "../../types/window";

export function UpcomingWindows({ windows, age }: { windows: LifeWindow[]; age: number }) {
  if (windows.length === 0) {
    return <p className="empty-message">接下来 10 年内，没有明确的关闭节点。</p>;
  }

  return (
    <div className="upcoming-list">
      {windows.map((window) => {
        const end = getAttentionEnd(window) ?? age;
        const years = Math.max(0, Math.ceil(end - age));
        return (
          <Link className="upcoming-list__row" to={`/window/${window.slug}`} key={window.id}>
            <span className="upcoming-list__age">{end}<small>岁</small></span>
            <span className="upcoming-list__body">
              <strong>{window.title}</strong>
              <span className="upcoming-list__rail" aria-hidden="true">
                <i style={{ width: `${Math.max(8, 100 - years * 8)}%` }} />
              </span>
              <small>{years === 0 ? "当前节点" : `约 ${years} 年后${getAttentionLabel(window)}`}</small>
            </span>
            <ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        );
      })}
    </div>
  );
}
