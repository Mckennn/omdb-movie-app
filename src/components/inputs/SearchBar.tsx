import { useState } from "react";
import { btn, btnSm } from "../../styles/ui";

type SearchBarProps = {
  onSearch: (q: string) => void;
  initialValue?: string;
};

export default function SearchBar({
  onSearch,
  initialValue = "",
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    onSearch(q);
  };

  const disabled = value.trim().length === 0;

  return (
    <form
      onSubmit={submit}
      className="flex gap-2 rounded-2xl border border-neutral-800 bg-neutral-900 px-3 py-2"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Rechercher un film ou une série…"
        className="w-full bg-transparent outline-none placeholder:text-neutral-500"
        aria-label="Recherche"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={disabled}
        className={`${btn} ${btnSm} ${
          disabled ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        Rechercher
      </button>
    </form>
  );
}
