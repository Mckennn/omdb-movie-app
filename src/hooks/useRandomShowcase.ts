import { useCallback, useEffect, useState } from "react";
import type { OmdbSearchItem } from "../types/omdb";
import { getRandomList } from "../services/random";

export function useRandomShowcase(count = 11) {
  const [hero, setHero] = useState<OmdbSearchItem | null>(null);
  const [carousel, setCarousel] = useState<OmdbSearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // ⬅️

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null); // ⬅️
    try {
      const list = await getRandomList(count);
      setHero(list[0] ?? null);
      setCarousel(list.slice(1, count));
    } catch (e) {
      setError("Impossible de charger les suggestions."); // ⬅️
      setHero(null);
      setCarousel([]);
    } finally {
      setLoading(false);
    }
  }, [count]);

  useEffect(() => { void refresh(); }, [refresh]);

  return { hero, carousel, loading, error, refresh } as const; // ⬅️
}
