export type WindowType =
  | "hard"
  | "institutional"
  | "biological"
  | "golden"
  | "social"
  | "open";

export type WindowStatus =
  | "future"
  | "active"
  | "closingSoon"
  | "goldenPassed"
  | "closed"
  | "alwaysOpen";

export type WindowCategory =
  | "growth"
  | "education"
  | "career"
  | "health"
  | "family"
  | "experience";

export type EvidenceLevel =
  | "official"
  | "research"
  | "statistical"
  | "social"
  | "editorial";

export interface WindowGoal {
  name: string;
  status: "open" | "difficult" | "closed";
  description: string;
}

export interface LifeWindow {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  category: WindowCategory;
  type: WindowType;
  description: string;
  typicalStartAge?: number;
  typicalEndAge?: number;
  goldenStartAge?: number;
  goldenEndAge?: number;
  hardStartAge?: number;
  hardEndAge?: number;
  alwaysOpen?: boolean;
  region?: string[];
  evidenceLevel: EvidenceLevel;
  canDoAfterWindow: boolean;
  afterWindowMessage?: string;
  sourceNote?: string;
  goals?: WindowGoal[];
  keywords?: string[];
  featured?: boolean;
  lastReviewed?: string;
}

export const categoryLabels: Record<WindowCategory, string> = {
  growth: "成长",
  education: "教育",
  career: "职业",
  health: "身体",
  family: "家庭",
  experience: "体验",
};

export const evidenceLabels: Record<EvidenceLevel, string> = {
  official: "官方规则",
  research: "科研证据",
  statistical: "统计规律",
  social: "社会常见情况",
  editorial: "编辑判断",
};

export const windowTypeLabels: Record<WindowType, string> = {
  hard: "硬窗口",
  institutional: "制度窗口",
  biological: "生理窗口",
  golden: "黄金窗口",
  social: "社会常见阶段",
  open: "长期开放",
};
