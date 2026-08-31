import { expiringWindows } from "../data/windows";
import { getWindowBounds } from "./age";
import { getLifecycleState, getMacroGroup } from "./windowLifecycle";
import type { EventMacroGroup, ExpiringLifeWindow, WindowLifecycleState } from "../types";

export interface VisibleWindow {
  window: ExpiringLifeWindow;
  state: WindowLifecycleState;
  group: EventMacroGroup;
}

const importanceRank = { major: 0, important: 1, normal: 2 } as const;
const thrivingStateRank: Partial<Record<WindowLifecycleState, number>> = {
  mature: 0,
  fresh: 1,
  emerging: 2,
};

export function getVisibleWindows(currentAgeMonths: number): VisibleWindow[] {
  return expiringWindows.flatMap((window) => {
    const state = getLifecycleState(window, currentAgeMonths);
    const group = getMacroGroup(state);
    return group ? [{ window, state, group }] : [];
  });
}

export function groupVisibleWindows(currentAgeMonths: number) {
  const groups: Record<EventMacroGroup, VisibleWindow[]> = {
    thriving: [],
    withering: [],
    memorial: [],
  };

  for (const item of getVisibleWindows(currentAgeMonths)) groups[item.group].push(item);

  groups.thriving.sort((a, b) => {
    const importance = importanceRank[a.window.importance] - importanceRank[b.window.importance];
    if (importance !== 0) return importance;
    const state = (thrivingStateRank[a.state] ?? 9) - (thrivingStateRank[b.state] ?? 9);
    if (state !== 0) return state;
    return a.window.id.localeCompare(b.window.id);
  });

  groups.withering.sort((a, b) => {
    const end = getWindowBounds(a.window).endMonths - getWindowBounds(b.window).endMonths;
    if (end !== 0) return end;
    return importanceRank[a.window.importance] - importanceRank[b.window.importance];
  });

  groups.memorial.sort((a, b) => {
    const end = getWindowBounds(b.window).endMonths - getWindowBounds(a.window).endMonths;
    if (end !== 0) return end;
    return importanceRank[a.window.importance] - importanceRank[b.window.importance];
  });

  return groups;
}
