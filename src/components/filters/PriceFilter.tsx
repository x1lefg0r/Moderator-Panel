import type { FilterState } from "../../types";
import { FilterSection } from "./FilterSection";

interface PriceFilterProps {
  min: string;
  max: string;
  onChange: (key: keyof FilterState, value: string) => void;
}

export const PriceFilter = ({ min, max, onChange }: PriceFilterProps) => {
  return (
    <FilterSection title="Цена">
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="От"
          className="border p-1 w-1/2 rounded"
          value={min}
          onChange={(e) => onChange("minPrice", e.target.value)}
        />
        <input
          type="number"
          placeholder="До"
          className="border p-1 w-1/2 rounded"
          value={max}
          onChange={(e) => onChange("maxPrice", e.target.value)}
        />
      </div>
    </FilterSection>
  );
};
