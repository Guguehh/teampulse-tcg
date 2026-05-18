import { readJson, removeKey, writeJson } from "@/lib/admin/storage";

type AdminSession = {
  ok: true;
  createdAt: string;
};

const SESSION_KEY = "session";

export function getAdminPassword() {
  const env = (import.meta as unknown as { env?: Record<string, string> }).env;
  return env?.VITE_ADMIN_PASSWORD || "admin";
}

export function getSession(): AdminSession | null {
  return readJson<AdminSession | null>(SESSION_KEY, null);
}

export function isAuthed() {
  return Boolean(getSession()?.ok);
}

export function signIn(password: string) {
  const ok = password === getAdminPassword();
  if (!ok) return false;
  writeJson<AdminSession>(SESSION_KEY, { ok: true, createdAt: new Date().toISOString() });
  window.dispatchEvent(new Event("admin-auth-changed"));
  return true;
}

export function signOut() {
  removeKey(SESSION_KEY);
  window.dispatchEvent(new Event("admin-auth-changed"));
}
