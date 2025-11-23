import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";
import type { FilterState, AdStatus } from "../types";
import debounce from "debounce";
import { SORT_OPTIONS, type SortOption } from "../types";

export const useAdsFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: FilterState = useMemo(() => {
    const rawSort = searchParams.get("sort");

    const sortValue: SortOption = SORT_OPTIONS.includes(rawSort as SortOption)
      ? (rawSort as SortOption)
      : "date_desc";

    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      status: searchParams.getAll("status") as AdStatus[],
      categoryId: searchParams.get("categoryId") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      search: searchParams.get("search") || "",
      sort: sortValue,
    };
  }, [searchParams]);

  const setFilter = useCallback(
    (key: keyof FilterState, value: string | string[]) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev.toString());

        if (key === "status") {
          newParams.delete("status");
          (value as string[]).forEach((status) =>
            newParams.append("status", status)
          );
        } else if (value === "" || value === null) {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }

        if (key !== "page") {
          newParams.set("page", "1");
        }

        return newParams;
      });
    },
    [setSearchParams]
  );

  const handleSearch = useMemo(
    () => debounce((value: string) => setFilter("search", value), 200),
    [setFilter]
  );

  const resetFilters = () => setSearchParams({});

  return { filters, setFilter, handleSearch, resetFilters };
};
