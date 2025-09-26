const BASE_URL = import.meta.env.DEV ? "/omdb" : "https://www.omdbapi.com/";

function getKey() {
  const key = import.meta.env.VITE_OMDB_API_KEY as string | undefined;
  if (!key) throw new Error("Missing VITE_OMDB_API_KEY in .env");
  return key;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function apiGet(params: Record<string, string>, timeoutMs = 6000) {
  // en dev, BASE_URL est relatif → construit une URL absolue sur localhost
  const url = new URL(BASE_URL, window.location.origin);
  url.searchParams.set("apikey", getKey());
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  let lastErr: any;
  for (let attempt = 0; attempt < 3; attempt++) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort("timeout"), timeoutMs);

    try {
      const res = await fetch(url.toString(), { signal: controller.signal });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      return await res.json();
    } catch (e) {
      lastErr = e;

      await sleep(300 * attempt);
    } finally {
      clearTimeout(t);
    }
  }
  throw lastErr;
}
