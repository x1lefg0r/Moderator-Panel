import axios from "axios";
import type { FilterState, AdsResponse, Advertisement } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
});

export const fetchAds = async (filters: FilterState): Promise<AdsResponse> => {
  const { data } = await api.get<AdsResponse>("/ads", {
    params: {
      sortBy: filters.sort.split("_")[0],
      sortOrder: filters.sort.split("_")[1],
      ...filters,
    },
  });

  return data;
};

export const fetchAdById = async (id: string): Promise<Advertisement> => {
  const { data } = await api.get<Advertisement>(`/ads/${id}`);
  return data;
};

export const approveAd = async (id: string) => {
  const { data } = await api.post(`/ads/${id}/approve`);
  return data;
};

export const rejectAd = async ({
  id,
  reason,
  comment,
}: {
  id: string;
  reason: string;
  comment?: string;
}) => {
  const { data } = await api.post(`/ads/${id}/reject`, { reason, comment });
  return data;
};

export const requestChangesAd = async ({
  id,
  reason,
  comment,
}: {
  id: string;
  reason: string;
  comment?: string;
}) => {
  const { data } = await api.post(`/ads/${id}/request-changes`, {
    reason,
    comment,
  });
  return data;
};
