import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import MovieCard from "../components/movies/MovieCard";
import Background from "../components/layout/Background";
import SearchResultsSkeleton from "../components/feedback/SearchResultsSkeleton";
import MovieDetailModal from "../components/movies/MovieDetailModal";
import { useOmdbSearch } from "../hooks/useOmdbSearch";
import Pagination from "../components/navigation/Pagination";

type TypeFilter = "all" | "movie" | "series";

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const rawType = (params.get("type") || "all").toLowerCase();
  const type: TypeFilter =
    rawType === "movie" ? "movie" : rawType === "series" ? "series" : "all";

  const navigate = useNavigate();

  const {
    q: currentQ,
    items,
    page,
    pages,
    loading,
    error,
    setQuery,
    setPage,
  } = useOmdbSearch();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // sync avec l’URL sans boucle infinie
  useEffect(() => {
    if (q && q !== currentQ) setQuery(q);
  }, [q, currentQ, setQuery]);

  // ferme le modal quand la query ou le type change
  useEffect(() => {
    setSelectedId(null);
  }, [q, type]);

  const prev = () => setPage(Math.max(1, page - 1));
  const next = () => setPage(Math.min(pages, page + 1));

  // déduplication
  const uniqueItems = useMemo(() => {
    const seen = new Set<string>();
    return items.filter((m) => {
      if (seen.has(m.imdbID)) return false;
      seen.add(m.imdbID);
      return true;
    });
  }, [items]);

  // filtre côté UI (en attendant d'ajouter le type dans le hook / API)
  const filteredItems = useMemo(() => {
    if (type === "all") return uniqueItems;
    return uniqueItems.filter((m) => m.Type?.toLowerCase() === type);
  }, [uniqueItems, type]);

  // navigation helpers pour le toggle
  const setType = (t: TypeFilter) => {
    const sp = new URLSearchParams(params);
    if (t === "all") sp.delete("type");
    else sp.set("type", t);
    // reset page à 1 visuellement
    setPage(1);
    navigate(`/search?${sp.toString()}`);
  };

  // style petit toggle (sobre)
  const chip =
    "text-sm px-3 py-1.5 rounded-full border transition cursor-pointer";
  const active = "border-white/30 bg-white/10";
  const inactive = "border-neutral-800 text-neutral-300 hover:bg-neutral-900";

  return (
    <div className="relative min-h-dvh text-neutral-100">
      <Background />
      <div className="relative z-10">
        <Header
          onSearch={(v) => {
            const sp = new URLSearchParams({ q: v });
            if (type !== "all") sp.set("type", type);
            navigate(`/search?${sp.toString()}`);
          }}
        />

        {/* Loader */}
        {loading && <SearchResultsSkeleton />}

        {/* Contenu */}
        {!loading && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Résultats pour « {q} »{" "}
                  {type !== "all" && (
                    <span className="text-neutral-400">
                      · {type === "movie" ? "Films" : "Séries"}
                    </span>
                  )}
                </h2>
                {error && <p className="text-red-300 mt-1">{error}</p>}
              </div>

              {/* Pagination */}
              <Pagination page={page} pages={pages} prev={prev} next={next} />
            </div>

            {/* Toggle All / Films / Séries */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setType("all")}
                className={`${chip} ${type === "all" ? active : inactive}`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setType("movie")}
                className={`${chip} ${type === "movie" ? active : inactive}`}
              >
                Films
              </button>
              <button
                type="button"
                onClick={() => setType("series")}
                className={`${chip} ${type === "series" ? active : inactive}`}
              >
                Séries
              </button>
            </div>

            {/* Grille */}
            {!error &&
              (filteredItems.length === 0 ? (
                <p className="text-neutral-400">Aucun résultat.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
                  {filteredItems.map((m) => (
                    <MovieCard
                      key={m.imdbID}
                      id={m.imdbID}
                      title={m.Title}
                      year={m.Year}
                      type={m.Type}
                      poster={m.Poster}
                      onOpen={() => setSelectedId(m.imdbID)}
                    />
                  ))}
                </div>
              ))}
          </section>
        )}
      </div>

      {/* Modal détail */}
      {selectedId && (
        <MovieDetailModal
          imdbID={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
