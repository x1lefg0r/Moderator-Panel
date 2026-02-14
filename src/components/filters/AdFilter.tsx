import type { AdFilterProps } from "../../types";
import { Button } from "../ui/Button";
import { CategoryFilter } from "./CategoryFilter";
import { PriceFilter } from "./PriceFilter";
import { SearchFilter } from "./SearchFilter";
import { SortFilter } from "./SortFilter";
import { StatusFilter } from "./StatusFilter";

export const AdFilter = ({ filtersHook }: AdFilterProps) => {
  const { filters, setFilter, resetFilters } = filtersHook;

  return (
    <aside className="w-1/4 min-w-[250px] space-y-4">
      <SearchFilter value={filters.search} onChange={setFilter} />
      <SortFilter value={filters.sort} onChange={setFilter} />
      <CategoryFilter value={filters.categoryId} onChange={setFilter} />
      <PriceFilter
        min={filters.minPrice}
        max={filters.maxPrice}
        onChange={setFilter}
      />
      <StatusFilter value={filters.status} onChange={setFilter} />
      <Button onClick={resetFilters} variant="secondary" fullWidth>
        Сбросить фильтры
      </Button>
    </aside>
  );
};
