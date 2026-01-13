import type { SellerProps } from "../../types";

export const SellerCard = ({ seller }: SellerProps) => {
  return (
    <div className="bg-white p-6 rounded shadow border">
      <h3 className="font-bold text-lg mb-4">Продавец</h3>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-xl">
          {seller?.name?.[0] || "?"}
        </div>
        <div>
          <p className="font-bold">{seller?.name || "Неизвестный продавец"}</p>
          <p className="text-sm text-gray-500">
            {`На сайте с 
                  ${
                    seller?.registeredAt
                      ? new Date(seller.registeredAt).toLocaleDateString()
                      : "..."
                  }`}
          </p>
        </div>
      </div>
      <div className="flex justify-between text-sm text-gray-600 border-t pt-2">
        <span>
          Рейтинг: <b>{seller?.rating || 0}</b>
        </span>
        <span>
          Объявлений: <b>{seller?.totalAds || 0}</b>
        </span>
      </div>
    </div>
  );
};
