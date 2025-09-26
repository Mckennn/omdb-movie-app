import { useEffect, useState } from "react";
import type { OmdbMovieDetail } from "../types/omdb";
import { getMovieById } from "../services";

export function useHeroDetails(imdbID?: string | null) {
  const [detail, setDetail] = useState<OmdbMovieDetail | null>(null);

  useEffect(() => {
    let aborted = false;
    (async () => {
      try {
        if (!imdbID) return setDetail(null);
        const d = await getMovieById(imdbID);
        if (!aborted && d?.Response !== "False") setDetail(d);
      } catch {
        if (!aborted) setDetail(null);
      }
    })();
    return () => { aborted = true; };
  }, [imdbID]);

  return { detail } as const;
}
