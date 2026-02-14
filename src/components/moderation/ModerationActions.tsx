import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { approveAd, fetchAdById } from "../../api/ads.ts";
import { UseUIStore } from "../../store/useUIStore";
import type { ModerationActionsProps } from "../../types.ts";
import toast from "react-hot-toast";
import { Button } from "../ui/Button.tsx";

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
        <Button
          onClick={() => approveMutation.mutate(ad.id.toString())}
          disabled={approveMutation.isPending}
          variant="primary"
          size="lg"
          fullWidth
        >
          {approveMutation.isPending ? "Обработка..." : "Одобрить"}
        </Button>
        <Button
          onClick={() => openModerationModal("changes", adId!)}
          variant="warning"
          size="lg"
          fullWidth
        >
          На доработку
        </Button>

        <Button
          onClick={() => openModerationModal("reject", adId!)}
          variant="danger"
          size="lg"
          fullWidth
        >
          Отклонить
        </Button>
      </div>
    </div>
  );
};
