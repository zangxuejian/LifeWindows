export type WindowCategory =
  | "development"
  | "education"
  | "health"
  | "dental"
  | "vision"
  | "career"
  | "family"
  | "policy";

export type WindowType = "hard" | "institutional" | "biological" | "golden";

export type WindowImportance = "normal" | "important" | "major";

export type EvidenceLevel = "official" | "research" | "clinical" | "statistical" | "editorial";

export type WindowIconName =
  | "baby"
  | "ear"
  | "heart"
  | "footprints"
  | "utensils"
  | "message"
  | "tooth"
  | "school"
  | "book"
  | "eye"
  | "waves"
  | "activity"
  | "graduation"
  | "briefcase"
  | "trophy"
  | "users"
  | "rocket"
  | "compass"
  | "shield"
  | "calendar"
  | "bone"
  | "landmark"
  | "car"
  | "badge";

export interface AgePoint {
  value: number;
  unit: "month" | "year";
}

export interface ExpiringLifeWindow {
  id: string;
  slug: string;
  title: string;
  category: WindowCategory;
  icon: WindowIconName;
  start: AgePoint;
  end: AgePoint;
  type: WindowType;
  importance: WindowImportance;
  evidenceLevel: EvidenceLevel;
  summary?: string;
  sourceNote?: string;
  region?: string[];
  lastVerified?: string;
}

export type WindowLifecycleState =
  | "notBorn"
  | "emerging"
  | "fresh"
  | "mature"
  | "withering"
  | "memorial"
  | "gone";

export type EventMacroGroup = "thriving" | "withering" | "memorial";

export interface WindowVisualState {
  background: string;
  border: string;
  text: string;
  icon: string;
  badgeBackground: string;
  badgeText: string;
  opacity: number;
  saturation: number;
  scale: number;
}
