const PREFIX = "duelist_noa_admin";

export function storageKey(key: string) {
  return `${PREFIX}:${key}`;
}

export function readJson<T>(key: string, fallbackValue: T): T {
  if (typeof window === "undefined") return fallbackValue;
  try {
    const raw = localStorage.getItem(storageKey(key));
    if (!raw) return fallbackValue;
    return JSON.parse(raw) as T;
  } catch {
    return fallbackValue;
  }
}

export function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(key), JSON.stringify(value));
}

export function removeKey(key: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKey(key));
}

export function clearAdminStorage() {
  if (typeof window === "undefined") return;
  const prefix = `${PREFIX}:`;
  for (let i = localStorage.length - 1; i >= 0; i -= 1) {
    const k = localStorage.key(i);
    if (k && k.startsWith(prefix)) localStorage.removeItem(k);
  }
  window.dispatchEvent(new Event("admin-db-changed"));
  window.dispatchEvent(new Event("admin-auth-changed"));
}
