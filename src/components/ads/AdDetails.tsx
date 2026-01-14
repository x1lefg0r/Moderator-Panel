import type { AdvertisementProps } from "../../types";
import { formatPrice } from "../../utils/formatters";

const STATUS_CONFIG = {
  approved: {
    label: "Одобрено",
    className: "bg-green-500 text-white",
  },
  rejected: {
    label: "Отклонено",
    className: "bg-red-500 text-white",
  },
  draft: {
    label: "Отправлено на доработку",
    className: "bg-yellow-500 text-white",
  },
  pending: {
    label: "Черновик",
    className: "bg-gray-500 text-white",
  },
} as const;

export const AdDetails = ({ ad }: AdvertisementProps) => {
  const statusConfig = STATUS_CONFIG[ad.status];

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-3xl font-bold">{ad.title}</h1>
        <span
          className={`px-3 py-1 rounded-full text-sm font-bold ${statusConfig.className}`}
        >
          {statusConfig.label}
        </span>
      </div>
      <p className="text-2xl font-bold mb-4">{formatPrice(ad.price)}</p>

      <div className="prose max-w-none mb-6">
        <h3 className="text-lg font-semibold mb-2">Описание</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{ad.description}</p>
      </div>
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3">Характеристики</h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {Object.entries(ad.characteristics || {}).map(([key, value]) => (
            <div key={key} className="contents">
              <dt className="text-gray-500">{key}</dt>
              <dl className="font-medium">{value}</dl>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};
