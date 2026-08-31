import { getWindowBounds } from "./age";
import type {
  EventMacroGroup,
  ExpiringLifeWindow,
  WindowLifecycleState,
  WindowVisualState,
} from "../types";

const MIN_MEMORIAL_MONTHS = 6;
const MAX_MEMORIAL_MONTHS = 24;

interface OklchColor {
  l: number;
  c: number;
  h: number;
}

interface ColorStop extends OklchColor {
  at: number;
}

const lifecycleStops: ColorStop[] = [
  { at: 0, l: 0.965, c: 0.022, h: 178 },
  { at: 0.15, l: 0.91, c: 0.052, h: 174 },
  { at: 0.55, l: 0.84, c: 0.078, h: 169 },
  { at: 0.72, l: 0.82, c: 0.07, h: 100 },
  { at: 0.86, l: 0.87, c: 0.085, h: 65 },
  { at: 1, l: 0.88, c: 0.064, h: 63 },
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function mix(a: number, b: number, amount: number): number {
  return a + (b - a) * amount;
}

function mixHue(a: number, b: number, amount: number): number {
  const delta = ((b - a + 540) % 360) - 180;
  return (a + delta * amount + 360) % 360;
}

function formatOklch(color: OklchColor): string {
  return `oklch(${(color.l * 100).toFixed(2)}% ${color.c.toFixed(4)} ${color.h.toFixed(2)})`;
}

function interpolateLifecycleColor(progress: number): OklchColor {
  const p = clamp(progress, 0, 1);
  const upperIndex = lifecycleStops.findIndex((stop) => stop.at >= p);
  if (upperIndex <= 0) return lifecycleStops[0];

  const start = lifecycleStops[upperIndex - 1];
  const end = lifecycleStops[upperIndex];
  const localProgress = (p - start.at) / (end.at - start.at);

  return {
    l: mix(start.l, end.l, localProgress),
    c: mix(start.c, end.c, localProgress),
    h: mixHue(start.h, end.h, localProgress),
  };
}

export function getMemorialDurationMonths(window: ExpiringLifeWindow): number {
  const { startMonths, endMonths } = getWindowBounds(window);
  const duration = Math.max(1, endMonths - startMonths);
  return clamp(duration * 0.15, MIN_MEMORIAL_MONTHS, MAX_MEMORIAL_MONTHS);
}

export function getLifecycleProgress(window: ExpiringLifeWindow, currentAgeMonths: number): number {
  const { startMonths, endMonths } = getWindowBounds(window);
  const duration = Math.max(1, endMonths - startMonths);
  return clamp((currentAgeMonths - startMonths) / duration, 0, 1);
}

export function getLifecycleState(
  window: ExpiringLifeWindow,
  currentAgeMonths: number,
): WindowLifecycleState {
  const { startMonths, endMonths } = getWindowBounds(window);
  if (currentAgeMonths < startMonths) return "notBorn";

  if (currentAgeMonths <= endMonths) {
    const progress = getLifecycleProgress(window, currentAgeMonths);
    if (progress < 0.15) return "emerging";
    if (progress < 0.55) return "fresh";
    if (progress < 0.72) return "mature";
    return "withering";
  }

  if (currentAgeMonths < endMonths + getMemorialDurationMonths(window)) return "memorial";
  return "gone";
}

export function getMacroGroup(state: WindowLifecycleState): EventMacroGroup | null {
  if (state === "emerging" || state === "fresh" || state === "mature") return "thriving";
  if (state === "withering") return "withering";
  if (state === "memorial") return "memorial";
  return null;
}

export function getLifecycleLabel(state: WindowLifecycleState): string {
  const labels: Record<WindowLifecycleState, string> = {
    notBorn: "尚未出现",
    emerging: "刚刚开始",
    fresh: "新鲜期",
    mature: "成熟期",
    withering: "正在凋谢",
    memorial: "纪念中",
    gone: "已经离场",
  };
  return labels[state];
}

export function getLifecycleVisuals(
  window: ExpiringLifeWindow,
  currentAgeMonths: number,
): WindowVisualState {
  const state = getLifecycleState(window, currentAgeMonths);

  if (state === "memorial" || state === "gone") {
    const { endMonths } = getWindowBounds(window);
    const memorialDuration = getMemorialDurationMonths(window);
    const memorialProgress = clamp((currentAgeMonths - endMonths) / memorialDuration, 0, 1);
    const gray = {
      l: mix(0.9, 0.86, memorialProgress),
      c: mix(0.025, 0.012, memorialProgress),
      h: 238,
    };

    return {
      background: formatOklch(gray),
      border: `oklch(${mix(76, 72, memorialProgress).toFixed(2)}% 0.028 238)`,
      text: "oklch(35% 0.035 238)",
      icon: "oklch(44% 0.05 238)",
      badgeBackground: "oklch(82% 0.035 238)",
      badgeText: "oklch(37% 0.048 238)",
      opacity: state === "gone" ? 0 : mix(0.98, 0.42, memorialProgress),
      saturation: mix(0.55, 0.2, memorialProgress),
      scale: mix(1, 0.98, memorialProgress),
    };
  }

  const progress = getLifecycleProgress(window, currentAgeMonths);
  const color = interpolateLifecycleColor(progress);
  const isWithering = state === "withering";
  const hue = isWithering ? 58 : 174;

  return {
    background: formatOklch(color),
    border: `oklch(${isWithering ? 71 : 67}% ${isWithering ? 0.105 : 0.08} ${hue})`,
    text: `oklch(${isWithering ? 35 : 31}% ${isWithering ? 0.065 : 0.055} ${isWithering ? 55 : 210})`,
    icon: `oklch(${isWithering ? 48 : 39}% ${isWithering ? 0.12 : 0.095} ${hue})`,
    badgeBackground: `oklch(${isWithering ? 82 : 8}% ${isWithering ? 0.1 : 0.025} ${hue} / ${isWithering ? 0.72 : 0.12})`,
    badgeText: `oklch(${isWithering ? 43 : 34}% ${isWithering ? 0.11 : 0.08} ${hue})`,
    opacity: state === "emerging" ? mix(0.72, 1, progress / 0.15) : 1,
    saturation: 1,
    scale: state === "emerging" ? mix(0.97, 1, progress / 0.15) : 1,
  };
}
