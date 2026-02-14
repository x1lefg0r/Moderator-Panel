import { useAdsFilters } from "../hooks/useAdsFilters";
import { fetchAds } from "../api/ads";
import { AdCard } from "../components/ads/AdCard.tsx";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AdFilter } from "../components/filters/AdFilter.tsx";

const ListPage = () => {
  const filtersHook = useAdsFilters();
  const { filters, setFilter } = filtersHook;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ads", filters],
    queryFn: () => fetchAds(filters),
    placeholderData: keepPreviousData,
  });

  const ads = data?.ads || [];
  const pagination = data?.pagination;

  return (
    <div className="container mx-auto p-4 flex gap-6">
      <AdFilter filtersHook={filtersHook} />
      <main className="w-3/4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Объявления</h1>
          {pagination && (
            <span className="text-gray-500">
              Найдено: {pagination.totalItems}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-10">Загрузка...</div>
        ) : isError ? (
          <div className="text-red-500">{isError}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}

            {ads.length === 0 && (
              <div className="col-span-3 text-center text-gray-500">
                Объявления не найдены
              </div>
            )}
          </div>
        )}

        {pagination && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              disabled={pagination.currentPage === 1}
              onClick={() =>
                setFilter("page", String(pagination.currentPage - 1))
              }
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Назад
            </button>
            <span className="px-4 py-2">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            <button
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() =>
                setFilter("page", String(pagination.currentPage + 1))
              }
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Вперед
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ListPage;
