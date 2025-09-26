import { useEffect, useRef, useState } from "react";
import { searchOmdb } from "../services/search";
import type { OmdbSearchItem } from "../types/omdb";

export type Kind = "all" | "movie" | "series";

// petit cache mémoire (5–10 min)
const CACHE = new Map<string, { ts: number; items: OmdbSearchItem[] }>();
const TTL = 8 * 60 * 1000;

export function useSearchSuggestions(
  q: string,
  kind: Kind = "all",
  delay = 300
) {
  const [items, setItems] = useState<OmdbSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ctrlRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const query = q.trim();
    // pas de texte → on laisse l'historique gérer l'affichage, pas de requête
    if (query.length < 2) {
      setItems([]);
      setLoading(false);
      setError(null);
      ctrlRef.current?.abort();
      return;
    }

    const key = `${query.toLowerCase()}|${kind}`;
    const now = Date.now();
    const cached = CACHE.get(key);
    if (cached && now - cached.ts < TTL) {
      setItems(cached.items);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const ctrl = new AbortController();
    ctrlRef.current?.abort();
    ctrlRef.current = ctrl;

    const t = setTimeout(async () => {
      try {
        const type = kind === "all" ? undefined : kind;
        const data = await searchOmdb(query, 1, type);

        if (data.Response === "False") {
          setItems([]);
          setError(null);
          return;
        }

        // filtre simple: titre qui commence par "q" OU mot qui commence par "q"
        const ql = query.toLowerCase();
        let list = (data.Search || []) as OmdbSearchItem[];
        list = list.filter((m) => {
          const title = (m.Title || "").toLowerCase();
          if (title.startsWith(ql)) return true;
          return title.split(/[\s:.\-_,/]+/).some((tok) => tok.startsWith(ql));
        });

        CACHE.set(key, { ts: now, items: list });
        setItems(list);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setError(e?.message || "Erreur réseau");
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q, kind, delay]);

  return { items, loading, error } as const;
}
