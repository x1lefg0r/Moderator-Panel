import axios from "axios";
import type {
  ActivityData,
  CategoriesData,
  DecisionsData,
  StatsSummary,
} from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
});

export const fetchStatsSummary = async (period: string) => {
  const { data } = await api.get<StatsSummary>("/stats/summary", {
    params: { period },
  });
  return data;
};

export const fetchActivityChart = async (period: string) => {
  const { data } = await api.get<ActivityData[]>("/stats/chart/activity", {
    params: { period },
  });
  return data;
};

export const fetchDecisionsChart = async (period: string) => {
  const { data } = await api.get<DecisionsData>("/stats/chart/decisions", {
    params: { period },
  });
  return data;
};

export const fetchCategoriesChart = async (period: string) => {
  const { data } = await api.get<CategoriesData>("/stats/chart/categories", {
    params: { period },
  });
  return data;
};
