import { useMemo } from "react";
import { useHorizontalScroll } from "../../hooks/useHorizontalScroll";
import MovieCard from "./MovieCard";
import type { OmdbSearchItem } from "../../types/omdb";
import { btnGhost, btnSm, iconBtn, iconMd } from "../../styles/ui";

type CarouselProps = {
  items: OmdbSearchItem[];
  loading?: boolean;
  title?: string;
  onOpen?: (title: string) => void;
  onReload?: () => void;
  itemWidthClass?: string; // ex: "w-40"
};

export default function Carousel({
  items,
  loading = false,
  title = "Explorez des films",
  onOpen,
  onReload,
  itemWidthClass = "w-40",
}: CarouselProps) {
  const { scrollerRef, canLeft, canRight, scrollBy } = useHorizontalScroll([
    items.length,
  ]);

  const handleOpen = (t: string) => onOpen?.(t);
  const handleReload = () => onReload?.();

  const cards = useMemo(() => items, [items]);
  const hasItems = cards.length > 0;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 pb-16 md:pb-12">
      <div className="flex items-end justify-between mb-3">
        <h3 className="text-xl font-semibold">{title}</h3>

        {!loading && onReload && (
          <button
            type="button"
            onClick={handleReload}
            className={`${btnGhost} ${btnSm}`}
          >
            Recharger aléatoire
          </button>
        )}
      </div>

      <div className="relative">
        {/* Chevrons */}
        <button
          type="button"
          aria-label="Défiler vers la gauche"
          onClick={() => scrollBy("left")}
          disabled={!canLeft}
          className={`${iconBtn} ${iconMd} absolute left-0 top-1/2 -translate-y-1/2 z-10 ${
            canLeft ? "" : "opacity-0 pointer-events-none"
          }`}
        >
          ‹
        </button>

        <button
          type="button"
          aria-label="Défiler vers la droite"
          onClick={() => scrollBy("right")}
          disabled={!canRight}
          className={`${iconBtn} ${iconMd} absolute right-0 top-1/2 -translate-y-1/2 z-10 ${
            canRight ? "" : "opacity-0 pointer-events-none"
          }`}
        >
          ›
        </button>

        {/* Dégradés bords */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-neutral-950 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-neutral-950 to-transparent" />

        {/* Scroller */}
        <div
          ref={scrollerRef}
          className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {!loading && !hasItems && (
            <p className="text-sm text-neutral-400 px-1">
              Rien à afficher pour le moment.
            </p>
          )}

          {hasItems && (
            <div className="flex gap-3 min-w-full pr-6">
              {cards.map((m) => (
                <div key={m.imdbID} className={`${itemWidthClass} shrink-0`}>
                  <MovieCard
                    id={m.imdbID}
                    title={m.Title}
                    year={m.Year}
                    type={m.Type}
                    poster={m.Poster}
                    onOpen={() => handleOpen(m.Title)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
