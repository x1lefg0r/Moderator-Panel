import { useAdNavigation } from "../../hooks/useAdNavigation";

export const AdNavigation = () => {
  const {
    handleBack,
    handleNext,
    handlePrev,
    prefetchNext,
    prefetchPrev,
    isNavigating,
    canGoPrev,
    canGoNext,
  } = useAdNavigation();

  return (
    <div className="mb-6 space-y-4">
      <div>
        <button
          onClick={handleBack}
          className="text-gray-600 hover:underline transition-colors"
        >
          ⬅ Назад к списку
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handlePrev}
          onMouseEnter={prefetchPrev}
          disabled={!canGoPrev || isNavigating}
          className="px-4 py-2 border rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
        >
          {isNavigating ? "Загрузка..." : "Предыдущее"}
        </button>
        <button
          onClick={handleNext}
          onMouseEnter={prefetchNext}
          disabled={!canGoNext || isNavigating}
          className="px-4 py-2 border rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
        >
          {isNavigating ? "Загрузка..." : "Следующее"}
        </button>
      </div>
    </div>
  );
};
