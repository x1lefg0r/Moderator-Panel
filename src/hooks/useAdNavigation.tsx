import { useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAds, fetchAdById } from "../api/ads";
import {
  SORT_OPTIONS,
  type FilterState,
  type SortOption,
  type AdStatus,
} from "../types";

export const useAdNavigation = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [isNavigating, setIsNavigating] = useState(false);

  const listFilters: FilterState = useMemo(() => {
    const params = new URLSearchParams(location.state?.from || "");
    const rawSort = params.get("sort");
    const sortValue: SortOption = SORT_OPTIONS.includes(rawSort as SortOption)
      ? (rawSort as SortOption)
      : "date_desc";

    return {
      page: Number(params.get("page")) || 1,
      limit: Number(params.get("limit")) || 10,
      status: params.getAll("status") as AdStatus[],
      categoryId: params.get("categoryId") || "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      search: params.get("search") || "",
      sort: sortValue,
    };
  }, [location.state]);

  const { data: adsList } = useQuery({
    queryKey: ["ads", listFilters],
    queryFn: () => fetchAds(listFilters),
    enabled: !!location.state?.from,
    staleTime: 5 * 60 * 1000,
  });

  const handleBack = () => {
    if (location.state?.from) {
      navigate(`/list${location.state.from}`);
    } else {
      navigate("/list");
    }
  };

  const prefetchNext = useCallback(async () => {
    if (!adsList?.ads || !id) return;

    const currentIndex = adsList.ads.findIndex(
      (item) => item.id === Number(id)
    );

    if (currentIndex !== -1 && currentIndex < adsList.ads.length - 1) {
      const nextId = adsList.ads[currentIndex + 1].id;

      await queryClient.prefetchQuery({
        queryKey: ["ad", String(nextId)],
        queryFn: () => fetchAdById(String(nextId)),
      });
    }
  }, [adsList, id, queryClient]);

  const prefetchPrev = useCallback(async () => {
    if (!adsList?.ads || !id) return;

    const currentIndex = adsList.ads.findIndex(
      (item) => item.id === Number(id)
    );

    if (currentIndex > 0) {
      const prevId = adsList.ads[currentIndex - 1].id;

      await queryClient.prefetchQuery({
        queryKey: ["ad", String(prevId)],
        queryFn: () => fetchAdById(String(prevId)),
      });
    }
  }, [adsList, id, queryClient]);

  const handleNext = async () => {
    if (!adsList?.ads || !id) return;

    const currentIndex = adsList.ads.findIndex(
      (item) => item.id === Number(id)
    );

    if (currentIndex !== -1 && currentIndex < adsList.ads.length - 1) {
      const nextId = adsList.ads[currentIndex + 1].id;

      setIsNavigating(true);
      await queryClient.prefetchQuery({
        queryKey: ["ad", String(nextId)],
        queryFn: () => fetchAdById(String(nextId)),
      });
      setIsNavigating(false);

      navigate(`/item/${nextId}`, { state: location.state });
      return;
    }

    if (adsList.pagination.currentPage < adsList.pagination.totalPages) {
      setIsNavigating(true);
      const nextPage = listFilters.page + 1;

      try {
        const nextData = await queryClient.fetchQuery({
          queryKey: ["ads", { ...listFilters, page: nextPage }],
          queryFn: () => fetchAds({ ...listFilters, page: nextPage }),
        });

        if (nextData.ads.length > 0) {
          const nextId = nextData.ads[0].id;

          await queryClient.prefetchQuery({
            queryKey: ["ad", String(nextId)],
            queryFn: () => fetchAdById(String(nextId)),
          });

          const newParams = new URLSearchParams(location.state.from);
          newParams.set("page", String(nextPage));

          navigate(`/item/${nextId}`, {
            state: { from: `?${newParams.toString()}` },
          });
        }
      } finally {
        setIsNavigating(false);
      }
    }
  };

  const handlePrev = async () => {
    if (!adsList?.ads || !id) return;

    const currentIndex = adsList.ads.findIndex(
      (item) => item.id === Number(id)
    );

    if (currentIndex > 0) {
      const prevId = adsList.ads[currentIndex - 1].id;

      setIsNavigating(true);
      await queryClient.prefetchQuery({
        queryKey: ["ad", String(prevId)],
        queryFn: () => fetchAdById(String(prevId)),
      });
      setIsNavigating(false);

      navigate(`/item/${prevId}`, { state: location.state });
      return;
    }

    if (listFilters.page > 1) {
      setIsNavigating(true);
      const prevPage = listFilters.page - 1;

      try {
        const prevData = await queryClient.fetchQuery({
          queryKey: ["ads", { ...listFilters, page: prevPage }],
          queryFn: () => fetchAds({ ...listFilters, page: prevPage }),
        });

        if (prevData.ads.length > 0) {
          const prevId = prevData.ads[prevData.ads.length - 1].id;

          await queryClient.prefetchQuery({
            queryKey: ["ad", String(prevId)],
            queryFn: () => fetchAdById(String(prevId)),
          });

          const newParams = new URLSearchParams(location.state.from);
          newParams.set("page", String(prevPage));

          navigate(`/item/${prevId}`, {
            state: { from: `?${newParams.toString()}` },
          });
        }
      } finally {
        setIsNavigating(false);
      }
    }
  };

  const canGoPrev = useMemo(() => {
    if (!adsList?.ads || !id) return false;
    const currentIndex = adsList.ads.findIndex((ad) => ad.id === Number(id));
    return currentIndex > 0 || listFilters.page > 1;
  }, [adsList, id, listFilters.page]);

  const canGoNext = useMemo(() => {
    if (!adsList?.ads || !id) return false;
    const currentIndex = adsList.ads.findIndex((ad) => ad.id === Number(id));
    return (
      currentIndex < adsList.ads.length - 1 ||
      listFilters.page < adsList.pagination.totalPages
    );
  }, [adsList, id, listFilters.page]);

  return {
    handleBack,
    handleNext,
    handlePrev,
    prefetchNext,
    prefetchPrev,
    isNavigating,
    canGoPrev,
    canGoNext,
  };
};
