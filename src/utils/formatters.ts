export const formatPrice = (price: number | null, currency = "RUB"): string => {
  if (!price) return "Цена не указана";

  return price.toLocaleString("ru-RU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
};
