import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  type FilterState,
  type SortOption,
  SORT_OPTIONS,
  type AdStatus,
} from "../types.ts";
import { fetchAdById, fetchAds } from "../api/ads.ts";
import { ImageGallery } from "../components/ui/ImageGallery.tsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { ModerationModal } from "../components/modal/ModerationModal.tsx";
import { ModerationHistory } from "../components/moderation/ModerationHistory.tsx";
import { ModerationActions } from "../components/moderation/ModerationActions.tsx";

const ItemPage = () => {
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

  const {
    data: ad,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ad", id],
    queryFn: () => fetchAdById(id!),
    enabled: !!id,
  });

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

  const handleNext = async () => {
    if (!adsList?.ads || !id) return;

    const currentIndex = adsList.ads.findIndex(
      (item) => item.id === Number(id)
    );

    if (currentIndex !== -1 && currentIndex < adsList.ads.length - 1) {
      const nextId = adsList.ads[currentIndex + 1].id;
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
          const prevId = prevData.ads[prevData.ads.length - 1].id; // Берем ПОСЛЕДНИЙ элемент предыдущей страницы

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

  if (isLoading)
    return <div className="p-10 text-center">Загрузка объявления</div>;
  if (isError || !ad)
    return <div className="p-10 text-center text-red-500">Ошибка загрузки</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <button onClick={handleBack} className="text-gray-600 hover:underline">
          ⬅ Назад к списку
        </button>
      </div>

      <div className="space-x-2">
        <button
          className="px-4 py-2 border rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
          disabled={
            isNavigating ||
            (listFilters.page === 1 && adsList?.ads[0]?.id === Number(id))
          }
          onClick={handlePrev}
        >
          Предыдущее
        </button>
        <button
          className="px-4 py-2 border rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
          onClick={handleNext}
          disabled={
            isNavigating ||
            (adsList &&
              listFilters.page === adsList.pagination.totalPages &&
              adsList.ads[adsList.ads.length - 1]?.id === Number(id))
          }
        >
          Следующее
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6">
            <ImageGallery images={ad.images} />
            <div className="bg-white p-6 rounded shadow">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold">{ad.title}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold
                    ${
                      ad.status === "approved"
                        ? "bg-green-500 text-white"
                        : ad.status === "rejected"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                >
                  {ad.status === "approved"
                    ? "Одобрено"
                    : ad.status === "rejected"
                    ? "Отклонено"
                    : "Отправлено на доработку"}
                </span>
              </div>
              <p className="text-2xl font-bold mb-4">
                {ad.price
                  ? ad.price.toLocaleString("ru-RU", {
                      style: "currency",
                      currency: "RUB",
                      maximumFractionDigits: 0,
                    })
                  : "Цена не указана"}
              </p>

              <div className="prose max-w-none mb-6">
                <h3 className="text-lg font-semibold mb-2">Описание</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {ad.description}
                </p>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-3">Характеристики</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {Object.entries(ad.characteristics || {}).map(
                    ([key, value]) => (
                      <div key={key} className="contents">
                        <dt className="text-gray-500">{key}</dt>
                        <dl className="font-medium">{value}</dl>
                      </div>
                    )
                  )}
                </dl>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded shadow border">
              <h3 className="font-bold text-lg mb-4">Продавец</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-xl">
                  {ad.seller?.name?.[0] || "?"}
                </div>
                <div>
                  <p className="font-bold">
                    {ad.seller?.name || "Неизвестный продавец"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {`На сайте с 
                  ${
                    ad.seller?.registeredAt
                      ? new Date(ad.seller.registeredAt).toLocaleDateString()
                      : "..."
                  }`}
                  </p>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 border-t pt-2">
                <span>
                  Рейтинг: <b>{ad.seller?.rating || 0}</b>
                </span>
                <span>
                  Объявлений: <b>{ad.seller?.totalAds || 0}</b>
                </span>
              </div>
            </div>

            <ModerationActions />
            {ad.moderationHistory.length > 0 && (
              <ModerationHistory history={ad.moderationHistory} />
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      <ModerationModal />
    </div>
  );
};

export default ItemPage;
