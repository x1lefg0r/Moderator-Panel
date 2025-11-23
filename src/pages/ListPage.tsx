import { useAdsFilters } from "../hooks/useAdsFilters";
import { fetchAds } from "../api/ads";
import { type AdStatus, categories } from "../types";
import { AdCard } from "../components/ads/AdCard.tsx";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const ListPage = () => {
  const { filters, setFilter, handleSearch, resetFilters } = useAdsFilters();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ads", filters],
    queryFn: () => fetchAds(filters),
    placeholderData: keepPreviousData,
  });

  const ads = data?.ads || [];
  const pagination = data?.pagination;

  return (
    <div className="container mx-auto p-4 flex gap-6">
      <aside className="w-1/4 min-w-[250px] space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Поиск</h3>
          <input
            className="border p-2 w-full rounded"
            placeholder="Название..."
            defaultValue={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Сортировка</h3>
          <select
            className="border p-2 w-full rounded"
            value={filters.sort}
            onChange={(e) => setFilter("sort", e.target.value)}
          >
            <option value="date_desc">Сначала новые</option>
            <option value="date_asc">Сначала старые</option>
            <option value="price_asc">Дешевле</option>
            <option value="price_desc">Дороже</option>
            <option value="priority_desc">По приоритету</option>
          </select>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Категория</h3>
          <select
            className="border p-2 w-full rounded"
            value={filters.categoryId}
            onChange={(e) => setFilter("categoryId", e.target.value)}
          >
            <option value="">Все категории</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Цена</h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="От"
              className="border p-1 w-1/2 rounded"
              value={filters.minPrice}
              onChange={(e) => setFilter("minPrice", e.target.value)}
            />
            <input
              type="number"
              placeholder="До"
              className="border p-1 w-1/2 rounded"
              value={filters.maxPrice}
              onChange={(e) => setFilter("maxPrice", e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Статус</h3>
          {["pending", "approved", "rejected", "draft"].map((status) => (
            <label
              key={status}
              className="flex items-center gap-2 cursor-pointer mb-1"
            >
              <input
                type="checkbox"
                checked={filters.status.includes(status as AdStatus)}
                onChange={(e) => {
                  const newStatus = e.target.checked
                    ? [...filters.status, status]
                    : filters.status.filter((s) => s !== status);
                  setFilter("status", newStatus);
                }}
              />
              <span className="capitalize">{status}</span>
            </label>
          ))}
        </div>

        <button
          onClick={resetFilters}
          className="w-full bg-gray-200 py-2 rounded"
        >
          Сбросить фильтры
        </button>
      </aside>

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
