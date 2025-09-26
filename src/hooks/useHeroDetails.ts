import { useEffect, useState } from "react";
import type { OmdbMovieDetail } from "../types/omdb";
import { getMovieById } from "../services";

// Récupère les détails OMDb du "héros" (film mis en avant) à partir d'un imdbID.

export function useHeroDetails(imdbID?: string | null) {
  const [detail, setDetail] = useState<OmdbMovieDetail | null>(null);

  useEffect(() => {
    let aborted = false; // évite de setState sur un composant démonté
    (async () => {
      try {
        if (!imdbID) return setDetail(null);
        const d = await getMovieById(imdbID);
        if (!aborted && d?.Response !== "False") setDetail(d);
      } catch {
        if (!aborted) setDetail(null);
      }
    })();

    // cleanup: marqué comme annulé → les réponses "en retard" n’écrasent pas l’état courant
    return () => {
      aborted = true;
    };
  }, [imdbID]);

  return { detail } as const;
}
