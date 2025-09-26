import { apiGet } from "./apiClient";
import type { OmdbMovieDetail, OmdbSearchResponse } from "../types/omdb";

/** Recherche par mot-clé (10 résultats par page côté OMDb). */
export async function searchOmdb(
  q: string,
  page = 1,
  type?: "movie" | "series"
): Promise<OmdbSearchResponse> {
  const params: Record<string, string> = { s: q, page: String(page) };

  if (type) params.type = type;
  
  return (await apiGet(params)) as OmdbSearchResponse;
}

/** Détails par imdbID (ex: tt4154796). */
export async function getMovieById(id: string): Promise<OmdbMovieDetail> {
  return (await apiGet({ i: id, plot: "full" })) as OmdbMovieDetail;
}
