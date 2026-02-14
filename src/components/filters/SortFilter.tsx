import type { FiltersProps } from "../../types";
import { FilterSection } from "./FilterSection";

export const SortFilter = ({ value, onChange }: FiltersProps) => {
  return (
    <FilterSection title="Сортировка">
      <select
        className="border p-2 w-full rounded"
        value={value}
        onChange={(e) => onChange("sort", e.target.value)}
      >
        <option value="date_desc">Сначала новые</option>
        <option value="date_asc">Сначала старые</option>
        <option value="price_asc">Дешевле</option>
        <option value="price_desc">Дороже</option>
        <option value="priority_desc">По приоритету</option>
      </select>
    </FilterSection>
  );
};
