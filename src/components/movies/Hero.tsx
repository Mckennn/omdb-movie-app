import Poster from "./Poster";
import type { OmdbSearchItem, OmdbMovieDetail } from "../../types/omdb";
import { btn, btnMd, btnOutline } from "../../styles/ui";

type HeroProps = {
  hero: OmdbSearchItem | null;
  detail?: OmdbMovieDetail | null;
  onSimilarClick?: () => void;
};

export default function Hero({ hero, detail = null, onSimilarClick = () => {} }: HeroProps) {
  if (!hero) return null;

  // Données dérivées
  const plot =
    detail?.Plot && (detail.Plot.length > 240 ? `${detail.Plot.slice(0, 240)}…` : detail.Plot);

  const genres = detail?.Genre && detail.Genre !== "N/A"
    ? detail.Genre.split(",").map((g) => g.trim()).slice(0, 3)
    : [];

  const director = detail?.Director && detail.Director !== "N/A" ? detail.Director : null;
  const actors = detail?.Actors && detail.Actors !== "N/A"
    ? detail.Actors.split(",").map((a) => a.trim()).slice(0, 2)
    : [];

  const metascoreVal =
    detail?.Metascore && detail.Metascore !== "N/A" ? Number(detail.Metascore) : null;
  const metascoreTone =
    metascoreVal == null
      ? ""
      : metascoreVal >= 60
      ? "border-emerald-700/60 text-emerald-300"
      : metascoreVal >= 40
      ? "border-yellow-700/60 text-yellow-300"
      : "border-red-700/60 text-red-300";

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* bg solide pour ne plus voir le background global */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Poster */}
          <div className="relative">
            <Poster
              src={hero.Poster}
              alt={hero.Title}
              className="h-full w-full object-cover md:aspect-[2/3] aspect-[16/10]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent" />
          </div>

          {/* Panneau texte avec fond assorti (sobre) */}
          <div className="p-6 md:p-10 flex flex-col justify-center bg-gradient-to-br from-neutral-950 via-neutral-950 to-neutral-900 md:border-l border-neutral-800">
            {/* Titre */}
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-neutral-100 to-neutral-300 bg-clip-text text-transparent">
              {hero.Title}
            </h2>

            {/* Meta chips */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {hero.Year && (
                <span className="inline-flex items-center rounded-lg border border-neutral-800 bg-neutral-900/60 px-2 py-1 text-neutral-300">
                  {hero.Year}
                </span>
              )}
              {hero.Type && (
                <span className="inline-flex items-center rounded-lg border border-neutral-800 bg-neutral-900/60 px-2 py-1 text-neutral-300">
                  {hero.Type.toUpperCase()}
                </span>
              )}
              {detail?.Runtime && (
                <span className="inline-flex items-center rounded-lg border border-neutral-800 bg-neutral-900/60 px-2 py-1 text-neutral-300">
                  {detail.Runtime}
                </span>
              )}
              {genres.map((g) => (
                <span
                  key={g}
                  className="inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900/60 px-2 py-1 text-neutral-300"
                >
                  {g}
                </span>
              ))}
            </div>

            {/* Résumé */}
            {plot && <p className="mt-4 text-neutral-300 leading-relaxed">{plot}</p>}

            {/* Notes */}
            {(detail?.imdbRating || metascoreVal !== null) && (
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                {detail?.imdbRating && (
                  <span className="rounded-xl border border-neutral-800 px-3 py-1">
                    ★ IMDb {detail.imdbRating}
                  </span>
                )}
                {metascoreVal !== null && (
                  <span className={`rounded-xl border px-3 py-1 ${metascoreTone}`}>
                    Metascore {metascoreVal}
                  </span>
                )}
              </div>
            )}

            {/* Crédit rapide */}
            {(director || actors.length > 0) && (
              <p className="mt-3 text-sm text-neutral-400">
                {director && <>Réalisé par <span className="text-neutral-200">{director}</span></>}
                {director && actors.length > 0 && " • "}
                {actors.length > 0 && (
                  <>Avec <span className="text-neutral-200">{actors.join(", ")}</span></>
                )}
              </p>
            )}

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={onSimilarClick} className={`${btn} ${btnMd}`}>
                Voir des titres similaires
              </button>

              {detail?.imdbID && (
                <a
                  href={`https://www.imdb.com/title/${detail.imdbID}/`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`${btnOutline} ${btnMd}`}
                >
                  Fiche IMDb
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
