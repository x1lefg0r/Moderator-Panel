export type AdStatus = "pending" | "approved" | "rejected" | "draft";
export type AdPriority = "normal" | "urgent";

export interface Advertisement {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  categoryId: number;
  status: AdStatus;
  priority: AdPriority;
  createdAt: string;
  updatedAt: string;
  images: string[];
  seller: Seller;
  characteristics: Record<string, string>;
  moderationHistory: ModerationHistory[];
}

export interface Seller {
  id: number;
  name: string;
  rating: string;
  totalAds: number;
  registeredAt: string;
}

export interface ModerationHistory {
  id: number;
  moderatorId: number;
  moderatorName: string;
  action: string;
  reason: string;
  comment?: string;
  timestamp: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface AdsResponse {
  ads: Advertisement[];
  pagination: PaginationMeta;
}

export interface FilterState {
  page: number;
  limit: number;
  status: AdStatus[];
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  search: string;
  sort: SortOption;
}

export const categories = [
  { id: 0, name: "Электроника" },
  { id: 1, name: "Недвижимость" },
  { id: 2, name: "Транспорт" },
  { id: 3, name: "Работа" },
  { id: 4, name: "Услуги" },
] as const;

export const SORT_OPTIONS = [
  "date_desc",
  "date_asc",
  "price_desc",
  "price_asc",
  "priority_desc",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

export const REJECTION_REASONS = [
  "Запрещенный товар",
  "Неверная категория",
  "Некорректное описание",
  "Проблемы с фото",
  "Подозрение на мошенничество",
  "Другое",
];

export interface StatsSummary {
  totalReviewed: number;
  totalReviewedToday: number;
  totalReviewedThisWeek: number;
  totalReviewedThisMonth: number;
  approvedPercentage: number;
  rejectedPercentage: number;
  requestChangesPercentage: number;
  averageReviewTime: number;
}

export interface ActivityData {
  date: string;
  approved: number;
  rejected: number;
  requestChanges: number;
}

export interface DecisionsData {
  approved: number;
  rejected: number;
  requestChanges: number;
}

export type CategoriesData = Record<string, number>;

export const COLORS = {
  approved: "#22c55e",
  rejected: "#ef4444",
  requestChanges: "#eab308",
  purple: "#8884d8",
  blue: "#3b82f6",
};

export interface ModerationModalProps {
  type: "reject" | "changes";
  isOpen: boolean;
  onClose: () => void;
  adId: string;
}
