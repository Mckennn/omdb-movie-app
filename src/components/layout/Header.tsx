import { Link } from "react-router-dom";
import SearchBar from "../inputs/SearchBar";

export default function Header({
  onSearch,
}: {
  onSearch: (q: string) => void;
}) {
  return (
    <header className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            <Link
              to="/"
              className="inline-block hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-700 rounded-md"
              aria-label="Aller à l’accueil"
            >
              🎬 LucasFlix <span className="text-neutral-400">Search</span>
            </Link>
          </h1>
          <div className="text-xs text-neutral-500">React • TS • Vite</div>
        </div>

        {/* SearchBar intégrée dans le Header */}
        <SearchBar onSearch={onSearch} />
      </div>
    </header>
  );
}
