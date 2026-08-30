import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatAgeRange, getWindowRange, getWindowStatus } from "../../lib/windowStatus";
import { categoryLabels, type LifeWindow } from "../../types/window";
import { WindowStatus } from "../WindowStatus/WindowStatus";

interface WindowListProps {
  windows: LifeWindow[];
  age: number;
  emptyText?: string;
}

export function WindowList({ windows, age, emptyText = "当前筛选下暂无窗口。" }: WindowListProps) {
  if (windows.length === 0) return <p className="empty-message">{emptyText}</p>;

  return (
    <div className="window-list">
      {windows.map((window) => {
        const status = getWindowStatus(window, age);
        const range = getWindowRange(window);
        return (
          <Link to={`/window/${window.slug}`} className="window-list__row" key={window.id}>
            <span className="window-list__title">
              <span>{window.title}</span>
              <small>{categoryLabels[window.category]}</small>
            </span>
            <WindowStatus status={status.status} label={status.label} />
            <span className="window-list__range">
              {formatAgeRange(range.start, range.end, window.alwaysOpen)}
            </span>
            <ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        );
      })}
    </div>
  );
}
