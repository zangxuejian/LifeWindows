import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";
import { formatAgeRange, getRemainingTime, getWindowColor, getWindowLabel, getWindowStatus } from "../lib/windowStatus";
import type { LifeWindowV2 } from "../types";
import { WindowIcon } from "./WindowIcon";

interface WindowCardProps {
  window: LifeWindowV2;
  age: number;
  style?: React.CSSProperties;
  compact?: boolean;
}

export const WindowCard = memo(function WindowCard({ window, age, style, compact = false }: WindowCardProps) {
  const status = getWindowStatus(window, age);
  const color = getWindowColor(status);

  return (
    <motion.article
      className={`v2-window-card ${compact ? "v2-window-card--compact" : ""}`}
      style={{ ...style, "--status-color": color } as React.CSSProperties}
      data-status={status}
      data-window-slug={window.slug}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      layout="position"
    >
      <Link to={`/window/${window.slug}`} aria-label={`${window.title}，${getWindowLabel(window, age)}`}>
        <WindowIcon name={window.icon} size={compact ? 20 : 23} />
        <div className="v2-window-card__body">
          <strong>{window.shortTitle ?? window.title}</strong>
          <span>{formatAgeRange(window)}</span>
        </div>
        <div className="v2-window-card__status">
          <span>{getWindowLabel(window, age)}</span>
          {compact ? null : <small>{getRemainingTime(window, age)}</small>}
        </div>
        {compact ? null : <ArrowUpRight className="v2-window-card__arrow" size={15} aria-hidden="true" />}
      </Link>
    </motion.article>
  );
});
