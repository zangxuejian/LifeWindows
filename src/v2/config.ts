import type { LifeStageOption, WindowCategory } from "./types";

export const categoryMeta: Record<WindowCategory, { label: string; shortLabel: string }> = {
  infancy: { label: "婴幼儿", shortLabel: "婴幼儿" },
  childhood: { label: "童年", shortLabel: "童年" },
  teen: { label: "青少年", shortLabel: "青少年" },
  education: { label: "教育", shortLabel: "教育" },
  career: { label: "职业", shortLabel: "职业" },
  body: { label: "身体", shortLabel: "身体" },
  family: { label: "家庭", shortLabel: "家庭" },
  experience: { label: "体验", shortLabel: "体验" },
};

export const lifeStageOptions: LifeStageOption[] = [
  { id: "all", label: "人生全景", shortLabel: "全景", startYear: 0, endYear: 100 },
  { id: "infant", label: "婴儿 0–1", shortLabel: "婴儿", startYear: 0, endYear: 1 },
  { id: "toddler", label: "幼儿 1–3", shortLabel: "幼儿", startYear: 1, endYear: 3 },
  { id: "child", label: "童年 3–12", shortLabel: "童年", startYear: 3, endYear: 12 },
  { id: "teen", label: "青少年 12–18", shortLabel: "青少年", startYear: 12, endYear: 18 },
  { id: "youth", label: "青年 18–35", shortLabel: "青年", startYear: 18, endYear: 35 },
  { id: "adult", label: "成年 35–50", shortLabel: "成年", startYear: 35, endYear: 50 },
  { id: "midlife", label: "中年 50–65", shortLabel: "中年", startYear: 50, endYear: 65 },
  { id: "senior", label: "老年 65+", shortLabel: "老年", startYear: 65, endYear: 100 },
];

export const categoryOptions: Array<{ id: "all" | WindowCategory; label: string }> = [
  { id: "all", label: "全部" },
  ...Object.entries(categoryMeta).map(([id, meta]) => ({
    id: id as WindowCategory,
    label: meta.label,
  })),
];
