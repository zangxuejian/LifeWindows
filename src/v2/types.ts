export type AgeUnit = "month" | "year";

export type LifeStage =
  | "infant"
  | "toddler"
  | "child"
  | "teen"
  | "youth"
  | "adult"
  | "midlife"
  | "senior";

export type WindowCategory =
  | "infancy"
  | "childhood"
  | "teen"
  | "education"
  | "career"
  | "body"
  | "family"
  | "experience";

export type EvidenceType = "clinical" | "official" | "research" | "editorial";

export type WindowStatus = "missed" | "active" | "closing" | "future" | "possible";

export type WindowIcon =
  | "baby"
  | "ear"
  | "eye"
  | "smile"
  | "speech"
  | "tooth"
  | "book"
  | "school"
  | "briefcase"
  | "heart"
  | "activity"
  | "users"
  | "home"
  | "compass"
  | "plane"
  | "music"
  | "shield"
  | "sparkles"
  | "wallet"
  | "sprout";

export interface GoldenRange {
  startAge: number;
  endAge: number;
}

export interface Evidence {
  type: EvidenceType;
  label: string;
  note: string;
  url?: string;
}

export interface WindowDetail {
  question?: string;
  answer: string;
  whyChanges: string;
  whatNow: string[];
  boundaries: string[];
}

export interface LifeWindowV2 {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  category: WindowCategory;
  lifeStage: LifeStage;
  icon: WindowIcon;
  startAge: number;
  endAge?: number;
  ageUnit: AgeUnit;
  golden?: GoldenRange;
  hardEnd?: boolean;
  alwaysOpen?: boolean;
  closingThresholdMonths?: number;
  summary: string;
  featured?: boolean;
  priority?: number;
  evidence: Evidence;
  detail: WindowDetail;
}

export interface LifeStageOption {
  id: "all" | LifeStage;
  label: string;
  shortLabel: string;
  startYear: number;
  endYear: number;
}
