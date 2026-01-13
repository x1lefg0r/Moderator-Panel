import { useState } from "react";
import { UseUIStore } from "../../store/useUIStore";
import { REJECTION_REASONS } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectAd, requestChangesAd } from "../../api/ads";

export const ModerationModal = () => {
  const { moderation, closeModerationModal } = UseUIStore();
  const { mode, adId } = moderation;

  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: mode === "reject" ? rejectAd : requestChangesAd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ad", adId] });
      queryClient.invalidateQueries({ queryKey: ["ads"] });

      closeModerationModal();
      setReason("");
      setComment("");
    },
  });

  const handleSubmit = () => {
    if (!reason) {
      alert("Выберите пожалуйста причину!");
      return;
    }

    if (!adId) return;

    mutation.mutate({ id: adId, reason, comment });
  };

  if (!mode || !adId) return null;

  const config = {
    reject: {
      title: "Отклонение объявления",
      submitText: "Отклонить",
      submitClass: "bg-red-600 hover:bg-red-700",
    },
    changes: {
      title: "Вернуть на доработку",
      submitText: "Отправить",
      submitClass: "bg-yellow-600 hover:bg-yellow-700",
    },
  }[mode];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-xl font-bold mb-4">{config.title}</h3>

        <div className="space-y-2 mb-4">
          <p className="font-medium text-sm text-gray-700">Выберите причину:</p>
          {REJECTION_REASONS.map((r) => (
            <label
              key={r}
              className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
            >
              <input
                type="radio"
                name="reason"
                value={r}
                checked={reason === r}
                onChange={(e) => setReason(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span>{r}</span>
            </label>
          ))}
        </div>

        {reason === "Другое" && (
          <textarea
            className="w-full border p-3 rounded mb-4 h-24 resize-none focus:ring-blue-500 outline-none"
            placeholder="Комментарий"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={closeModerationModal}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending || !reason}
            className={`px-4 py-2 text-white rounded disabled:opacity-50 transition ${config.submitClass}`}
          >
            {mutation.isPending ? "Отправка..." : "Отправить"}
          </button>
        </div>
      </div>
    </div>
  );
};
