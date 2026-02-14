import type { AdStatus, FilterState } from "../../types";
import { FilterSection } from "./FilterSection";

interface StatusFilterProps {
  value: string[];
  onChange: (key: keyof FilterState, value: string[]) => void;
}

export const StatusFilter = ({ value, onChange }: StatusFilterProps) => {
  return (
    <FilterSection title="Статус">
      {["pending", "approved", "rejected", "draft"].map((status) => (
        <label
          key={status}
          className="flex items-center gap-2 cursor-pointer mb-1"
        >
          <input
            type="checkbox"
            checked={value.includes(status as AdStatus)}
            onChange={(e) => {
              const newStatus = e.target.checked
                ? [...value, status]
                : value.filter((s) => s !== status);
              onChange("status", newStatus);
            }}
          />
          <span className="capitalize">{status}</span>
        </label>
      ))}
    </FilterSection>
  );
};
