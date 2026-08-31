import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { categoryLabels } from "../data/windows";
import { formatAgeRange } from "../lib/age";
import { getLifecycleLabel, getLifecycleVisuals } from "../lib/windowLifecycle";
import type { ExpiringLifeWindow, WindowLifecycleState } from "../types";
import { WindowIcon } from "./WindowIcon";

interface EventCardProps {
  window: ExpiringLifeWindow;
  state: WindowLifecycleState;
  currentAgeMonths: number;
}

export function EventCard({ window, state, currentAgeMonths }: EventCardProps) {
  const visuals = getLifecycleVisuals(window, currentAgeMonths);
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      className={`v3-event-card v3-event-card--${window.importance}`}
      data-lifecycle={state}
      layout
      layoutId={`v3-window-${window.id}`}
      initial={reducedMotion ? false : { opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: visuals.opacity, y: 0, scale: visuals.scale }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -5, scale: 0.98 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.36, ease: [0.16, 1, 0.3, 1] }}
      style={{
        backgroundColor: visuals.background,
        borderColor: visuals.border,
        color: visuals.text,
        "--v3-card-icon": visuals.icon,
        "--v3-card-badge-bg": visuals.badgeBackground,
        "--v3-card-badge-text": visuals.badgeText,
        "--v3-card-saturation": visuals.saturation,
      } as CSSProperties}
    >
      <Link to={`/v3/window/${window.slug}`} aria-label={`${window.title}，${getLifecycleLabel(state)}`}>
        <div className="v3-event-card__icon">
          <WindowIcon name={window.icon} size={window.importance === "major" ? 38 : 32} />
        </div>
        <div className="v3-event-card__copy">
          <h3>{window.title}</h3>
          <p>{formatAgeRange(window)}</p>
          <span>{categoryLabels[window.category]}</span>
        </div>
        <span className="v3-event-card__badge">{getLifecycleLabel(state)}</span>
        <ArrowUpRight className="v3-event-card__arrow" aria-hidden="true" />
      </Link>
    </motion.article>
  );
}
