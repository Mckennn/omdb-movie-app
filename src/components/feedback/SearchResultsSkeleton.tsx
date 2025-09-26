export default function SearchResultsSkeleton({ count = 10 }: { count?: number }) {
  const items = Array.from({ length: count });

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-pulse">
      {/* En-tête (titre + pagination fantôme) */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="h-6 w-64 bg-neutral-800 rounded" />
          <div className="h-4 w-40 bg-neutral-800/70 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 rounded-xl border border-neutral-800 bg-neutral-900" />
          <div className="h-4 w-20 bg-neutral-800 rounded" />
          <div className="h-8 w-20 rounded-xl border border-neutral-800 bg-neutral-900" />
        </div>
      </div>

      {/* Grille skeleton (mêmes colonnes que l'état réel) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
        {items.map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[2/3] w-full rounded-xl bg-neutral-900" />
            <div className="h-4 w-3/4 bg-neutral-800 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
