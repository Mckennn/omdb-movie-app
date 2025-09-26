export default function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="animate-pulse">
      {/* Hero skeleton */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Poster */}
            <div className="md:aspect-[2/3] aspect-[16/10] bg-neutral-900" />

            {/* Texte */}
            <div className="p-6 md:p-10 flex flex-col justify-center gap-3">
              <div className="h-8 w-2/3 bg-neutral-800 rounded" />
              <div className="mt-1 flex gap-2">
                <div className="h-6 w-16 bg-neutral-800 rounded" />
                <div className="h-6 w-24 bg-neutral-800 rounded" />
                <div className="h-6 w-20 bg-neutral-800 rounded" />
              </div>
              <div className="mt-2 space-y-2">
                <div className="h-4 w-full bg-neutral-800 rounded" />
                <div className="h-4 w-11/12 bg-neutral-800 rounded" />
                <div className="h-4 w-10/12 bg-neutral-800 rounded" />
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-8 w-36 bg-neutral-800 rounded-xl" />
                <div className="h-8 w-32 bg-neutral-800 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel skeleton */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 pb-16 md:pb-12">
        <div className="h-6 w-48 bg-neutral-800 rounded mb-3" />
        <div className="flex gap-3 pr-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-40 shrink-0">
              <div className="aspect-[2/3] bg-neutral-900 rounded-xl" />
              <div className="mt-2 h-4 w-28 bg-neutral-800 rounded" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
