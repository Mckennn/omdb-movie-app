import { useCallback, useEffect, useState } from "react";
import type { OmdbSearchItem } from "../types/omdb";
import { getRandomList } from "../services/random";

/**
 * Récupère une vitrine "random": 1 héro + N-1 items pour le carrousel.
 * - count = nb total souhaité (ex: 11 → 1 + 10)
 * - expose hero, carousel, loading, error, refresh()
 */

export function useRandomShowcase(count = 11) {
  const [hero, setHero] = useState<OmdbSearchItem | null>(null);
  const [carousel, setCarousel] = useState<OmdbSearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null); // ⬅️

    try {
      const list = await getRandomList(count);

      setHero(list[0] ?? null);
      setCarousel(list.slice(1, count));
    } catch (e) {
      setError("Impossible de charger les suggestions."); // OMDb peut timeouter: on garde un message user-friendly et on nettoie l’état
      setHero(null);
      setCarousel([]);
    } finally {
      setLoading(false);
    }
  }, [count]);

  useEffect(() => {
    // charge au mount, et si 'count' change
    void refresh();
  }, [refresh]);

  return { hero, carousel, loading, error, refresh } as const; // on expose tout ce qu’il faut à la page Home
}
