import { categories, type FiltersProps } from "../../types";
import { FilterSection } from "./FilterSection";

export const CategoryFilter = ({ value, onChange }: FiltersProps) => {
  return (
    <FilterSection title="Категория">
      <select
        className="border p-2 w-full rounded"
        value={value}
        onChange={(e) => onChange("categoryId", e.target.value)}
      >
        <option value="">Все категории</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </FilterSection>
  );
};
