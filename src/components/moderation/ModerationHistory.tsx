import type { ModerationHistoryProps } from "../../types";

export const ModerationHistory = ({ history }: ModerationHistoryProps) => {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="font-bold text-lg mb-4">История решений</h3>
      <ul className="space-y-4">
        {history.map((entry, i) => (
          <li key={i} className="text-sm border-b last:border-0 pb-2">
            <div className="flex justify-between font-bold">
              <span>
                {entry.action === "approved"
                  ? "Одобрено"
                  : entry.action === "rejected"
                  ? "Отклонено"
                  : "Отправлено на доработку"}
              </span>
              <span className="text-gray-400 text-xs">
                {new Date(entry.timestamp).toLocaleDateString()}
              </span>
            </div>
            {entry.reason && (
              <p className="text-red-500 mt-1">Причина: {entry.reason}</p>
            )}
            {entry.comment && (
              <p className="text-black mt-1">
                Комментарий: {entry.comment.toLocaleLowerCase()}
              </p>
            )}
            <p className="text-gray-500 mt-1 text-xs">
              Модератор: {entry.moderatorName}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};
