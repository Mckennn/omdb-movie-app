import { useEffect, useRef, useState } from "react";

/**
 * Hook tout simple pour gérer un scroller horizontal avec chevrons.
 * - expose un ref pour le conteneur qui scroll
 * - calcule si on peut aller à gauche/droite
 * - fournit une fonction scrollBy("left" | "right")
 *
 * deps : tableau de dépendances pour recalculer (ex: [items.length])
 */

export function useHorizontalScroll(deps: any[] = []) {
  const scrollerRef = useRef<HTMLDivElement>(null); // ref vers l'élément qui scroll horizontalement
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const update = () => {
    // met à jour l'état des chevrons en fonction de la position de scroll
    const el = scrollerRef.current;

    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;

    setCanLeft(scrollLeft > 0);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    const el = scrollerRef.current; 

    if (!el) return;

    update();

    const onScroll = () => update();

    el.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => update(); // au cas où la taille du conteneur change
    window.addEventListener("resize", onResize);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollerRef.current;

    if (!el) return;

    const delta = Math.round(el.clientWidth * 0.9) * (dir === "left" ? -1 : 1); // scroll d'un “écran” vers la gauche/droite, 90% de la largeur visible
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return { scrollerRef, canLeft, canRight, scrollBy } as const; // 'as const' pour que TS infère les types littéraux (utile pour scrollBy)
}
