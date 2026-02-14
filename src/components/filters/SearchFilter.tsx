import type { FiltersProps } from "../../types";
import { FilterSection } from "./FilterSection";

export const SearchFilter = ({ value, onChange }: FiltersProps) => {
  return (
    <FilterSection title="Поиск">
      <input
        className="border p-2 w-full rounded"
        placeholder="Название..."
        defaultValue={value}
        onChange={(e) => onChange("search", e.target.value)}
      />
    </FilterSection>
  );
};
