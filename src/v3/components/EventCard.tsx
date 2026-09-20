import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { categoryLabels } from "../data/windows";
import { formatAgeRange } from "../lib/age";
import { getLifecycleLabel, getLifecycleVisuals } from "../lib/windowLifecycle";
import type { ExpiringLifeWindow, WindowLifecycleState } from "../types";
import { WindowIcon } from "./WindowIcon";

export function EventCard({ window: item, state, currentAgeMonths }: { window: ExpiringLifeWindow; state: WindowLifecycleState; currentAgeMonths: number }) {
  const visuals = getLifecycleVisuals(item, currentAgeMonths);
  const reducedMotion = useReducedMotion();
  return <motion.article className={`v3-event-card v3-event-card--${item.importance}`} data-window-id={item.id} data-lifecycle={state} layout layoutId={`v3-window-${item.id}`} initial={reducedMotion ? false : { opacity: 0, scale: .97 }} animate={{ opacity: visuals.opacity, scale: visuals.scale }} exit={{ opacity: 0, scale: reducedMotion ? 1 : .98 }} transition={{ duration: reducedMotion ? 0 : .32, ease: "easeOut" }} style={{
    backgroundColor: visuals.background, borderColor: visuals.border, color: visuals.text,
    "--v3-card-icon": visuals.icon, "--v3-card-badge-bg": visuals.badgeBackground,
    "--v3-card-badge-text": visuals.badgeText, "--v3-card-saturation": visuals.saturation,
  } as CSSProperties}>
    <Link to={`/v3/window/${item.slug}?age=${currentAgeMonths / 12}`} aria-label={`${item.title}，${formatAgeRange(item)}，${getLifecycleLabel(state)}，查看详情`}>
      <div className="v3-event-card__icon"><WindowIcon name={item.icon} size={item.importance === "major" ? 34 : 30} /></div>
      <div className="v3-event-card__copy"><h3>{item.title}</h3><p>{formatAgeRange(item)}</p><span>{categoryLabels[item.category]}</span></div>
      <span className="v3-event-card__badge">{getLifecycleLabel(state)}</span><ArrowUpRight className="v3-event-card__arrow" aria-hidden="true" />
    </Link>
  </motion.article>;
}
