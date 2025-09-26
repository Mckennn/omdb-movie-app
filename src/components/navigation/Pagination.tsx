type Props = {
  page: number;
  pages: number;
  prev: () => void;
  next: () => void;
  className?: string;
};

export default function Pagination({ page, pages, prev, next, className = "" }: Props) {
  if (pages <= 1) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={prev}
        disabled={page === 1}
        className={`border border-neutral-800 rounded-xl px-3 py-2 text-sm cursor-pointer ${
          page === 1 ? "opacity-50" : "hover:bg-neutral-900 transition"
        }`}
        type="button"
      >
        Précédent
      </button>
      <span className="text-sm text-neutral-400">Page {page} / {pages}</span>
      <button
        onClick={next}
        disabled={page === pages}
        className={`border border-neutral-800 rounded-xl px-3 py-2 text-sm cursor-pointer ${
          page === pages ? "opacity-50" : "hover:bg-neutral-900 transition"
        }`}
        type="button"
      >
        Suivant
      </button>
    </div>
  );
}
