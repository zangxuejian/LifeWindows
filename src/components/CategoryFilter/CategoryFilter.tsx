import { categoryLabels, type WindowCategory } from "../../types/window";

export type CategorySelection = "all" | WindowCategory;

interface CategoryFilterProps {
  value: CategorySelection;
  onChange: (category: CategorySelection) => void;
}

const categories: CategorySelection[] = [
  "all",
  "growth",
  "education",
  "career",
  "health",
  "family",
  "experience",
];

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="category-filter" role="tablist" aria-label="人生窗口分类">
      {categories.map((category) => (
        <button
          type="button"
          role="tab"
          aria-selected={value === category}
          className={value === category ? "is-active" : ""}
          key={category}
          onClick={() => onChange(category)}
        >
          {category === "all" ? "全部" : categoryLabels[category]}
        </button>
      ))}
    </div>
  );
}
