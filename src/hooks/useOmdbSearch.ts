import { useCallback, useEffect, useMemo, useReducer } from "react";
import type { OmdbSearchItem } from "../types/omdb";
import { searchOmdb } from "../services/search";

/**
 * Hook de recherche OMDb avec:
 * - q (query), page, kind (all/movie/series)
 * - items, total, loading, error
 * - helpers: setQuery, setPage, setKind
 */

type Kind = "all" | "movie" | "series"; // filtre côté API (correspond à `type` d’OMDb)

type State = {
  q: string;
  page: number;
  kind: Kind;
  total: number;
  items: OmdbSearchItem[];
  loading: boolean;
  error: string | null;
};

type Action = // toutes les actions possibles

    | { type: "SET_QUERY"; q: string }
    | { type: "SET_PAGE"; page: number }
    | { type: "SET_KIND"; kind: Kind }
    | { type: "LOAD_START" }
    | { type: "LOAD_SUCCESS"; items: OmdbSearchItem[]; total: number }
    | { type: "LOAD_ERROR"; error: string };

const initial: State = {
  q: "",
  page: 1,
  kind: "all",
  total: 0,
  items: [],
  loading: false,
  error: null,
};

// petit reducer lisible, chaque action fait une modif ciblée
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_QUERY":
      // nouvelle recherche → on revient en page 1
      return { ...state, q: action.q, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.page };
    case "SET_KIND":
      // changement de filtre → page 1 aussi
      return { ...state, kind: action.kind, page: 1 };
    case "LOAD_START":
      // démarre un fetch, on efface l’erreur précédente
      return { ...state, loading: true, error: null };
    case "LOAD_SUCCESS":
      // résultats OK
      return {
        ...state,
        loading: false,
        items: action.items,
        total: action.total,
      };
    case "LOAD_ERROR":
      // erreur réseau / API
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}

export function useOmdbSearch() {
  const [state, dispatch] = useReducer(reducer, initial);

  const setQuery = useCallback((q: string) => { // setters mémoïsés (évite des re-renders inutiles)
    dispatch({ type: "SET_QUERY", q });
  }, []);

  const setPage = useCallback((p: number) => {
    dispatch({ type: "SET_PAGE", page: p });
  }, []);

  const setKind = useCallback((k: Kind) => {
    dispatch({ type: "SET_KIND", kind: k });
  }, []);

  useEffect(() => {  // fetch au changement de q / page / kind
    const doFetch = async () => {

      if (!state.q) {
        dispatch({ type: "LOAD_SUCCESS", items: [], total: 0 });
        return;
      }

      dispatch({ type: "LOAD_START" });

      try {
        const type = state.kind === "all" ? undefined : state.kind; // OMDb prend `type` = movie | series (pas "all")
        const data = await searchOmdb(state.q, state.page, type);

        if (data.Response === "False")
          throw new Error(data.Error || "No results");

        const total = Number(data.totalResults || 0);
        const items = (data.Search || []) as OmdbSearchItem[];

        dispatch({ type: "LOAD_SUCCESS", items, total });

      } catch (e: any) {
        dispatch({ type: "LOAD_ERROR", error: e.message || String(e) });
      }
    };

    void doFetch();

  }, [state.q, state.page, state.kind]);

  const pages = useMemo(  // nb de pages d’après le total (OMDb = 10 items/page)
    () => Math.max(1, Math.ceil(state.total / 10)),
    [state.total]
  );

  return {
    q: state.q,
    items: state.items,
    page: state.page,
    pages,
    kind: state.kind,
    loading: state.loading,
    error: state.error,
    setQuery,
    setPage,
    setKind,
  } as const;
}
