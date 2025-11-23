import type { Advertisement } from "../../types";
import { Link, useLocation } from "react-router-dom";

export const AdCard = ({ ad }: { ad: Advertisement }) => {
  const location = useLocation();

  const price = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(ad.price);

  const date = new Date(ad.createdAt).toLocaleDateString("ru-RU");

  const statusColors = {
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
    draft: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col">
      <div className="h-48 bg-gray-200 relative">
        <img
          src={
            ad.images?.[0] ||
            "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt={ad.title}
          className="w-full h-full object-cover"
        />
        {ad.priority === "urgent" && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded uppercase font-bold">
            Срочно
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs text-gray-500">{ad.category}</span>
          <span
            className={`text-xs px-2 py-0.5 rounded ${statusColors[ad.status]}`}
          >
            {ad.status}
          </span>
        </div>

        <Link
          to={`/item/${ad.id}`}
          state={{ from: location.search }}
          className="font-bold text-lg mb-1 hover:text-blue-600 truncate"
        >
          {ad.title}
        </Link>

        <div className="font-bold text-xl mb-4">{price}</div>

        <div className="mt-auto text-xs text-gray-400 flex justify-between">
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
};
