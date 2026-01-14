import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { approveAd, fetchAdById } from "../../api/ads.ts";
import { UseUIStore } from "../../store/useUIStore";
import type { ModerationActionsProps } from "../../types.ts";
import toast from "react-hot-toast";

export const ModerationActions = ({ adId }: ModerationActionsProps) => {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: approveAd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ad", adId] });
      toast.success(() => (
        <span>
          <b>Объявление одобрено!</b>
        </span>
      ));
    },
  });

  const { data: ad } = useQuery({
    queryKey: ["ad", adId],
    queryFn: () => fetchAdById(adId!),
    enabled: !!adId,
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
          onClick={() => openModerationModal("changes", adId!)}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 rounded transition"
        >
          На доработку
        </button>

        <button
          onClick={() => openModerationModal("reject", adId!)}
          className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-bold py-3 rounded transition"
        >
          Отклонить
        </button>
      </div>
    </div>
  );
};
