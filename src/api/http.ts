import type { useAuthStore } from '@/stores/auth';

const API_BASE = import.meta.env['VITE_API_URL'] ?? 'http://localhost:3000/v1';

export async function publicFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const isFormData = init.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(init.headers as Record<string, string>),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text();
    let message = `Erreur ${res.status}`;
    try {
      const json = JSON.parse(text) as { message?: string | string[] };
      const msg = json.message;
      if (typeof msg === 'string') message = msg;
      else if (Array.isArray(msg) && msg.length > 0) message = msg[0] ?? message;
    } catch {
      // not JSON — use the status code message
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export function createApiClient(store: ReturnType<typeof useAuthStore>) {
  return async function apiFetch<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> {
    const token = store.token;
    const schoolId = store.schoolId;

    const isFormData = init.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(init.headers as Record<string, string>),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (schoolId) headers['X-School-Id'] = schoolId;

    const res = await fetch(`${API_BASE}${path}`, { ...init, headers });

    if (res.status === 401) {
      store.logout();
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const text = await res.text();
      let message = `Erreur ${res.status}`;
      try {
        const json = JSON.parse(text) as { message?: string | string[] };
        const msg = json.message;
        if (typeof msg === 'string') message = msg;
        else if (Array.isArray(msg) && msg.length > 0) message = msg[0] ?? message;
      } catch {
        // not JSON — use the status code message
      }
      throw new Error(message);
    }

    return res.json() as Promise<T>;
  };
}
