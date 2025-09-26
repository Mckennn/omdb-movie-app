import { useEffect, useMemo, useRef, useState } from "react";
import {
  useSearchSuggestions,
  type Kind,
} from "../../hooks/useSearchSuggestions";
import { clearHistory, getHistory, pushHistory } from "../../services/history";

type Props = {
  onSearch: (q: string) => void;
  /** optionnel: pour affiner les suggestions (all/movie/series) */
  kind?: Kind;
  placeholder?: string;
  className?: string;
};

// petit helper pour surligner le match (rendu simple, pas d'IA ici)
function highlight(label: string, q: string) {
  const i = label.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return label;
  const before = label.slice(0, i);
  const match = label.slice(i, i + q.length);
  const after = label.slice(i + q.length);
  return (
    <>
      {before}
      <span className="text-white">{match}</span>
      {after}
    </>
  );
}

export default function SearchBar({
  onSearch,
  kind = "all",
  placeholder = "Rechercher un film, une série...",
  className = "",
}: Props) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0); // index sélection clavier
  const [recents, setRecents] = useState<string[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useRef(`list-${Math.random().toString(36).slice(2)}`).current;

  // suggestions live (debounce + cache)
  const { items: sugg, loading } = useSearchSuggestions(value, kind, 280);

  // recents filtrés (on propose ceux qui commencent par la saisie)
  const filteredRecents = useMemo(() => {
    const v = value.trim().toLowerCase();
    const base = recents;
    if (!v) return base;
    return base.filter((r) => r.toLowerCase().startsWith(v));
  }, [value, recents]);

  // rows unifiés pour la nav clavier
  const rows = useMemo(() => {
    const r: Array<{
      kind: "recent" | "suggestion";
      label: string;
      value: string;
    }> = [];
    filteredRecents
      .slice(0, 6)
      .forEach((q) => r.push({ kind: "recent", label: q, value: q }));
    sugg.slice(0, 8).forEach((m) =>
      r.push({
        kind: "suggestion",
        label: `${m.Title} ${m.Year ? `(${m.Year})` : ""}`.trim(),
        value: m.Title,
      })
    );
    return r;
  }, [filteredRecents, sugg]);

  // open/close + charger l'historique
  useEffect(() => {
    if (!open) return;
    setRecents(getHistory());
  }, [open]);

  // fermer si clic à l’extérieur
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // soumission (Enter sur input ou click sur élément)
  const commit = (q: string) => {
    const t = q.trim();
    if (!t) return;
    pushHistory(t);
    setOpen(false);
    onSearch(t);
  };

  // clavier dans l’input (↑/↓/Enter/Esc)
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(rows.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      if (rows[active]) {
        e.preventDefault();
        commit(rows[active].value);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          commit(value);
        }}
        className="flex gap-2 rounded-2xl border border-neutral-800 bg-neutral-900 px-3 py-2"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
      >
        <input
          value={value}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setValue(e.target.value);
            setActive(0);
            if (!open) setOpen(true);
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none placeholder:text-neutral-500"
          aria-label="Search"
          aria-autocomplete="list"
          aria-activedescendant={
            rows[active] ? `${listId}-opt-${active}` : undefined
          }
        />
        <button
          type="submit"
          className="rounded-xl px-4 py-2 font-medium bg-white text-black hover:opacity-90 transition cursor-pointer"
        >
          Rechercher
        </button>
      </form>

      {/* Dropdown suggestions / historique */}
      {open && (rows.length > 0 || loading || recents.length > 0) && (
        <div
          className="absolute z-20 mt-2 w-full rounded-2xl border border-neutral-800 bg-neutral-950/95 backdrop-blur px-1 py-1"
          role="listbox"
          id={listId}
        >
          {/* Section récents */}
          {filteredRecents.length > 0 && (
            <>
              <div className="px-3 py-2 text-xs text-neutral-500">Récent</div>
              {filteredRecents.slice(0, 6).map((r, idx) => {
                const rowIndex = idx; // positions avant les suggestions
                return (
                  <button
                    key={`recent-${r}`}
                    id={`${listId}-opt-${rowIndex}`}
                    className={`w-full text-left px-3 py-2 rounded-xl hover:bg-neutral-900 ${
                      active === rowIndex ? "bg-neutral-900" : ""
                    }`}
                    onMouseEnter={() => setActive(rowIndex)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => commit(r)}
                    type="button"
                  >
                    {highlight(r, value)}
                  </button>
                );
              })}
              <div className="px-3 py-1.5">
                <button
                  type="button"
                  className="text-xs text-neutral-400 hover:text-neutral-200"
                  onClick={() => {
                    clearHistory();
                    setRecents([]);
                  }}
                >
                  Effacer l’historique
                </button>
              </div>
              {sugg.length > 0 && (
                <div className="h-px bg-neutral-800 mx-2 my-1" />
              )}
            </>
          )}

          {/* Section suggestions live */}
          <div className="px-3 py-2 text-xs text-neutral-500">Suggestions</div>
          {loading && (
            <div className="px-3 py-2 text-sm text-neutral-400">
              Chargement…
            </div>
          )}
          {!loading && sugg.length === 0 && (
            <div className="px-3 py-2 text-sm text-neutral-400">
              Aucune suggestion.
            </div>
          )}
          {!loading &&
            sugg.slice(0, 8).map((m, i) => {
              const rowIndex = filteredRecents.slice(0, 6).length + i;
              const label = `${m.Title} ${m.Year ? `(${m.Year})` : ""}`.trim();

              return (
                <button
                  key={m.imdbID}
                  id={`${listId}-opt-${rowIndex}`}
                  className={`w-full text-left px-3 py-2 rounded-xl hover:bg-neutral-900 ${
                    active === rowIndex ? "bg-neutral-900" : ""
                  }`}
                  onMouseEnter={() => setActive(rowIndex)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => commit(m.Title)}
                  type="button"
                >
                  {highlight(label, value)}
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}
