import { useEffect, useRef, useState } from "react";
import { getMovieById } from "../../services"; // <- adapté à ton projet
import type { OmdbMovieDetail } from "../../types/omdb";

// --- Utils
function toHiResPoster(url?: string) {
  if (!url) return url;
  let size = 1200;
  if (typeof window !== "undefined" && window.innerWidth <= 1200) size = 800;
  return url
    .replace(/SX\d+/g, `SX${size}`)
    .replace(/UX\d+/g, `UX${size}`)
    .replace(/VY\d+/g, `VY${size}`);
}

// --- Loader + container taille GÉANTE mais STABLE (même taille pour tous)
function PosterWithLoader({ src, alt }: { src: string; alt: string }) {
  const [loading, setLoading] = useState(true);
  return (
    <div
      className="
        relative
        aspect-[2/3]
        w-[70vw] sm:w-[58vw] md:w-[48vw] lg:w-[42vw] xl:w-[38vw] 2xl:w-[34vw]
        max-w-[880px]
        max-h-[82vh]
        rounded-2xl overflow-hidden
        border border-white/10 bg-black
        select-none
      "
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/60">
          <span className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
        </div>
      )}
      <img
        src={toHiResPoster(src)}
        alt={alt}
        className={`
          absolute inset-0 w-full h-full object-contain
          transition-opacity duration-300
          ${loading ? "opacity-0" : "opacity-100"}
        `}
        style={{ background: "#222", maxHeight: "82vh" }}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
        draggable={false}
      />
    </div>
  );
}

export default function MovieDetailModal({
  imdbID,
  onClose,
}: {
  imdbID: string | null;
  onClose: () => void;
}) {
  const [movie, setMovie] = useState<OmdbMovieDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ctrlRef = useRef<AbortController | null>(null);

  // Fetch
  useEffect(() => {
    if (!imdbID) return;
    setMovie(null);
    setError(null);

    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    getMovieById(imdbID)
      .then((m) => {
        if ((m as any)?.Response === "True" || (m as any)?.Title) setMovie(m);
        else setError((m as any)?.Error || "Not found");
      })
      .catch((e: any) => {
        if (e?.name !== "AbortError") setError(e?.message || "Network error");
      });

    return () => ctrl.abort();
  }, [imdbID]);

  // Escape pour fermer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!imdbID) return null;

  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const imdbUrl = movie?.imdbID
    ? `https://www.imdb.com/title/${movie.imdbID}/`
    : undefined;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={movie?.Title || "Détails du film"}
    >
      {/* Close en dehors, ne masque pas l'image */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[1000] rounded-full border border-white/20 bg-black/60 hover:bg-black/80 transition px-3 py-1.5 shadow-xl text-white cursor-pointer"
        aria-label="Fermer"
        title="Fermer"
      >
        ✕
      </button>

      {/* Panel élargi */}
      <div className="bg-black/70 rounded-2xl shadow-2xl flex flex-col md:flex-row max-w-[1200px] w-full max-h-[90vh] overflow-hidden border border-white/10">
        {/* Colonne Affiche */}
        <div className="flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black">
          {!movie && !error && (
            <div className="
              aspect-[2/3]
              w-[70vw] sm:w-[58vw] md:w-[48vw] lg:w-[42vw] xl:w-[38vw] 2xl:w-[34vw]
              max-w-[880px] max-h-[82vh]
              rounded-2xl border border-white/10 bg-white/5 grid place-items-center text-sm opacity-70">
              Chargement…
            </div>
          )}
          {error && (
            <div className="
              aspect-[2/3]
              w-[70vw] sm:w-[58vw] md:w-[48vw] lg:w-[42vw] xl:w-[38vw] 2xl:w-[34vw]
              max-w-[880px] max-h-[82vh]
              rounded-2xl border border-red-400/30 bg-red-500/10 grid place-items-center text-sm text-red-300">
              {error}
            </div>
          )}
          {movie && movie.Poster && movie.Poster !== "N/A" && (
            <PosterWithLoader src={movie.Poster} alt={movie.Title} />
          )}
        </div>

        {/* Colonne Infos */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto text-white flex flex-col">
          {!movie && !error && (
            <p className="opacity-80">Chargement des informations…</p>
          )}

          {movie && (
            <>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                {movie.Title}{" "}
                <span className="opacity-70 font-normal">({movie.Year})</span>
              </h3>

              <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
                {movie.imdbRating && movie.imdbRating !== "N/A" && (
                  <span className="px-2 py-1 rounded-full bg-white/10 border border-white/10">
                    ⭐ IMDb {movie.imdbRating}
                  </span>
                )}
                {movie.Rated && movie.Rated !== "N/A" && (
                  <span className="px-2 py-1 rounded-full bg-white/10 border border-white/10">
                    {movie.Rated}
                  </span>
                )}
                {movie.Runtime && movie.Runtime !== "N/A" && (
                  <span className="px-2 py-1 rounded-full bg-white/10 border border-white/10">
                    ⏱ {movie.Runtime}
                  </span>
                )}
              </div>

              {movie.Plot && movie.Plot !== "N/A" && (
                <p className="leading-relaxed opacity-90 mb-4">{movie.Plot}</p>
              )}

              {movie.Genre && movie.Genre !== "N/A" && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.Genre.split(",").map((g) => (
                    <span
                      key={g.trim()}
                      className="text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5"
                    >
                      {g.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {movie.Language && movie.Language !== "N/A" && (
                  <p>
                    <span className="opacity-70">Langue :</span>{" "}
                    {movie.Language}
                  </p>
                )}
                {movie.Country && movie.Country !== "N/A" && (
                  <p>
                    <span className="opacity-70">Pays :</span> {movie.Country}
                  </p>
                )}
              </div>

              <div className="mt-auto" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
                {movie.Director && movie.Director !== "N/A" && (
                  <p>
                    <span className="opacity-70">Réalisateur :</span>{" "}
                    {movie.Director}
                  </p>
                )}
                {movie.Actors && movie.Actors !== "N/A" && (
                  <p>
                    <span className="opacity-70">Acteurs :</span>{" "}
                    {movie.Actors}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {imdbUrl && (
                  <a
                    href={imdbUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm px-3 py-1.5 rounded-full border border-white/10 bg-white/10 hover:bg-white/20 transition"
                  >
                    Voir sur IMDb
                  </a>
                )}
                {movie.Website && movie.Website !== "N/A" && (
                  <a
                    href={movie.Website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm px-3 py-1.5 rounded-full border border-white/10 bg-white/10 hover:bg-white/20 transition"
                  >
                    Site officiel
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
