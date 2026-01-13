import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { approveAd, fetchAdById } from "../../api/ads.ts";
import { UseUIStore } from "../../store/useUIStore";
import { useParams } from "react-router-dom";

export const ModerationActions = () => {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const approveMutation = useMutation({
    mutationFn: approveAd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ad", id] });
      alert("Объявление одобрено");
    },
  });

  const { data: ad } = useQuery({
    queryKey: ["ad", id],
    queryFn: () => fetchAdById(id!),
    enabled: !!id,
  });

  const openModerationModal = UseUIStore((state) => state.openModerationModal);

  if (!ad)
    return <div className="p-10 text-center text-red-500">Ошибка загрузки</div>;

  return (
    <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
      <h3 className="font-bold text-lg mb-4">Действия модератора</h3>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => approveMutation.mutate(ad.id.toString())}
          disabled={approveMutation.isPending}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded transition"
        >
          {approveMutation.isPending ? "Обработка..." : "Одобрить"}
        </button>
        <button
          onClick={() => openModerationModal("changes", id!)}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 rounded transition"
        >
          На доработку
        </button>

        <button
          onClick={() => openModerationModal("reject", id!)}
          className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 rounded transition"
        >
          Отклонить
        </button>
      </div>
    </div>
  );
};
