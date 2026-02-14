import type { FilterSectionProps } from "../../types";

export const FilterSection = ({ title, children }: FilterSectionProps) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">{title}</h3>
      {children}
    </div>
  );
};
