import type { OmdbSearchResponse } from "../types/omdb";
import { apiGet } from "./apiClient";

export async function searchOmdb(
  q: string,
  page = 1,
  type?: "movie" | "series"
) {
  const params: Record<string, string> = { s: q, page: String(page) };
  if (type) params.type = type;
  const data = (await apiGet(params)) as OmdbSearchResponse;
  return data;
}
