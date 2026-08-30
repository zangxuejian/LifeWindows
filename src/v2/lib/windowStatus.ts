import type { AgeUnit, LifeWindowV2, WindowStatus } from "../types";

const STATUS_COLORS: Record<WindowStatus, string> = {
  missed: "#587B9A",
  active: "#19713E",
  closing: "#C87500",
  future: "#1671C9",
  possible: "#C87500",
};

export function toMonths(value: number, unit: AgeUnit): number {
  return unit === "month" ? value : value * 12;
}

export function getWindowStartMonths(window: LifeWindowV2): number {
  return toMonths(window.startAge, window.ageUnit);
}

export function getWindowEndMonths(window: LifeWindowV2): number | undefined {
  return window.endAge === undefined ? undefined : toMonths(window.endAge, window.ageUnit);
}

export function getWindowStatus(window: LifeWindowV2, currentAgeYears: number): WindowStatus {
  const currentMonths = currentAgeYears * 12;
  const startMonths = getWindowStartMonths(window);
  const endMonths = getWindowEndMonths(window);

  if (currentMonths < startMonths) return "future";
  if (window.alwaysOpen || endMonths === undefined) return "active";

  if (currentMonths > endMonths) {
    return window.hardEnd ? "missed" : "possible";
  }

  const closingThreshold = window.closingThresholdMonths ?? (window.ageUnit === "month" ? 2 : 24);
  return endMonths - currentMonths <= closingThreshold ? "closing" : "active";
}

export function getWindowColor(statusOrWindow: WindowStatus | LifeWindowV2, currentAgeYears?: number): string {
  const status =
    typeof statusOrWindow === "string"
      ? statusOrWindow
      : getWindowStatus(statusOrWindow, currentAgeYears ?? 0);
  return STATUS_COLORS[status];
}

export function getWindowLabel(window: LifeWindowV2, currentAgeYears: number): string {
  const status = getWindowStatus(window, currentAgeYears);
  if (status === "missed") return "已错过";
  if (status === "future") return "未来开启";
  if (status === "closing") return "即将关闭";
  if (status === "possible") return window.golden ? "黄金期已过 · 仍可进行" : "常见窗口已过 · 仍可进行";
  return window.alwaysOpen ? "长期开放" : "正在经历";
}

function formatDuration(months: number): string {
  if (months < 12) return `${Math.max(1, Math.ceil(months))} 个月`;
  const years = months / 12;
  return Number.isInteger(years) ? `${years} 年` : `${years.toFixed(1)} 年`;
}

export function getRemainingTime(window: LifeWindowV2, currentAgeYears: number): string {
  const currentMonths = currentAgeYears * 12;
  const startMonths = getWindowStartMonths(window);
  const endMonths = getWindowEndMonths(window);
  const status = getWindowStatus(window, currentAgeYears);

  if (status === "future") return `${formatDuration(startMonths - currentMonths)}后开启`;
  if (status === "active" && endMonths === undefined) return "没有预设截止年龄";
  if (status === "active" || status === "closing") {
    return endMonths === undefined ? "长期开放" : `还剩 ${formatDuration(endMonths - currentMonths)}`;
  }
  if (status === "possible") return "常见阶段已过，仍可重新评估";
  return "这一阶段已经结束";
}

export function formatAgeRange(window: LifeWindowV2): string {
  const suffix = window.ageUnit === "month" ? "月" : "岁";
  if (window.endAge === undefined) return `${window.startAge}${suffix}起`;
  return `${window.startAge}–${window.endAge}${suffix}`;
}

export function getWindowRangeYears(window: LifeWindowV2): { start: number; end: number } {
  const divisor = window.ageUnit === "month" ? 12 : 1;
  return {
    start: window.startAge / divisor,
    end: (window.endAge ?? 100 * divisor) / divisor,
  };
}
