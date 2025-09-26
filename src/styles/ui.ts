// utilitaire minuscule
export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

// Boutons (styles de base)
export const btnBase =
  "inline-flex items-center justify-center rounded-xl font-medium transition cursor-pointer";

// Variantes
export const btn = cx(btnBase, "bg-white text-black hover:opacity-90 cursor-pointer");
export const btnOutline = cx(
  btnBase,
  "border border-neutral-700 text-neutral-200 hover:bg-neutral-900 cursor-pointer",
);
export const btnGhost = cx(btnBase, "text-neutral-300 hover:bg-neutral-900 cursor-pointer");

// Tailles
export const btnSm = "text-sm px-3 py-2";
export const btnMd = "text-sm px-4 py-2.5";
export const btnLg = "text-base px-5 py-3";

// Icon buttons (chevrons, etc.)
export const iconBtn =
  "inline-grid place-items-center rounded-full border border-neutral-800 bg-neutral-900/80 backdrop-blur hover:bg-neutral-800 transition cursor-pointer";
export const iconSm = "h-8 w-8";
export const iconMd = "h-9 w-9";
export const iconLg = "h-10 w-10";

