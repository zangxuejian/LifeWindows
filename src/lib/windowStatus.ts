import type { LifeWindow, WindowStatus } from "../types/window";

export interface WindowStatusResult {
  status: WindowStatus;
  label: string;
  detail?: string;
}

const STATUS_LABELS: Record<WindowStatus, string> = {
  future: "未来开启",
  active: "正在开放",
  closingSoon: "即将关闭",
  goldenPassed: "黄金期已过 · 仍然可以",
  closed: "窗口已关闭",
  alwaysOpen: "长期开放",
};

function getStartAge(window: LifeWindow): number {
  return (
    window.hardStartAge ??
    window.goldenStartAge ??
    window.typicalStartAge ??
    0
  );
}

function getRelevantEndAge(window: LifeWindow): number | undefined {
  if (window.type === "hard" || window.type === "institutional") {
    return window.hardEndAge ?? window.typicalEndAge;
  }
  return window.goldenEndAge ?? window.typicalEndAge;
}

export function getWindowStatus(window: LifeWindow, age: number): WindowStatusResult {
  const startAge = getStartAge(window);

  if (age < startAge) {
    return {
      status: "future",
      label: STATUS_LABELS.future,
      detail: `约 ${Math.ceil(startAge - age)} 年后开启`,
    };
  }

  if (window.alwaysOpen) {
    return { status: "alwaysOpen", label: STATUS_LABELS.alwaysOpen };
  }

  const endAge = getRelevantEndAge(window);
  if (endAge === undefined) {
    return { status: "alwaysOpen", label: STATUS_LABELS.alwaysOpen };
  }

  const isRuleBound = window.type === "hard" || window.type === "institutional";
  if (age <= endAge) {
    const yearsRemaining = Math.max(0, endAge - age);
    if (isRuleBound && yearsRemaining <= 2) {
      return {
        status: "closingSoon",
        label: STATUS_LABELS.closingSoon,
        detail: yearsRemaining === 0 ? "本年龄段内关闭" : `约剩 ${Math.ceil(yearsRemaining)} 年`,
      };
    }
    return { status: "active", label: STATUS_LABELS.active };
  }

  if (window.canDoAfterWindow) {
    return {
      status: "goldenPassed",
      label: STATUS_LABELS.goldenPassed,
      detail: window.afterWindowMessage,
    };
  }

  const yearsAgo = Math.floor(age - endAge);
  return {
    status: "closed",
    label: STATUS_LABELS.closed,
    detail: yearsAgo > 0 ? `${yearsAgo} 年前关闭` : undefined,
  };
}

export function getWindowRange(window: LifeWindow): { start: number; end: number } {
  return {
    start: getStartAge(window),
    end: window.alwaysOpen ? 100 : (getRelevantEndAge(window) ?? 100),
  };
}

export function getAttentionEnd(window: LifeWindow): number | null {
  if (window.alwaysOpen) return null;
  return getRelevantEndAge(window) ?? null;
}

export function getAttentionLabel(window: LifeWindow): string {
  return window.canDoAfterWindow ? "黄金窗口结束" : "窗口关闭";
}

export function formatAgeRange(start?: number, end?: number, alwaysOpen?: boolean): string {
  if (alwaysOpen && start !== undefined) return `${start} 岁起 · 长期开放`;
  if (alwaysOpen) return "长期开放";
  if (start !== undefined && end !== undefined) return `${start}—${end} 岁`;
  if (start !== undefined) return `${start} 岁起`;
  if (end !== undefined) return `至 ${end} 岁`;
  return "无明确年龄范围";
}

export function isAvailableStatus(status: WindowStatus): boolean {
  return ["active", "closingSoon", "goldenPassed", "alwaysOpen"].includes(status);
}
