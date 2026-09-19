const STORAGE_KEY = "freetraveler:favorite-destinations";

type Listener = () => void;
const listeners = new Set<Listener>();

function readSet(): Set<string> {
  if (typeof window === "undefined") {
    return new Set();
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? new Set<string>(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function writeSet(next: Set<string>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
  } catch {
    // localStorage unavailable (private browsing, quota exceeded) - toggle no-ops silently.
  }
  for (const listener of listeners) listener();
}

export function isFavorite(destinationId: string): boolean {
  return readSet().has(destinationId);
}

export function getFavoriteIds(): string[] {
  return Array.from(readSet());
}

/** Adds/removes destinationId from the favorite set. Returns the new state. */
export function toggleFavorite(destinationId: string): boolean {
  const set = readSet();
  let nowFavorite: boolean;
  if (set.has(destinationId)) {
    set.delete(destinationId);
    nowFavorite = false;
  } else {
    set.add(destinationId);
    nowFavorite = true;
  }
  writeSet(set);
  return nowFavorite;
}

export function subscribeFavorites(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
