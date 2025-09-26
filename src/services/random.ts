import type { OmdbSearchItem } from "../types/omdb";
import { searchOmdb } from "./search";

const SEEDS = [
  "star",
  "love",
  "man",
  "dark",
  "night",
  "war",
  "girl",
  "red",
  "blue",
  "king",
  "world",
  "city",
];

const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = <T>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

/**
 * Un seul seed. On essaye jusqu'à 3 pages max de cette seed, en séquentiel.
 * On renvoie ce qu'on a (peut être < count si l'API time-out).
 */
export async function getRandomList(count = 11): Promise<OmdbSearchItem[]> {
  const seed = pick(SEEDS);
  const pages = shuffle([1, 2, 3, 4, 5]).slice(0, 3); // ex: 3 pages max
  const seen = new Set<string>();
  const out: OmdbSearchItem[] = [];

  for (const p of pages) {
    try {
      const data = await searchOmdb(seed, p);

      for (const m of data.Search || []) {
        if (m.Poster && m.Poster !== "N/A" && !seen.has(m.imdbID)) {
          out.push(m);
          seen.add(m.imdbID);
          if (out.length >= count) break;
        }
      }
      if (out.length >= count) break;
      
    } catch {
      // ignore la page qui a timeout (522/abort), on tente la suivante
    }
  }
  return out; // peut être < count, c’est normal si l’API a répondu partiellement
}
