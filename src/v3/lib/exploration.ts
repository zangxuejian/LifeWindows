import { categoryLabels, expiringWindows } from "../data/windows";
import { getWindowContent } from "../data/windowContent";
import { getWindowBounds } from "./age";
import { getLifecycleState, getMacroGroup } from "./windowLifecycle";
import type { ExpiringLifeWindow, WindowCategory } from "../types";

export const stageLabels = { all: "所有阶段", current: "此刻正在经过", upcoming: "尚未开始", past: "已过参考阶段" } as const;
export type ExploreStage = keyof typeof stageLabels;
export interface ExploreFilters { query: string; category: WindowCategory | "all"; stage: ExploreStage }

export function filterWindows(months: number, filters: ExploreFilters): ExpiringLifeWindow[] {
  const terms = filters.query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return expiringWindows.filter((item) => {
    if (filters.category !== "all" && item.category !== filters.category) return false;
    const state = getLifecycleState(item, months);
    if (filters.stage === "current" && !["thriving", "withering"].includes(getMacroGroup(state) ?? "")) return false;
    if (filters.stage === "upcoming" && state !== "notBorn") return false;
    if (filters.stage === "past" && state !== "memorial" && state !== "gone") return false;
    const searchable = `${item.title} ${categoryLabels[item.category]} ${getWindowContent(item).summary}`.toLocaleLowerCase();
    return terms.every((term) => searchable.includes(term));
  }).sort((a, b) => getWindowBounds(a).startMonths - getWindowBounds(b).startMonths || a.id.localeCompare(b.id));
}
