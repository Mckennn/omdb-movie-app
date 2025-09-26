import Poster from "./Poster";

export default function MovieCard({
  id,
  title,
  year,
  type,
  poster,
  onOpen,
}: {
  id: string;
  title: string;
  year: string;
  type: string;
  poster?: string;
  onOpen?: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onOpen?.(id)}
      className="text-left group overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:-translate-y-0.5 transition shadow-sm hover:shadow-lg w-full cursor-pointer"
    >
      {/* Image: hauteur identique via aspect-ratio */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <Poster
          src={poster}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-900/10 to-transparent" />
      </div>

      {/* Bloc texte: hauteur fixée */}
      <div className="p-3 grid grid-rows-[auto,1fr] gap-1 h-[4.75rem]">
        <div className="flex items-center gap-2 text-[11px] uppercase text-neutral-400 leading-none">
          <span className="whitespace-nowrap">{type}</span>
          <span>•</span>
          <span className="whitespace-nowrap">{year}</span>
        </div>
        <h3 className="line-clamp-2 font-semibold text-neutral-100 leading-snug">
          {title}
        </h3>
      </div>
    </button>
  );
}
