const KEY = "lfx_search_history_v1";
const MAX = 10;

export function getHistory(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function pushHistory(q: string) {
  const t = q.trim();
  if (!t) return;
  const lower = t.toLowerCase();

  let arr = getHistory().filter((x) => x.toLowerCase() !== lower);
  arr.unshift(t); // move-to-top / insert
  if (arr.length > MAX) arr = arr.slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(arr));
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}
